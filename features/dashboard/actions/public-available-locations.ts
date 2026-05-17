export interface PublicAvailableLocation {
  id: number;
  location_name: string;
  province_name: string;
  province_code?: string;
  regency_name?: string;
  progress_percent: number;
  position: {
    latitude: number;
    longitude: number;
  };
}
