export default interface FareCapping {
  fare_product_id: string;
  eligible_cap_id?: string;
  fare_medium_id: string;
  duration_amount?: number;
  duration_unit?: number;
  duration_type?: number;
  offset_amount?: number;
  offset_unit?: number;
  service_id?: string;
  area_id?: string;
  network_id?: string;
  cap_amount?: number;
  currency?: string;
}
