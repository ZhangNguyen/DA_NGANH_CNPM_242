import { create } from 'zustand';
import { apiGetAllPlants, apiCreatePlantBy, apiDeletePlantByID, apiUpdatePlantByID } from '@/apis/plant';

interface Plant {
  id?: number;
  type: string;
  location: string;
  limitWatering: number;
  limitTemp: number;
  status: string[];
  pumpDevice?: number;
  soilDevice?: number;
}

interface PlantStore {
  plants: Plant[];
  loading: boolean;
  error: string | null;
  fetchPlants: () => Promise<void>;
  addPlant: (newPlant: Plant) => Promise<Plant | null>;
  deletePlant: (id: number) => Promise<void>;
  updatePlant: (id: number, updatedPlant: Partial<Plant>) => Promise<void>;
}

export const usePlantStore = create<PlantStore>((set, get) => ({
  plants: [],
  loading: false,
  error: null,

  fetchPlants: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiGetAllPlants();
      set({ plants: res.data });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch plants' });
    } finally {
      set({ loading: false });
    }
  },

  addPlant: async (newPlant) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCreatePlantBy(newPlant);
      set({ plants: [...get().plants, res.data] });
      return res.data; // Trả về dữ liệu mới (Plant object)
    } catch (err: any) {
      set({ error: err.message || 'Failed to add plant' });
      return null; // Nếu thất bại thì trả về null
    } finally {
      set({ loading: false });
    }
  }
  ,

  deletePlant: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeletePlantByID(String(id));
      set({ plants: get().plants.filter(p => p.id !== id) });
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete plant' });
    } finally {
      set({ loading: false });
    }
  },

  updatePlant: async (id, updatedPlant) => {
    set({ loading: true, error: null });
    try {
      const res = await apiUpdatePlantByID(String(id)); // nếu bạn cần gửi data, sửa lại hàm api bên kia
      // Giả định res.data là plant đã update xong
      set({
        plants: get().plants.map(p => (p.id === id ? { ...p, ...updatedPlant } : p)),
      });
      return res.data; // Trả về dữ liệu đã cập nhật (Plant object)
    } catch (err: any) {
      set({ error: err.message || 'Failed to update plant' });
    } finally {
      set({ loading: false });
    }
  }
}));
