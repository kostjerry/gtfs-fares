import Area from "./Area";
import Calendar from "./Calendar";
import FareCapping from "./FareCapping";
import FareLegRule from "./FareLegRule";
import FareMedium from "./FareMedium";
import FareMediumGroup from "./FareMediumGroup";
import FareProduct from "./FareProduct";
import FareTransferRule from "./FareTransferRule";
import RiderCategory from "./RiderCategory";
import Route from "./Route";
import Stop from "./Stop";
import StopArea from "./StopArea";

export default interface Packet {
  fare_products?: FareProduct[];
  fare_leg_rules?: FareLegRule[];
  fare_transfer_rules?: FareTransferRule[];
  fare_media?: FareMedium[];
  fare_medium_groups?: FareMediumGroup[];
  rider_categories?: RiderCategory[];
  fare_capping?: FareCapping[];
  routes?: Route[];
  calendars?: Calendar[];
  stops?: Stop[];
  areas?: Area[];
  stop_areas?: StopArea[];
}

export const samplePacket: Packet = {
  fare_products: [],
  fare_leg_rules: [],
  fare_transfer_rules: [],
  fare_media: [],
  fare_medium_groups: [],
  rider_categories: [],
  fare_capping: [],
  routes: [],
  calendars: [],
  stops: [],
  areas: [],
  stop_areas: [],
};
