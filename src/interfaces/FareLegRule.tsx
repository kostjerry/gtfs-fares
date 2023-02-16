export default interface FareLegRule {
  fare_product_id: string;
  filter_fare_product_id?: string;
  leg_group_id?: string;
  fare_leg_name?: string;
  network_id?: string;
  from_area_id?: string;
  contains_area_set?: string;
  to_area_id?: string;
  min_distance?: number;
  max_distance?: number;
  distance_type?: number;
  service_id?: string;
  eligible_cap_id?: string;
}
