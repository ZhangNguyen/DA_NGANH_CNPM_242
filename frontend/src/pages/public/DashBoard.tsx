import { DashboardCard, Weather } from "../../components";
import { DashboardIcons } from '../../lib/icons';
import { 
  apiGetSensorDataByMonth 
} from '@/apis/sensor';
import { useEffect, useState } from "react";

const DashBoard = () => {
  enum SensorType {
    Light = 'light',
    Temperature = 'temperature',
    Humidity = 'humidity',
    Soil = 'soil'
  }

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soil: 0,
    light: 0
  });

  const fetchSensorData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [tempResponse, humidityResponse, soilResponse, lightResponse] = await Promise.all([
        apiGetSensorDataByMonth(SensorType.Temperature),
        apiGetSensorDataByMonth(SensorType.Humidity),
        apiGetSensorDataByMonth(SensorType.Soil),
        apiGetSensorDataByMonth(SensorType.Light)
      ]);
      
      setSensorData({
        temperature: Math.round(tempResponse.data.average * 100) / 100,
        humidity: Math.round(humidityResponse.data.average * 100) / 100,
        soil: Math.round(soilResponse.data.average * 100) / 100,
        light: Math.round(lightResponse.data.average * 100) / 100
      });
    } catch (err) {
      setError("Failed to fetch sensor data. Please try again later.");
      console.error("Sensor data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    
    // Optional: Set up periodic refresh every 5 minutes
    const refreshInterval = setInterval(fetchSensorData, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const getSensorCardColor = (type: SensorType) => {
    switch(type) {
      case SensorType.Temperature: return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200";
      case SensorType.Humidity: return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200";
      case SensorType.Soil: return "bg-gradient-to-br from-green-50 to-green-100 border-green-200";
      case SensorType.Light: return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
          <button 
            onClick={fetchSensorData} 
            className="ml-4 px-2 py-1 bg-red-200 rounded hover:bg-red-300"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Weather />
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard 
            title="Temperature" 
            data={sensorData.temperature}
            icon={<DashboardIcons.Thermometer size={40} className="text-orange-500" />}
            className={`p-5 rounded-xl shadow-sm border ${getSensorCardColor(SensorType.Temperature)} ${isLoading ? "animate-pulse" : ""}`}
          />
          
          <DashboardCard 
            title="Humidity" 
            data={sensorData.humidity}
            icon={<DashboardIcons.Droplet size={40} className="text-blue-500" />}
            className={`p-5 rounded-xl shadow-sm border ${getSensorCardColor(SensorType.Humidity)} ${isLoading ? "animate-pulse" : ""}`}
          />
          
          <DashboardCard 
            title="Soil Moisture" 
            data={sensorData.soil}
            icon={<DashboardIcons.Sprout size={40} className="text-green-500" />}
            className={`p-5 rounded-xl shadow-sm border ${getSensorCardColor(SensorType.Soil)} ${isLoading ? "animate-pulse" : ""}`}
          />
          
          <DashboardCard 
            title="Light Intensity" 
            data={sensorData.light}
            icon={<DashboardIcons.Sun size={40} className="text-yellow-500" />}
            className={`p-5 rounded-xl shadow-sm border ${getSensorCardColor(SensorType.Light)} ${isLoading ? "animate-pulse" : ""}`}
          />
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center mt-4">
          <span className="text-sm text-gray-500">Updating sensor data...</span>
        </div>
      )}
      
      <div className="mt-6 text-right">
        <button 
          onClick={fetchSensorData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
    </div>
  );
};

export default DashBoard;