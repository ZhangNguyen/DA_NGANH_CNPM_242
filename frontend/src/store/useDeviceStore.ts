import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import debounce from 'lodash/debounce' // Import debounce from lodash

import { 
    apiGetAllDedicatedDevice, 
    apiGetAllSharedDevice, 
    apiGetDedicatedDeviceByID, 
    apiGetSharedDeviceByID
} from '@/apis/device'

import {
    apiFan, apiLight, apiRGB, apiWatering
} from '@/apis/command'

import { Device, DeviceType } from "@/types/deviceType"

interface DeviceStore {
  // State
  dedicatedDevices: Device[];
  sharedDevices: Device[];
  isLoading: boolean;
  error: string | null;
  pendingValues: Record<number, number>; // Stores temporary values during debounce

  // Actions
  fetchAllDevices: () => Promise<void>;
  fetchDedicatedDevices: () => Promise<void>;
  fetchSharedDevices: () => Promise<void>;
  getDeviceById: (id: number, isShared: boolean) => Promise<Device | null>;
  
  // Device control actions
  controlFan: (deviceId: number, value: number) => void;
  controlLight: (deviceId: number, value: number) => void;
  controlRGB: (deviceId: number, value: number) => Promise<void>;
  controlWatering: (deviceId: number, value: number) => Promise<void>;
  
  // Helper methods
  updateDeviceValue: (deviceId: number, value: number, isShared: boolean) => void;
  updatePendingValue: (deviceId: number, value: number) => void;
  isSensorType: (deviceType: DeviceType) => boolean;
  isControlableDevice: (deviceType: DeviceType) => boolean;
  getDeviceControlRange: (deviceType: DeviceType) => { min: number; max: number };
}

// Create the store
export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set, get) => {
      // Create debounced API calls for fan and light
      const debouncedFanControl = debounce(async (deviceId: number, value: number) => {
        try {
          await apiFan(deviceId, value);
          // Update the actual device value after successful API call
          get().updateDeviceValue(deviceId, value, true);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to control fan" });
        }
      }, 500); // 500ms debounce delay

      const debouncedLightControl = debounce(async (deviceId: number, value: number) => {
        try {
          await apiLight(deviceId, value);
          // Update the actual device value after successful API call
          get().updateDeviceValue(deviceId, value, true);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to control light" });
        }
      }, 500); // 500ms debounce delay

      return {
        // Initial state
        dedicatedDevices: [],
        sharedDevices: [],
        isLoading: false,
        error: null,
        pendingValues: {},

        // Fetch all devices (both dedicated and shared)
        fetchAllDevices: async () => {
          set({ isLoading: true, error: null });
          try {
            await Promise.all([
              get().fetchDedicatedDevices(),
              get().fetchSharedDevices()
            ]);
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to fetch devices" });
          } finally {
            set({ isLoading: false });
          }
        },

        // Fetch dedicated devices
        fetchDedicatedDevices: async () => {
          try {
            const response = await apiGetAllDedicatedDevice();
            set({ dedicatedDevices: response.data || [] });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to fetch dedicated devices" });
            throw error;
          }
        },

        // Fetch shared devices
        fetchSharedDevices: async () => {
          try {
            const response = await apiGetAllSharedDevice();
            set({ sharedDevices: response.data || [] });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to fetch shared devices" });
            throw error;
          }
        },

        // Get a specific device by ID
        getDeviceById: async (id: number, isShared: boolean) => {
          try {
            const api = isShared ? apiGetSharedDeviceByID : apiGetDedicatedDeviceByID;
            const response = await api(id);
            return response.data || null;
          } catch (error) {
            set({ error: error instanceof Error ? error.message : `Failed to fetch device with ID ${id}` });
            return null;
          }
        },

        // Modified device control functions with debouncing
        controlFan: (deviceId: number, value: number) => {
          // Update pending value immediately for responsive UI
          get().updatePendingValue(deviceId, value);
          // Call the debounced function
          debouncedFanControl(deviceId, value);
        },

        controlLight: (deviceId: number, value: number) => {
          // Update pending value immediately for responsive UI
          get().updatePendingValue(deviceId, value);
          // Call the debounced function
          debouncedLightControl(deviceId, value);
        },

        // Regular (non-debounced) control functions for binary devices
        controlRGB: async (deviceId: number, value: number) => {
          try {
            await apiRGB(deviceId, value);
            get().updateDeviceValue(deviceId, value, true);
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to control RGB" });
            throw error;
          }
        },

        controlWatering: async (deviceId: number, value: number) => {
          try {
            await apiWatering(deviceId, value);
            get().updateDeviceValue(deviceId, value, false);
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to control watering" });
            throw error;
          }
        },

        // Update device value in state after control action
        updateDeviceValue: (deviceId: number, value: number, isShared: boolean) => {
          // Also clear this device from pending values
          set(state => {
            const newPendingValues = { ...state.pendingValues };
            delete newPendingValues[deviceId];
            
            if (isShared) {
              return {
                pendingValues: newPendingValues,
                sharedDevices: state.sharedDevices.map(device => 
                  device._id === deviceId ? { ...device, value } : device
                )
              };
            } else {
              return {
                pendingValues: newPendingValues,
                dedicatedDevices: state.dedicatedDevices.map(device => 
                  device._id === deviceId ? { ...device, value } : device
                )
              };
            }
          });
        },

        // Update pending value for immediate UI feedback during debounce
        updatePendingValue: (deviceId: number, value: number) => {
          set(state => ({
            pendingValues: { ...state.pendingValues, [deviceId]: value }
          }));
        },

        // Helper to check if a device type is a sensor
        isSensorType: (deviceType: DeviceType) => {
          return ["soil", "humid_id", "temp"].includes(deviceType);
        },

        // Helper to check if a device type is controllable
        isControlableDevice: (deviceType: DeviceType) => {
          return ["pump", "fan_level", "RGB", "light"].includes(deviceType);
        },

        // Helper to get the value range for a device type
        getDeviceControlRange: (deviceType: DeviceType) => {
          switch (deviceType) {
            case "fan_level":
            case "light":
              return { min: 0, max: 100 }; // Intensity from 0-100
            case "pump":
            case "RGB":
              return { min: 0, max: 1 }; // Binary on/off (0 or 1)
            default:
              return { min: 0, max: 0 }; // Sensors are not controllable
          }
        }
      };
    },
    {
      name: 'device-store', // Storage key for localStorage
      partialize: (state) => {
        // Don't persist these transient values in localStorage
        const { isLoading, error, pendingValues, ...rest } = state;
        return rest;
      }
    }
  )
);