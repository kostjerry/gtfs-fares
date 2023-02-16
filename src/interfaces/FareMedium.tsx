export default interface FareMedium {
  fare_medium_id: string;
  fare_medium_name?: string;
  fare_medium_type: number;
  rider_category_id?: string;
  fare_medium_validation_method?: number;
  fare_medium_info_url?: string;
  fare_medium_url?: string;
  minimal_initial_amount?: number;
  fare_medium_price?: number;
  currency?: string;
}
