import { useState, useEffect } from "react";
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
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
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
import { Badge } from "@/components/ui/badge";
import { Leaf, Pencil, Search, Trash2, Droplet, Fan, AlertCircle } from "lucide-react";
import { 
  apiGetAllPlants, 
  apiUpdatePlantByID, 
  apiDeletePlantByID,
} from "@/apis/plant";
import { toast } from "react-hot-toast";
import { Device } from "@/types/deviceType"
import { useDeviceStore } from "@/store/useDeviceStore";
import { usePlantStore } from "@/store/usePlantStore";
import { socket } from '@/apis/socket'
import { PlantStatusData } from "@/types/socket"

const ManagePlant = () => {
  const [plantStatus, setPlantStatus] = useState<PlantStatusData>({});
  const [plants, setPlants] = useState<Plant[]>([]); // Khởi tạo là mảng trống
  const [newPlant, setNewPlant] = useState<{ 
    type: string;
    location: string;
    limitWatering: number;
    limitTemp: number;
    status: string[]
    pumpDevice?: number;
    soilDevice?: number;
  }>({ 
    type: "",
    location: "",
    limitWatering: 0,
    limitTemp: 0,
    status: ["normal"],
    pumpDevice: undefined,
    soilDevice: undefined,
  });
  interface Plant {
    id: string;
    type: string;
    location: string;
    status: string[];
    limitWatering: number;
    limitTemp: number;
    pumpDeviceId?: number | Device;
    soilDeviceId?: number | Device;
    updatedAt: string;
  }
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 5;
  const [search, setSearch] = useState("");
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [noPumpErrorPlant, setNoPumpErrorPlant] = useState<Plant | null>(null);
  const [showNoPumpError, setShowNoPumpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usedPumpDevices, setUsedPumpDevices] = useState<Device[]>([]);
  const [usedSoilDevices, setUsedSoilDevices] = useState<Device[]>([]);
  const [waterActionPlant] = useState<Plant | null>(null);
  const [wateringPlants, setWateringPlants] = useState<{ [plantId: string]: boolean }>({});
  const [fanningPlants, setFanningPlants] = useState<{ [key: string]: boolean }>({});
  const [isWaterActionOpen, setIsWaterActionOpen] = useState(false);
  const [soilDevice, setSoilDevice] = useState<number | undefined>(undefined);
  const [pumpDevice, setPumpDevice] = useState<number | undefined>(undefined);
  const [devices, setDevices] = useState<{ soil: Device[]; pump: Device[], fan: Fan | null }>({
    soil: [],
    pump: [],
    fan: null,
  });
  type Fan = {
    _id: number;
    devicetype: 'fan_level';
    value?: 1 | 0;
    actiondevice?: string; // ObjectId dạng string
    timeAction?: string; // ISO date string
  };

  const {controlFan, controlWatering} = useDeviceStore();
  const {addPlant } = usePlantStore();

  const fetchDevices = async () => {
    try {
      setLoading(true);
      await useDeviceStore.getState().fetchAllDevices();
      
      const soilDevices = useDeviceStore.getState().dedicatedDevices.filter(device => device.devicetype === "soil");
      const pumpDevices = useDeviceStore.getState().dedicatedDevices.filter(device => device.devicetype === "pump");
      const fanDevice = useDeviceStore.getState().dedicatedDevices.find(device => device.devicetype === "fan_level") as Fan | null;
      
      setDevices({ soil: soilDevices, pump: pumpDevices, fan: fanDevice });
      return { soil: soilDevices, pump: pumpDevices, fan: fanDevice };
    } catch (error: any) {
      console.error("Lỗi khi lấy thiết bị dedicated:", error);
      toast.error("Không thể lấy dữ liệu thiết bị.");
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPlant = async () => {
    try {
      setLoading(true);
  
      const plantsRes = await apiGetAllPlants();
      const fetchedPlants = plantsRes.data.data;
      console.log("Fetched plants:", fetchedPlants);
      if (Array.isArray(fetchedPlants)) {
        const normalizedPlants = fetchedPlants.map(p => ({
          ...p,
          id: p._id,
          updatedAt: new Date(p.updatedAt).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          devices: {
            pump: p.pumpDeviceId,
            soil: p.soilDeviceId,
          }
        }));
        setPlants(normalizedPlants);
        return normalizedPlants;
      } else {
        console.error("Error Data from API:", plantsRes);
        toast.error("Error Data");
        return null;
      }
    } catch (error: any) {
      console.error("Error Detail: ", error);
      toast.error("Error Data");
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const findUsedDevices = (fetchedPlants: any[], fetchedDevices: { soil: any[], pump: any[] }) => {
    if (!fetchedPlants || !fetchedDevices) return;
    
    // Lấy tất cả ID thiết bị soil và pump được sử dụng trong plants
    const usedSoilIds = fetchedPlants
      .map(plant => plant.soilDeviceId?._id || plant.soilDeviceId)
      .filter(id => !!id);
      
    const usedPumpIds = fetchedPlants
      .map(plant => plant.pumpDeviceId?._id || plant.pumpDeviceId)
      .filter(id => !!id);
    
    // Tìm thiết bị tương ứng với ID trong danh sách thiết bị đã fetch
    const usedSoilDevices = fetchedDevices.soil.filter(device => 
      usedSoilIds.includes(device._id || device.id)
    );
    
    const usedPumpDevices = fetchedDevices.pump.filter(device => 
      usedPumpIds.includes(device._id || device.id)
    );
    
    console.log("Used soil devices:", usedSoilDevices);
    console.log("Used pump devices:", usedPumpDevices);
    
    setUsedSoilDevices(usedSoilDevices);
    setUsedPumpDevices(usedPumpDevices);
  };
  
  useEffect(() => {
    const onPlantStatusUpdate = (data: PlantStatusData) => {
      console.log("Plant status update:", data);
      setPlantStatus(data);
    };
    socket.on("plant-status-update", onPlantStatusUpdate);
  
    const fetchAllData = async () => {
      setLoading(true);
      
      // Fetch cả plants và devices song song để tối ưu thời gian
      const [fetchedPlants, fetchedDevices] = await Promise.all([
        fetchPlant(),
        fetchDevices()
      ]);
      
      // Chỉ xử lý sau khi cả hai quá trình fetch hoàn tất
      if (fetchedPlants && fetchedDevices) {
        findUsedDevices(fetchedPlants, fetchedDevices);
      }
      
      setLoading(false);
    };
    
    fetchAllData();
    // refreshData();
    return () => {
      socket.off("plant-status-update", onPlantStatusUpdate);
    };
  }, [plantStatus]);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Làm mới cả plants và devices
      const [fetchedPlants, fetchedDevices] = await Promise.all([
        fetchPlant(),
        fetchDevices()
      ]);
      
      // Xử lý lại thiết bị đang sử dụng
      if (fetchedPlants && fetchedDevices) {
        findUsedDevices(fetchedPlants, fetchedDevices);
      }
    } catch (error) {
      console.error("Lỗi khi làm mới dữ liệu:", error);
      toast.error("Không thể cập nhật dữ liệu mới nhất");
    } finally {
      setLoading(false);
    }
  };
  
  // Không cần useEffect theo dõi plants nữa vì chúng ta đã xử lý sau khi fetch


  
  const availableSoilDevices = devices.soil.filter(device => 
    !usedSoilDevices.some(used => used._id === device._id) ||
    device._id == newPlant.soilDevice 
  );

  const availablePumpDevices = devices.pump.filter(device => 
    !usedPumpDevices.some(used => used._id === device._id) ||
    device._id == newPlant.pumpDevice
  );

  const handleDeviceControl = (device: Device, value: number) => {
      if (device.status === "deactive") return;
      
      try {
        switch (device.devicetype) {
          case "fan_level":
            if (value == 1)
            controlFan(device._id, 50);
          else controlFan(device._id, 0);
            break;
          case "pump":
            controlWatering(device._id, value);
            break;
        }
      } catch (error) {
        console.error(`Failed to control ${device.devicetype}:`, error);
      }
    };

  const handleStatusClick = (plant: Plant, status: string) => {
    const isCurrentlyWatering = wateringPlants[plant.id] || false;
    const newStatus = !isCurrentlyWatering; // Đảo ngược trạng thái

    const fanStatus = fanningPlants[plant.id] || false;
    const newFanStatus = !fanStatus

    // Check if status includes watering
    if (status === "watering") {

      if (!plant.pumpDeviceId) {
        setNoPumpErrorPlant(plant);
        setShowNoPumpError(true);
      } 
      else {
          if (typeof plant.pumpDeviceId === "object") {
            handleDeviceControl(plant.pumpDeviceId, newStatus ? 1 : 0);
            setWateringPlants(prev => ({
              ...prev,
              [plant.id]: newStatus,
            }));
          } else {
            console.error("Invalid pumpDeviceId: Expected a number.");
          }
      }
    }

    else if (status === "fanning") {
      if (devices.fan) {
        if (devices.fan?.value !== undefined) {
          handleDeviceControl(devices.fan as Device, newFanStatus ? 1 : 0);
        // Cập nhật lại trạng thái của cây trong fanningPlants
        setFanningPlants((prev) => ({
          ...prev,
          [plant.id]: newFanStatus, // Cập nhật trạng thái mới
        }));
      } else {
        console.error("Fan device value is undefined.");
      }
    } else {
      console.error("No fan device available.");
    }
  }
};
  
  const filteredPlants = plants.filter(
    (plant) =>
      plant.type &&
      plant.type.toLowerCase().includes(search.toLowerCase())
  )
  
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  
  const currentPlants = filteredPlants.slice(
    (currentPage - 1) * plantsPerPage, 
    currentPage * plantsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddPlant = async () => {
    if (!newPlant.type.trim()) return;    
    try {
      setLoading(true);

      const plantData = {
        type: newPlant.type.trim(),
        location: newPlant.location.trim(),
        limitWatering: newPlant.limitWatering,
        limitTemp: newPlant.limitTemp,
        status: newPlant.status,
        pumpDeviceId: pumpDevice,
        soilDeviceId: soilDevice,
      };
      console.log(plantData)
      const response = await addPlant(plantData); // Call the addPlant function from the store
      
 
      if (response) {
        // Add new plant to local 
        
        fetchPlant(); // Fetch updated data
        fetchDevices(); // Fetch updated devices
        toast.success("Plant has been added successfully");
        // Reset form
        setNewPlant({ 
          type: "",   
          status: ["normal"],                               
          location: "",
          limitWatering: 0,
          limitTemp: 0,
          pumpDevice: undefined,
          soilDevice: undefined,
        });
      }
    } catch (error) {
      console.error('Failed to add plant:', error);
      toast.error("Failed to add plant");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlant = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await apiDeletePlantByID(id);
      
      
      // Remove from local state
      setPlants(plants.filter(plant => plant.id !== id));
      fetchPlant(); // Fetch updated data
      toast.success("Plant has been deleted successfully");
      
      // Adjust current page if necessary
      if (currentPlants.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      
    } catch (error) {
      console.error('Failed to delete plant:', error);
      toast.error("Failed to delete plant");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlant = async () => {
    if (!editingPlant) return;
    
    try {
      setLoading(true);
      const response = await apiUpdatePlantByID(editingPlant.id, editingPlant );
      
      
      if (response.data) {
        refreshData(); // Fetch updated data
        toast.success("Plant has been updated successfully");
      }
      
      setIsEditDialogOpen(false);
      setEditingPlant(null);
    } catch (error) {
      console.error('Failed to update plant:', error);
      toast.error("Failed to update plant");
    } finally {
      setLoading(false);
    }
  };

  const isPlantWatering = (plant: Plant | null) => {
    if (!plant) return false; // Check if plant is null
    return plant.status.includes("watering");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <Leaf className="h-4 w-4" />;
      case "watering":
        return <Droplet className="h-4 w-4" />;
      case "fanning":
        return <Fan className="h-4 w-4" />;   
    }
  };


  const renderDeviceBadges = (plant: Plant) => {

  // Hàm kiểm tra thiết bị có hợp lệ để hiển thị không
  const isValidDevice = (device: any): boolean => {
  if (device && typeof device === "object" && device._id != "0") {
    return !!device.name && device.name !== "0" && device.name.trim() !== "";
  }
  // Nếu chỉ là ID dạng number, vẫn cho phép hiển thị
  if (typeof device === "number" && device !== 0) {
    return true;
  }
  return false;
};


const getDeviceName = (device: any): string => {
  if (typeof device === "object" && device !== null && device._id != "0") {
    return device.name || "Unknown";
  }
  if (typeof device === "number") {
    return `Device id: ${device}`;
  }
  return "Unknown";
};


  // Hàm để lấy key duy nhất cho mỗi badge
  const getDeviceKey = (deviceType: string, device: any): string => {
    try {
      if (typeof device === "object" && device !== null) {
        return `${deviceType}-${device._id || device.id || Date.now()}`;
      }
      return `${deviceType}-${Date.now()}`;
    } catch (error) {
      return `${deviceType}-${Date.now()}-${Math.random()}`;
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {/* Soil Device Badge */}
      {isValidDevice(plant.soilDeviceId) && (
        <Badge 
          variant="outline" 
          className="bg-amber-50 text-amber-800 border-amber-200"
          key={getDeviceKey("soil", plant.soilDeviceId)}
        >
          {getDeviceName(plant.soilDeviceId)}
        </Badge>
      )}
      
      {/* Pump Device Badge */}
      {isValidDevice(plant.pumpDeviceId) && (
        <Badge 
          variant="outline" 
          className="bg-blue-50 text-blue-800 border-blue-200"
          key={getDeviceKey("pump", plant.pumpDeviceId)}
        >
          {getDeviceName(plant.pumpDeviceId)}
        </Badge>
      )}
    </div>
  );
};

  async function toggleWatering(plant: Plant | null) {
    if (!plant) return;

    try {
      setLoading(true);

      // Determine the new status
      const isCurrentlyWatering = plant.status.includes("watering");

      const response = await apiUpdatePlantByID(plant.id, plant);

      if (response.data) {
        // Update the plant in the local state
        setPlants((prevPlants) =>
          prevPlants.map((p) =>
            p.id === plant.id ? response.data : p
          )
        );

        toast.success(
          isCurrentlyWatering
            ? "Watering has been stopped successfully."
            : "Watering has been started successfully."
        );
      }
    } catch (error) {
      console.error("Failed to toggle watering:", error);
      toast.error("Failed to toggle watering.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Plant Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Add Plant Section */}
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search plants..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap items-end gap-4">
              {/* Plant Name */}
              <Input
                placeholder="Enter new plant name..."
                value={newPlant.type}
                onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value })}
                className="flex-1 min-w-[200px]"
              />

              {/* Location */}
              <Input
                placeholder="Enter location..."
                value={newPlant.location}
                onChange={(e) => setNewPlant({ ...newPlant, location: e.target.value })}
                className="flex-1 min-w-[200px]"
              />

              {/* Status */}
              <Select
                value={newPlant.status.length > 0 ? newPlant.status[0] : "normal"}
                onValueChange={(value) => {
                  const statusArray = value === "normal" ? ["normal"] : [value];
                  setNewPlant({ ...newPlant, status: statusArray });
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="watering">Watering</SelectItem>
                  <SelectItem value="fanning">Fanning</SelectItem>
                </SelectContent>
              </Select>

              {/* Limit Watering */}
              <div className="flex flex-col w-32">
                <label className="text-xs text-gray-600 mb-1">Limit Watering</label>
                <Input
                  type="number"
                  placeholder="e.g. 60"
                  value={newPlant.limitWatering ?? ""}
                  onChange={(e) => setNewPlant({ ...newPlant, limitWatering: Number(e.target.value) })}
                />
              </div>

              {/* Limit Temp */}
              <div className="flex flex-col w-32">
                <label className="text-xs text-gray-600 mb-1">Limit Temp</label>
                <Input
                  type="number"
                  placeholder="e.g. 20"
                  value={newPlant.limitTemp ?? ""}
                  onChange={(e) => setNewPlant({ ...newPlant, limitTemp: Number(e.target.value) })}
                />
              </div>

              {/* Add Button */}
              <Button 
                onClick={handleAddPlant} 
                className="bg-green-600 hover:bg-green-700"
                disabled={loading || !newPlant.type.trim()}
              >
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>


            {/* Device selection for new plant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium">Soil:</label>
                <Select
                  value={newPlant.soilDevice ? String(newPlant.soilDevice) : "none"}
                  onValueChange={(value) => {
                    setNewPlant({
                      ...newPlant,
                      soilDevice: value === "none" ? undefined : Number(value),
                    });
                    setSoilDevice(value === "none" ? undefined : Number(value));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Soil Device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableSoilDevices.map((device) => (
                      <SelectItem key={device._id} value={String(device._id)}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium">Pump:</label>
                <Select
                  value={newPlant.pumpDevice ? String(newPlant.pumpDevice) : "none"}
                  onValueChange={(value) => {
                    setNewPlant({
                      ...newPlant,
                      pumpDevice: value === "none" ? undefined : Number(value),
                    });
                    setPumpDevice(value === "none" ? undefined : Number(value));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Pump Device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availablePumpDevices.map((device) => (
                      <SelectItem key={device._id} value={String(device._id)}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Plants Table */}
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No.</TableHead>
                  <TableHead>Plant Name</TableHead>
                  <TableHead className="w-24 text-center">Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-32 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && plants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading plants data...
                    </TableCell>
                  </TableRow>
                ) : currentPlants.length > 0 ? (
                  currentPlants.map((plant, index) => (
                    <TableRow key={plant.id}>
                      <TableCell className="text-center font-medium">
                        {(currentPage - 1) * plantsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        {plant.type}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          {plant.status.includes("watering") && (
                            <span
                            className={`px-2 py-1 rounded-full text-xs flex items-center justify-center gap-1
                              ${wateringPlants[plant.id] ? "bg-blue-400 text-white" : "bg-blue-100 text-blue-800"}
                              cursor-pointer hover:bg-blue-200`}
                              onClick={() => handleStatusClick(plant, "watering")}
                            >
                              {getStatusIcon("watering")} Watering
                            </span>
                          )}
                          {plant.status.includes("fanning") && (
                            <span
                            className={`px-2 py-1 rounded-full text-xs flex items-center justify-center gap-1
                              ${fanningPlants[plant.id] ? "bg-purple-200 text-purple-900" : "bg-purple-100 text-purple-800"}
                              cursor-pointer hover:bg-purple-200`}
                              onClick={() => handleStatusClick(plant, "fanning")}
                            >
                              {getStatusIcon("fanning")} Fanning
                            </span>
                          )}
                          {/* Nếu có thêm trạng thái, tiếp tục thêm các div tương tự */}
                        </div>
                      </TableCell>
                      <TableCell>{plant.location || 'N/A'}</TableCell> 

                      <TableCell>
                        {renderDeviceBadges(plant)}
                      </TableCell>
                      <TableCell>{plant.updatedAt || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            disabled={loading}
                            onClick={() => {
                              setEditingPlant({...plant});
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-500"
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm deletion?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the plant "{plant.type}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeletePlant(plant.id)}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No plants found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredPlants.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevPage} 
                disabled={currentPage === 1 || loading}
              >
                Previous Page
              </Button>
              <span className="px-4 py-2 bg-gray-100 rounded-lg">
                Page {currentPage} / {totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages || totalPages === 0 || loading}
              >
                Next Page
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Plant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plant</DialogTitle>
          </DialogHeader>
          {editingPlant && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Plant Name</label>
                <Input 
                  className="col-span-3" 
                  value={editingPlant.type}
                  onChange={(e) => setEditingPlant({...editingPlant, type: e.target.value})}
                />
                <label className="text-right">Location</label>
                <Input 
                  className="col-span-3" 
                  value={editingPlant.location}
                  onChange={(e) => setEditingPlant({...editingPlant, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Status</label>
                <div className="col-span-3 flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="normal-status"
                      checked={editingPlant.status.includes("normal")}
                      onChange={(e) => {
                        let newStatus = [...editingPlant.status];
                        if (e.target.checked) {
                          // Add normal, ensure it's the only one if checked
                          newStatus = ["normal"];
                        } else {
                          // Remove normal, add "watering" if no status remains
                          newStatus = newStatus.filter(s => s !== "normal");
                          if (newStatus.length === 0) {
                            newStatus = ["watering"];
                          }
                        }
                        setEditingPlant({...editingPlant, status: newStatus});
                      }}
                    />
                    <label htmlFor="normal-status">Normal</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="watering-status"
                      checked={editingPlant.status.includes("watering")}
                      onChange={(e) => {
                        let newStatus = [...editingPlant.status];
                        if (e.target.checked) {
                          // Add watering, remove normal if present
                          if (!newStatus.includes("watering")) {
                            newStatus.push("watering");
                          }
                          newStatus = newStatus.filter(s => s !== "normal");
                        } else {
                          // Remove watering
                          newStatus = newStatus.filter(s => s !== "watering");
                          // If empty, set to normal
                          if (newStatus.length === 0) {
                            newStatus = ["normal"];
                          }
                        }
                        setEditingPlant({...editingPlant, status: newStatus});
                      }}
                    />
                    <label htmlFor="watering-status">Watering</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="fanning-status"
                      checked={editingPlant.status.includes("fanning")}
                      onChange={(e) => {
                        let newStatus = [...editingPlant.status];
                        if (e.target.checked) {
                          // Add fanning, remove normal if present
                          if (!newStatus.includes("fanning")) {
                            newStatus.push("fanning");
                          }
                          newStatus = newStatus.filter(s => s !== "normal");
                        } else {
                          // Remove fanning
                          newStatus = newStatus.filter(s => s !== "fanning");
                          // If empty, set to normal
                          if (newStatus.length === 0) {
                            newStatus = ["normal"];
                          }
                        }
                        setEditingPlant({...editingPlant, status: newStatus});
                      }}
                    />
                    <label htmlFor="fanning-status">Fanning</label>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <label className="font-medium mb-2 block">Assign Devices</label>
                <div className="grid grid-cols-1 gap-y-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm w-16">Soil:</label>
                    <Select
                      value={editingPlant.soilDeviceId === 0 ? "none" : String(editingPlant.soilDeviceId) || "none"}
                      onValueChange={(value) => {
                        setEditingPlant({
                          ...editingPlant,
                          soilDeviceId: value === "none" ? 0 : Number(value),
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Soil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availableSoilDevices.map((device) => (
                          <SelectItem key={device._id} value={String(device._id)}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm w-16">Pump:</label>
                    <Select
                      value={editingPlant.pumpDeviceId === 0 ? "none" : String(editingPlant.pumpDeviceId) || "none"}
                      onValueChange={(value) => {
                        setEditingPlant({
                          ...editingPlant,
                          pumpDeviceId: value === "none" ? 0 : Number(value),
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Pump" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availablePumpDevices.map((device) => (
                          <SelectItem key={device._id} value={String(device._id)}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePlant} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Water Action Dialog */}
      <Dialog open={isWaterActionOpen} onOpenChange={setIsWaterActionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Water Plant
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {waterActionPlant && (
              <div className="text-center space-y-4">
                <p>
                  Do you want to {waterActionPlant?.status.includes("watering") ? "stop watering" : "water"} <span className="font-semibold">{waterActionPlant?.type}</span>?
                </p>
                <p className="text-sm text-gray-500">
                  Using pump device: {waterActionPlant.pumpDeviceId ? (typeof waterActionPlant.pumpDeviceId === "object" ? waterActionPlant.pumpDeviceId.name || "Unknown" : waterActionPlant.pumpDeviceId) : "Unknown"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                if (waterActionPlant) {
                  toggleWatering(waterActionPlant);
                }
                setIsWaterActionOpen(false);
              }}
              className={waterActionPlant?.status.includes("watering") ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
              disabled={loading}
            >
              {loading ? "Processing..." : (isPlantWatering(waterActionPlant!) ? "Stop Watering" : "Start Watering")}
            </Button>
            <Button variant="outline" onClick={() => setIsWaterActionOpen(false)} disabled={loading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No Pump Error Dialog */}
      <AlertDialog open={showNoPumpError} onOpenChange={setShowNoPumpError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Thiếu thiết bị bơm
            </AlertDialogTitle>
            <AlertDialogDescription>
              {noPumpErrorPlant && (
                <div className="text-center py-4">
                  <p>
                    Cây <span className="font-semibold">{noPumpErrorPlant.type}</span> không thể tưới nước vì không có thiết bị bơm.
                  </p>
                  <p className="mt-2">
                    Vui lòng gán một thiết bị bơm cho cây này trước khi thực hiện tưới nước.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowNoPumpError(false);
              setNoPumpErrorPlant(null);
            }
            }>
              Đóng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ManagePlant;