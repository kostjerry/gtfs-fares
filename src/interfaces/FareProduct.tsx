export default interface FareProduct {
  fare_product_id: string;
  fare_product_name?: string;
  rider_category_id?: string;
  fare_medium_id?: string;
  fare_medium_group_id?: string;
  bundle_amount?: number;
  duration_start?: number;
  duration_amount?: number;
  duration_unit?: number;
  duration_type?: number;
  offset_amount?: number;
  offset_unit?: number;
  service_id?: string;
  cap_required?: number;
  eligible_cap_id?: string;
  amount?: number;
  min_amount?: number;
  max_amount?: number;
  currency?: string;
}
