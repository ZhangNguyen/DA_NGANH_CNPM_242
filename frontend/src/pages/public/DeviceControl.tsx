// import { apiLoginAdafruit, apiGetAdafruitInfo } from "@/apis/adfruit"
// import { useUserStore } from "@/store/useUserStore"
// import { apiGetSensorData, apiGetSensorDataById } from "@/apis/sensor"

// const DeviceControl = () => {
//   const {} = useUserStore()
//   const getSensorData = async () => {
//     const response = await apiGetSensorData()
//   }
//   const adfruit_data = {
//     adafruit_username: import.meta.env.VITE_ADAFRUIT_USERNAME,
//     adafruit_key: import.meta.env.VITE_ADAFRUIT_KEY
//   }
//   const loginAdafruit = async () => {
//     const response = await apiLoginAdafruit(adfruit_data)
//   }
//   const getAdafruitInfo = async () => {
//     const response = await apiGetAdafruitInfo()
//   }
//   const getSensorDataById = async () => {
//     const sensorId = '67e3bae9e5a0721202a29e06';
//     const response = await apiGetSensorDataById(sensorId)
//   }
//   return (
//     <div>DeviceControl</div>
//   )
// }

// export default DeviceControl
import React, { useState } from "react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
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
import { Droplet, Fan, LightbulbIcon, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

// Define types
type DeviceType = "waterPump" | "fan" | "light";

interface Device {
  id: number;
  name: string;
  type: DeviceType;
  status: "online" | "offline";
  value: number; // For controlling intensity, on/off state, etc.
}

interface AdafruitConfig {
  username: string;
  key: string;
}

// Component for device control page
const DeviceControl: React.FC = () => {
  // State for devices
  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: "Water Pump 1", type: "waterPump", status: "online", value: 0 },
    { id: 2, name: "Ceiling Fan", type: "fan", status: "online", value: 1 },
    { id: 3, name: "Growth Light", type: "light", status: "online", value: 75 },
    { id: 4, name: "Watering System 2", type: "waterPump", status: "offline", value: 0 },
    { id: 5, name: "Ventilation Fan", type: "fan", status: "offline", value: 0 },
    { id: 6, name: "LED Panel", type: "light", status: "online", value: 50 },
  ]);

  // State for Adafruit configuration
  const [adafruitConfig, setAdafruitConfig] = useState<AdafruitConfig>({
    username: "plant_enthusiast",
    key: "aio_XXXXXXXXXXXXXXXXXXXX",
  });

  // State for device being edited
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState<DeviceType>("waterPump");

  // Handle device value change
  const handleDeviceValueChange = (id: number, newValue: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, value: newValue } : device
    ));
  };

  // Handle device control button click (for water pump and fan)
  const handleControlClick = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, value: device.value === 0 ? 1 : 0 } : device
    ));
  };

  // Handle adding new device
  const handleAddDevice = () => {
    if (newDeviceName.trim() === "") return;
    
    const newDevice: Device = {
      id: devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1,
      name: newDeviceName,
      type: newDeviceType,
      status: "online",
      value: 0
    };
    
    setDevices([...devices, newDevice]);
    setNewDeviceName("");
    setNewDeviceType("waterPump");
  };

  // Handle updating device
  const handleUpdateDevice = () => {
    if (!editingDevice) return;
    
    setDevices(devices.map(device => 
      device.id === editingDevice.id ? editingDevice : device
    ));
    
    setIsEditDialogOpen(false);
    setEditingDevice(null);
  };

  // Handle deleting device
  const handleDeleteDevice = (id: number) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  // Render device control based on device type
  const renderDeviceControl = (device: Device) => {
    if (device.status === "offline") {
      return <div className="text-gray-400">Device offline</div>;
    }

    switch (device.type) {
      case "waterPump":
        return (
          <Button 
            variant={device.value > 0 ? "default" : "outline"}
            onClick={() => handleControlClick(device.id)}
            className="w-32"
          >
            {device.value > 0 ? "Stop" : "Water"}
          </Button>
        );
      case "fan":
        return (
          <Button 
            variant={device.value > 0 ? "default" : "outline"}
            onClick={() => handleControlClick(device.id)}
            className="w-32"
          >
            {device.value > 0 ? "Turn Off" : "Turn On"}
          </Button>
        );
      case "light":
        return (
          <div className="flex items-center gap-4 max-w-64">
            <span className="min-w-8">{device.value}%</span>
            <Slider 
              value={[device.value]} 
              min={0} 
              max={100}
              step={1}
              onValueChange={(value) => handleDeviceValueChange(device.id, value[0])}
              className="w-40"
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Get device icon based on type
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case "waterPump":
        return <Droplet className="h-5 w-5" />;
      case "fan":
        return <Fan className="h-5 w-5" />;
      case "light":
        return <LightbulbIcon className="h-5 w-5" />;
    }
  };

  // Form for Adafruit configuration
  const adafruitForm = useForm({
    defaultValues: adafruitConfig
  });
  
  const onAdafruitSubmit = (data: AdafruitConfig) => {
    setAdafruitConfig(data);
    alert("Adafruit configuration updated successfully!");
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="devices" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="adafruit">Adafruit Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-6">
                <Input 
                  placeholder="Enter device name..." 
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="max-w-sm"
                />
                <Select 
                  value={newDeviceType} 
                  onValueChange={(value: DeviceType) => setNewDeviceType(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waterPump">Water Pump</SelectItem>
                    <SelectItem value="fan">Fan</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddDevice}>Add Device</Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Control</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {getDeviceIcon(device.type)}
                          {device.name}
                        </TableCell>
                        <TableCell>
                          {device.type === "waterPump" && "Water Pump"}
                          {device.type === "fan" && "Fan"}
                          {device.type === "light" && "Light"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={device.status === "online" ? "default" : "secondary"}>
                            {device.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{renderDeviceControl(device)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => {
                                setEditingDevice({...device});
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the device "{device.name}" and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteDevice(device.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Edit Device Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Device</DialogTitle>
              </DialogHeader>
              {editingDevice && (
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Name</FormLabel>
                    <Input 
                      className="col-span-3" 
                      value={editingDevice.name}
                      onChange={(e) => setEditingDevice({...editingDevice, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Type</FormLabel>
                    <Select 
                      value={editingDevice.type} 
                      onValueChange={(value: DeviceType) => 
                        setEditingDevice({...editingDevice, type: value})
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waterPump">Water Pump</SelectItem>
                        <SelectItem value="fan">Fan</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Status</FormLabel>
                    <Select 
                      value={editingDevice.status} 
                      onValueChange={(value: "online" | "offline") => 
                        setEditingDevice({...editingDevice, status: value})
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateDevice}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

export default DeviceControl;