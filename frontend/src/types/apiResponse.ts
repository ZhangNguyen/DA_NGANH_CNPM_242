interface WeatherApiResponse {
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    name: string;
    weather: {
      icon: string;
    }[];
  }