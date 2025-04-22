import React, { useState, useEffect } from "react";
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

// Define types for Plant status
type PlantStatus = "normal" | "watering" | "fanning";

// Define Device interfaces
interface SoilDevice {
  id: string;
  name: string;
  assignedTo: number | null;
}

interface PumpDevice {
  id: string;
  name: string;
  assignedTo: number | null;
}

// Interface for Device assignment
interface DeviceAssignment {
  soil: string | null; // ID of the soil device
  pump: string | null; // ID of the pump device
}

// Define Plant interface
interface Plant {
  id: number;
  name: string;
  status: PlantStatus;
  devices: DeviceAssignment;
  isWatering: boolean;
  updatedAt: string;
}

const ManagePlant: React.FC = () => {
  // Initial devices data
  const [soilDevices, setSoilDevices] = useState<SoilDevice[]>([
    { id: "soil1", name: "Soil 1", assignedTo: null },
    { id: "soil2", name: "Soil 2", assignedTo: null },
    { id: "soil3", name: "Soil 3", assignedTo: null },
    { id: "soil4", name: "Soil 4", assignedTo: null },
  ]);

  const [pumpDevices, setPumpDevices] = useState<PumpDevice[]>([
    { id: "pump1", name: "Pump 1", assignedTo: null },
    { id: "pump2", name: "Pump 2", assignedTo: null },
    { id: "pump3", name: "Pump 3", assignedTo: null },
    { id: "pump4", name: "Pump 4", assignedTo: null },
  ]);

  // Initial plants data
  const [plants, setPlants] = useState<Plant[]>([
    { 
      id: 1, 
      name: "Green Plant", 
      status: "normal", 
      devices: { soil: null, pump: null },
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 2, 
      name: "Red Plant", 
      status: "watering", 
      devices: { soil: null, pump: null }, 
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 3, 
      name: "Cactus", 
      status: "normal", 
      devices: { soil: null, pump: null }, 
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 4, 
      name: "Needle Leaf Plant", 
      status: "normal", 
      devices: { soil: null, pump: null },
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 5, 
      name: "Rose", 
      status: "watering",
      devices: { soil: null, pump: null },
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 6, 
      name: "Succulent", 
      status: "normal", 
      devices: { soil: null, pump: null }, 
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 7, 
      name: "Rice Plant", 
      status: "watering", 
      devices: { soil: null, pump: null },
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 8, 
      name: "Sugarcane", 
      status: "fanning", 
      devices: { soil: null, pump: null },
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 9, 
      name: "Pine Tree", 
      status: "normal", 
      devices: { soil: null, pump: null }, 
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 10, 
      name: "Areca Palm", 
      status: "fanning", 
      devices: { soil: null, pump: null }, 
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
    { 
      id: 11, 
      name: "Bamboo", 
      status: "normal",
      devices: { soil: null, pump: null },
      isWatering: false,
      updatedAt: new Date().toLocaleString() 
    },
  ]);

  // Set up initial device assignments
  useEffect(() => {
    updateDeviceAssignments();
  }, []);

  // State for search, editing, and pagination
  const [search, setSearch] = useState("");
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [wateringDialogPlant, setWateringDialogPlant] = useState<Plant | null>(null);
  const [isWateringDialogOpen, setIsWateringDialogOpen] = useState(false);
  const [noPumpErrorPlant, setNoPumpErrorPlant] = useState<Plant | null>(null);
  const [showNoPumpError, setShowNoPumpError] = useState(false);
  const [newPlant, setNewPlant] = useState<{ 
    name: string; 
    status: PlantStatus;
    devices: DeviceAssignment;
  }>({ 
    name: "", 
    status: "normal",
    devices: { soil: null, pump: null },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 7;
  const [activeWateringPlant, setActiveWateringPlant] = useState<number | null>(null);
  const [waterActionPlant, setWaterActionPlant] = useState<Plant | null>(null);
  const [isWaterActionOpen, setIsWaterActionOpen] = useState(false);

  // Handle clicking on a status
  const handleStatusClick = (plant: Plant) => {
    if (plant.status === "watering") {
      // Check for pump device before allowing watering action
      if (!plant.devices.pump) {
        // Show error dialog for missing pump
        setNoPumpErrorPlant(plant);
        setShowNoPumpError(true);
      } else {
        setWaterActionPlant(plant);
        setIsWaterActionOpen(true);
      }
    }
  };

  // Update device assignments
  const updateDeviceAssignments = () => {
    // Reset all device assignments
    const updatedSoilDevices = soilDevices.map(device => ({ ...device, assignedTo: null as number | null }));
    const updatedPumpDevices = pumpDevices.map(device => ({ ...device, assignedTo: null as number | null }));
    
    // Update assignments based on current plants
    plants.forEach(plant => {
      if (plant.devices.soil) {
        const soilDevice = updatedSoilDevices.find(device => device.id === plant.devices.soil);
        if (soilDevice) {
          soilDevice.assignedTo = plant.id;
        }
      }
      
      if (plant.devices.pump) {
        const pumpDevice = updatedPumpDevices.find(device => device.id === plant.devices.pump);
        if (pumpDevice) {
          pumpDevice.assignedTo = plant.id;
        }
      }
    });
    
    setSoilDevices(updatedSoilDevices);
    setPumpDevices(updatedPumpDevices);
  };

  // Filter plants based on search and pagination
  const filteredPlants = plants.filter(plant => 
    plant.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  
  const currentPlants = filteredPlants.slice(
    (currentPage - 1) * plantsPerPage, 
    currentPage * plantsPerPage
  );

  // Get available devices (not assigned to any plant)
  const getAvailableSoilDevices = (currentPlantId?: number) => {
    return soilDevices.filter(device => 
      device.assignedTo === null || device.assignedTo === currentPlantId
    );
  };

  const getAvailablePumpDevices = (currentPlantId?: number) => {
    return pumpDevices.filter(device => 
      device.assignedTo === null || device.assignedTo === currentPlantId
    );
  };

  // Add a new plant
  const handleAddPlant = () => {
    if (!newPlant.name.trim()) return;
    
    const newId = plants.length > 0 
      ? Math.max(...plants.map(p => p.id)) + 1 
      : 1;
    
    const updatedPlants = [
      ...plants, 
      { 
        id: newId, 
        name: newPlant.name.trim(), 
        status: newPlant.status,
        devices: newPlant.devices,
        isWatering: false,
        updatedAt: new Date().toLocaleString() 
      }
    ];
    
    setPlants(updatedPlants);
    
    // Reset form
    setNewPlant({ 
      name: "", 
      status: "normal",
      devices: { soil: null, pump: null },
    });
    
    // Update device assignments
    setTimeout(() => updateDeviceAssignments(), 0);
  };

  // Remove a plant
  const handleDeletePlant = (id: number) => {
    setPlants(plants.filter(plant => plant.id !== id));
    
    // Adjust current page if necessary
    if (currentPlants.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    
    // Update device assignments
    setTimeout(() => updateDeviceAssignments(), 0);
  };

  // Update a plant
  const handleUpdatePlant = () => {
    if (!editingPlant) return;
    
    setPlants(plants.map(plant => 
      plant.id === editingPlant.id 
        ? { ...editingPlant, updatedAt: new Date().toLocaleString() } 
        : plant
    ));
    
    setIsEditDialogOpen(false);
    setEditingPlant(null);
    
    // Update device assignments
    setTimeout(() => updateDeviceAssignments(), 0);
  };

  // Toggle watering for a plant
  const toggleWatering = (plant: Plant) => {
    if (plant.status === "watering") {
      if (!plant.devices.pump) {
        // Show error dialog for missing pump
        setNoPumpErrorPlant(plant);
        setShowNoPumpError(true);
        return;
      }

      setPlants(plants.map(p => 
        p.id === plant.id 
          ? { ...p, isWatering: !p.isWatering, updatedAt: new Date().toLocaleString() } 
          : p
      ));

      // If starting watering, set active watering plant
      if (!plant.isWatering) {
        setActiveWateringPlant(plant.id);
      } else {
        setActiveWateringPlant(null);
      }
    }
  };  

  // Handle pagination
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

  // Get status color
  const getStatusColor = (status: PlantStatus, isWatering: boolean) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "watering":
        return isWatering ? "bg-red-400 text-white" : "bg-blue-100 text-blue-800";
      case "fanning":
        return "bg-purple-100 text-purple-800";   
    }
  };

  // Get status icon
  const getStatusIcon = (status: PlantStatus) => {
    switch (status) {
      case "normal":
        return <Leaf className="h-4 w-4" />;
      case "watering":
        return <Droplet className="h-4 w-4" />;
      case "fanning":
        return <Fan className="h-4 w-4" />;   
    }
  };

  // Render device badges
  const renderDeviceBadges = (plant: Plant) => {
    return (
      <div className="flex flex-wrap gap-1">
        {plant.devices.soil && 
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
            {soilDevices.find(d => d.id === plant.devices.soil)?.name || "Soil"}
          </Badge>
        }
        {plant.devices.pump && 
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            {pumpDevices.find(d => d.id === plant.devices.pump)?.name || "Pump"}
          </Badge>
        }
      </div>
    );
  };

  // Get device name by ID
  const getDeviceName = (deviceType: "soil" | "pump", deviceId: string | null) => {
    if (!deviceId) return "";
    
    if (deviceType === "soil") {
      return soilDevices.find(d => d.id === deviceId)?.name || "";
    } else {
      return pumpDevices.find(d => d.id === deviceId)?.name || "";
    }
  };

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
            
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Enter new plant name..."
                value={newPlant.name}
                onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                className="flex-1"
              />
              <Select
                value={newPlant.status}
                onValueChange={(value: PlantStatus) => setNewPlant({ ...newPlant, status: value })}
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
              <Button onClick={handleAddPlant} className="bg-green-600 hover:bg-green-700">Add</Button>
            </div>

            {/* Device selection for new plant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium">Soil:</label>
                <Select
                  value={newPlant.devices.soil || "none"}
                  onValueChange={(value) => {
                    setNewPlant({
                      ...newPlant,
                      devices: { ...newPlant.devices, soil: value === "none" ? null : value },
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Soil Device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {getAvailableSoilDevices().map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-16 font-medium">Pump:</label>
                <Select
                  value={newPlant.devices.pump || "none"}
                  onValueChange={(value) => {
                    setNewPlant({
                      ...newPlant,
                      devices: { ...newPlant.devices, pump: value === "none" ? null : value },
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Pump Device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {getAvailablePumpDevices().map((device) => (
                      <SelectItem key={device.id} value={device.id}>
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
                  <TableHead>Devices</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-32 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPlants.length > 0 ? (
                  currentPlants.map((plant, index) => (
                    <TableRow key={plant.id}>
                      <TableCell className="text-center font-medium">
                        {(currentPage - 1) * plantsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        {plant.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs flex items-center justify-center gap-1 ${getStatusColor(plant.status, plant.isWatering)} ${plant.status === "watering" ? "cursor-pointer hover:bg-blue-200" : ""}`}
                          onClick={() => handleStatusClick(plant)}
                        >
                          {getStatusIcon(plant.status)}
                          {plant.status}
                          {plant.isWatering && <span className="animate-pulse">•</span>}
                        </span>
                      </TableCell>
                      <TableCell>
                        {renderDeviceBadges(plant)}
                      </TableCell>
                      <TableCell>{plant.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setEditingPlant({...plant});
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
                                <AlertDialogTitle>Confirm deletion?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the plant "{plant.name}"? This action cannot be undone.
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
                disabled={currentPage === 1}
              >
                Previous Page
              </Button>
              <span className="px-4 py-2 bg-gray-100 rounded-lg">
                Page {currentPage} / {totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages || totalPages === 0}
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
                  value={editingPlant.name}
                  onChange={(e) => setEditingPlant({...editingPlant, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Status</label>
                <Select 
                  value={editingPlant.status} 
                  onValueChange={(value: PlantStatus) => 
                    setEditingPlant({...editingPlant, status: value})
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="watering">Watering</SelectItem>
                    <SelectItem value="fanning">Fanning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <label className="font-medium mb-2 block">Assign Devices</label>
                <div className="grid grid-cols-1 gap-y-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm w-16">Soil:</label>
                    <Select
                      value={editingPlant.devices.soil || "none"}
                      onValueChange={(value) => {
                        setEditingPlant({
                          ...editingPlant,
                          devices: { ...editingPlant.devices, soil: value === "none" ? null : value },
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Soil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {getAvailableSoilDevices(editingPlant.id).map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm w-16">Pump:</label>
                    <Select
                      value={editingPlant.devices.pump || "none"}
                      onValueChange={(value) => {
                        setEditingPlant({
                          ...editingPlant,
                          devices: { ...editingPlant.devices, pump: value === "none" ? null : value },
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Pump" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {getAvailablePumpDevices(editingPlant.id).map((device) => (
                          <SelectItem key={device.id} value={device.id}>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePlant}>Save Changes</Button>
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
                  Do you want to {waterActionPlant.isWatering ? "stop watering" : "water"} <span className="font-semibold">{waterActionPlant.name}</span>?
                </p>
                <p className="text-sm text-gray-500">
                  Using pump device: {getDeviceName("pump", waterActionPlant.devices.pump)}
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
              className={waterActionPlant?.isWatering ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
            >
              {waterActionPlant?.isWatering ? "Stop Watering" : "Start Watering"}
            </Button>
            <Button variant="outline" onClick={() => setIsWaterActionOpen(false)}>
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
                    Cây <span className="font-semibold">{noPumpErrorPlant.name}</span> Cannot water plant because it doesn't have a pump.
                  </p>
                  <p className="mt-2">
                  Please assign a pump to this plant before performing the watering action.
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