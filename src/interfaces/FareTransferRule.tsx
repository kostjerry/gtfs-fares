export default interface FareTransferRule {
  fare_product_id?: string;
  filter_fare_product_id?: string;
  from_leg_group_id?: string;
  to_leg_group_id?: string;
  transfer_count?: number;
  transfer_id?: string;
  transfer_sequence?: number;
  duration_limit?: number;
  duration_limit_type?: number;
  fare_transfer_type: number;
  eligible_cap_id?: string;
}
