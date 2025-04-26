import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Droplet, 
  Fan, 
  LightbulbIcon, 
  ThermometerIcon, 
  Droplets, 
  PaletteIcon,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Device, DeviceType } from "@/types/deviceType"
import { useDeviceStore } from "@/store/useDeviceStore";
import { apiGetAdafruitInfo, apiLoginAdafruit } from '@/apis/adfruit'
import { socket } from '@/apis/socket'
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdafruitConfig {
  adafruit_username: string;
  adafruit_key: string;
}

const DeviceControlPage: React.FC = () => {
  // Get state and actions from Zustand store
  const { 
    dedicatedDevices, 
    sharedDevices, 
    isLoading, 
    error, 
    pendingValues,
    fetchAllDevices,
    controlFan,
    controlLight,
    controlRGB,
    controlWatering,
    updatePendingValue,
    isSensorType,
    getDeviceControlRange
  } = useDeviceStore();
  
  // New state for Adafruit config status
  const [adafruitStatus, setAdafruitStatus] = useState<{
    isConfigured: boolean;
    isLoading: boolean;
    error: string | null;
    success: string | null;
  }>({
    isConfigured: false,
    isLoading: false,
    error: null,
    success: null
  });
  
  //Sensor bao gồm [light,humid,temp]
  
  const [sensorData, setSensorData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [plantStatus, setPlantStatus] = useState(null);

  socket.on("sensor_update", (data) => {
    console.log("Sensor updated:", data);
    setSensorData(data);
    console.log(sensorData)
  });
  socket.on("soil_update", (data) => {
    console.log("Soil updated:", data);
    setSoilData(data);
    console.log(soilData)
  });
  socket.on("plant-status-update", (data) => {
    console.log("Plant status update:", data);
    setPlantStatus(data);
    console.log(plantStatus)
  });

  // All devices combined
  const allDevices = [...dedicatedDevices, ...sharedDevices];

  // State for Adafruit configuration using React Hook Form
  const adafruitForm = useForm({
    defaultValues: {
      adafruit_username: "",
      adafruit_key: "",
    }
  });
  
  // Fetch Adafruit configuration on component mount
  const getAdafruitInfo = async () => {
    try {
      setAdafruitStatus(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await apiGetAdafruitInfo();
      
      // Check if response has adafruit config data
      if (response) {
        const { adafruit_username, adafruit_key } = response.data;
        
        // Update form with retrieved values
        adafruitForm.reset({
          adafruit_username: adafruit_username || "",
          adafruit_key: adafruit_key || ""
        });
        
        // Set configured status based on whether both values exist
        setAdafruitStatus(prev => ({
          ...prev,
          isConfigured: !!(adafruit_username && adafruit_key),
          isLoading: false
        }));
      } else {
        // No configuration found
        setAdafruitStatus(prev => ({
          ...prev,
          isConfigured: false,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error("Failed to get Adafruit info:", error);
      setAdafruitStatus(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to retrieve Adafruit configuration"
      }));
    }
  };
  
  // Fetch devices on component mount
  useEffect(() => {
    fetchAllDevices();
    getAdafruitInfo();
  }, [fetchAllDevices]);

  // Handle device control based on type
  const handleDeviceControl = (device: Device, value: number) => {
    if (device.status === "deactive") return;
    
    try {
      switch (device.devicetype) {
        case "fan_level":
          controlFan(device._id, value);
          break;
        case "light":
          controlLight(device._id, value);
          break;
        case "RGB":
          controlRGB(device._id, value);
          break;
        case "pump":
          controlWatering(device._id, value);
          break;
      }
    } catch (error) {
      console.error(`Failed to control ${device.devicetype}:`, error);
    }
  };

  // Toggle binary devices (on/off)
  const handleToggleDevice = (device: Device) => {
    const newValue = device.value === 0 ? 1 : 0;
    handleDeviceControl(device, newValue);
  };

  // Get device icon based on type
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case "pump":
        return <Droplet className="h-5 w-5" />;
      case "fan_level":
        return <Fan className="h-5 w-5" />;
      case "light":
        return <LightbulbIcon className="h-5 w-5" />;
      case "RGB":
        return <PaletteIcon className="h-5 w-5" />;
      case "temp":
        return <ThermometerIcon className="h-5 w-5" />;
      case "humid_id":
      case "soil":
        return <Droplets className="h-5 w-5" />;
    }
  };

  // Get friendly device type name
  const getDeviceTypeName = (type: DeviceType) => {
    switch (type) {
      case "pump": return "Water Pump";
      case "fan_level": return "Fan";
      case "light": return "Light";
      case "RGB": return "RGB Light";
      case "temp": return "Temperature Sensor";
      case "humid_id": return "Humidity Sensor";
      case "soil": return "Soil Moisture";
      default: return type;
    }
  };

  const getDeviceValue = (device: Device) => {
    if (pendingValues && pendingValues[device._id] !== undefined) {
      return pendingValues[device._id];
    }
    return device.value;
  };

  // Render device control UI based on device type
  const renderDeviceControl = (device: Device) => {
    if (device.status === "deactive") {
      return <div className="text-gray-400">Device offline</div>;
    }

    // If it's a sensor, just show the current value
    if (isSensorType(device.devicetype)) {
      let unit = "";
      
      switch (device.devicetype) {
        case "temp": unit = "°C"; break;
        case "humid_id": unit = ""; break;
        case "soil": unit = ""; break;
      }
      
      return <div className="font-medium">{device.value}{unit}</div>;
    }

    const currentValue = getDeviceValue(device);
    const hasPendingChange = pendingValues && pendingValues[device._id] !== undefined;
    
    switch (device.devicetype) {
      case "pump":
        return (
          <Button 
            variant={currentValue > 0 ? "default" : "outline"}
            onClick={() => handleToggleDevice(device)}
            className="w-32"
          >
            {currentValue > 0 ? "Stop" : "Water"}
          </Button>
        );
      case "fan_level":
        if (getDeviceControlRange(device.devicetype).max === 1) {
          // Binary fan control
          return (
            <Button 
              variant={currentValue > 0 ? "default" : "outline"}
              onClick={() => handleToggleDevice(device)}
              className="w-32"
            >
              {currentValue > 0 ? "Turn Off" : "Turn On"}
            </Button>
          );
        } else {
          // Variable fan speed with pending indicator
          return (
            <div className="flex items-center gap-4 max-w-64">
              <div className="min-w-16 flex items-center gap-1">
                <span>{currentValue}%</span>
                {hasPendingChange && (
                  <Loader2 className="h-3 w-3 animate-spin text-blue-500 ml-1" />
                )}
              </div>
              <Slider 
                value={[currentValue]} 
                min={0} 
                max={100}
                step={1}
                onValueChange={(value) => {
                  // Update the pending value immediately
                  updatePendingValue(device._id, value[0]);
                  // Trigger the debounced control function
                  handleDeviceControl(device, value[0]);
                }}
                className="w-40"
              />
            </div>
          );
        }
      case "light":
        // Light intensity with pending indicator
        return (
          <div className="flex items-center gap-4 max-w-64">
            <div className="min-w-16 flex items-center gap-1">
              <span>{currentValue}%</span>
              {hasPendingChange && (
                <Loader2 className="h-3 w-3 animate-spin text-blue-500 ml-1" />
              )}
            </div>
            <Slider 
              value={[currentValue]} 
              min={0} 
              max={100}
              step={1}
              onValueChange={(value) => {
                // Update the pending value immediately
                updatePendingValue(device._id, value[0]);
                // Trigger the debounced control function
                handleDeviceControl(device, value[0]);
              }}
              className="w-40"
            />
          </div>
        );
      case "RGB":
        return (
          <Button 
            variant={currentValue > 0 ? "default" : "outline"}
            onClick={() => handleToggleDevice(device)}
            className="w-32"
          >
            {currentValue > 0 ? "Turn Off" : "Turn On"}
          </Button>
        );
      default:
        return null;
    }
  };
  
  const onAdafruitSubmit = async (data: AdafruitConfig) => {
    try {
      setAdafruitStatus(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null, 
        success: null 
      }));
      
      // Call API to login/update Adafruit configuration
      const response = await apiLoginAdafruit({
        adafruit_username: data.adafruit_username,
        adafruit_key: data.adafruit_key
      });
      
      if (response) {
        setAdafruitStatus(prev => ({
          ...prev,
          isConfigured: true,
          isLoading: false,
          success: "Adafruit configuration updated successfully!"
        }));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setAdafruitStatus(prev => ({
            ...prev,
            success: null
          }));
        }, 3000);
      } else {
        throw new Error("Failed to update Adafruit configuration");
      }
    } catch (error) {
      console.error("Adafruit login error:", error);
      setAdafruitStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to update Adafruit configuration"
      }));
    }
  };

  if (isLoading && allDevices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading devices...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Device Control</h1>

      <Tabs defaultValue="devices" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="adafruit">
            Adafruit Configuration
            {adafruitStatus.isConfigured && (
              <CheckCircle className="h-4 w-4 ml-1 text-green-500" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Connected Devices</CardTitle>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  Error: {error}
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Control / Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allDevices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                          No devices found. Connect devices to see them here.
                        </TableCell>
                      </TableRow>
                    ) : (
                      allDevices.map((device) => (
                        <TableRow key={device._id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {getDeviceIcon(device.devicetype)}
                            {device.name}
                          </TableCell>
                          <TableCell>
                            {getDeviceTypeName(device.devicetype)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={device.status === "active" ? "default" : "secondary"}>
                              {device.status === "active" ? "Online" : "Offline"}
                            </Badge>
                          </TableCell>
                          <TableCell>{renderDeviceControl(device)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adafruit">
          <Card>
            <CardHeader>
              <CardTitle>Adafruit Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {adafruitStatus.error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{adafruitStatus.error}</AlertDescription>
                </Alert>
              )}
              
              {adafruitStatus.success && (
                <Alert variant="default" className="mb-4 bg-green-50 text-green-700 border-green-200">
                  <AlertDescription className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {adafruitStatus.success}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...adafruitForm}>
                <form onSubmit={adafruitForm.handleSubmit(onAdafruitSubmit)} className="space-y-6">
                  <FormField
                    control={adafruitForm.control}
                    name="adafruit_username"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Adafruit Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="col-span-3" />
                          </FormControl>
                        </div>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adafruitForm.control}
                    name="adafruit_key"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Adafruit AIO Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="col-span-3" />
                          </FormControl>
                        </div>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    {adafruitStatus.isLoading ? (
                      <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Saving...
                      </Button>
                    ) : (
                      <Button type="submit">
                        {adafruitStatus.isConfigured ? "Update Configuration" : "Save Configuration"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
              
              {adafruitStatus.isConfigured && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded border border-blue-200 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <p>Your Adafruit IO account is connected and ready to use.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceControlPage;