import { Droplet, Sun, Sprout, Activity, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/useUserStore'


const featuresData = [
  {
    icon: <Sprout className="h-8 w-8 text-green-600" />,
    title: "Crop Monitoring",
    description: "Real-time monitoring of crop health and growth stages"
  },
  {
    icon: <Droplet className="h-8 w-8 text-blue-600" />,
    title: "Smart Irrigation",
    description: "Optimize water usage with intelligent scheduling"
  },
  {
    icon: <Sun className="h-8 w-8 text-yellow-500" />,
    title: "Weather Insights",
    description: "Local weather forecasts and climate analysis"
  },
  {
    icon: <Activity className="h-8 w-8 text-red-500" />,
    title: "Plant Action Recommendation",
    description: "The system help you to recommend when to water your plant"
  }
];

const HomePage = () => {
  const { isAuthenticating } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 pb-12 md:pt-16 md:pb-20 lg:pt-24 lg:pb-28 text-center lg:text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                  <span className="block">Smart Farming</span>
                  <span className="block text-green-600 mt-2">For a Better Tomorrow</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-500">
                  Optimize your farm's potential with our cutting-edge IoT sensors, and automated solutions.
                </p>
                {!isAuthenticating && (
                  <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                    <button 
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-md"
                    onClick={() =>  navigate('/login')}
                    >
                    Get Started by Sign Up
                    </button>
                  </div>
                )}
                
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-green-300 rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-blob"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-300 rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300 rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <img 
                      src="https://images.pexels.com/photos/221016/pexels-photo-221016.jpeg?cs=srgb&dl=pexels-blooddrainer-221016.jpg&fm=jpg" 
                      alt="Smart farming visualization" 
                      className="rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Smart Farming Features</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Modern solutions for modern agricultural challenges.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuresData.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center">{feature.title}</h3>
                <p className="mt-2 text-gray-500 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isAuthenticating && (
        <div className="bg-green-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">Ready to modernize your farm?</h2>
              <p className="mt-4 text-xl text-green-100">
                Join thousands of farmers who are already seeing the benefits.
              </p>
              <div className="mt-8">
                <button className="
                inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-green-50"
                onClick={() =>  navigate('/login')}
                >
                  Get Started Today
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default HomePage;