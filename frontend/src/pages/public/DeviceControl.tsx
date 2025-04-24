import React, { useEffect } from "react";
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
  FormLabel 
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
  Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Device, DeviceType } from "@/types/deviceType"
import { useDeviceStore } from "@/store/useDeviceStore";

interface AdafruitConfig {
  username: string;
  key: string;
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
    isControlableDevice,
    getDeviceControlRange
  } = useDeviceStore();

  // All devices combined
  const allDevices = [...dedicatedDevices, ...sharedDevices];

  // State for Adafruit configuration using React Hook Form
  const adafruitForm = useForm({
    defaultValues: {
      username: "plant_enthusiast",
      key: "aio_XXXXXXXXXXXXXXXXXXXX",
    }
  });

  // Fetch devices on component mount
  useEffect(() => {
    fetchAllDevices();
    // Fetch devices every 30 seconds to keep data fresh
    const intervalId = setInterval(() => {
      fetchAllDevices();
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
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

  // Get current device value (considering pending values)
  const getDeviceValue = (device: Device) => {
    // If there's a pending value for this device, use that
    if (pendingValues && pendingValues[device._id] !== undefined) {
      return pendingValues[device._id];
    }
    // Otherwise use the actual device value
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
        case "humid_id": unit = "%"; break;
        case "soil": unit = "%"; break;
      }
      
      return <div className="font-medium">{device.value}{unit}</div>;
    }

    // Get the current value (including any pending change)
    const currentValue = getDeviceValue(device);
    const hasPendingChange = pendingValues && pendingValues[device._id] !== undefined;
    
    // Controls for controllable devices
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
  
  const onAdafruitSubmit = (data: AdafruitConfig) => {
    alert("Adafruit configuration updated successfully!");
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
          <TabsTrigger value="adafruit">Adafruit Configuration</TabsTrigger>
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
              <Form {...adafruitForm}>
                <form onSubmit={adafruitForm.handleSubmit(onAdafruitSubmit)} className="space-y-6">
                  <FormField
                    control={adafruitForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Adafruit Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="col-span-3" />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={adafruitForm.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Adafruit AIO Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="col-span-3" />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit">Save Configuration</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceControlPage;