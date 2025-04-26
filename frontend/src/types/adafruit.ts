export interface AdafruitConfig {
    adafruit_username: string;
    adafruit_key: string;
}

export interface adafruitState {
    isConfigured: boolean;
    isLoading: boolean;
    error: string | null;
    success: string | null;
}