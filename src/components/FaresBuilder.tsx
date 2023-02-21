import Packet from "../interfaces/Packet";
import "./FaresBuilder.scss";

function FaresBuilder(props: any) {
  const packet = props.packet as Packet;
  console.log(packet);

  return <div className="fares-builder">Fares Builder</div>;
}

export default FaresBuilder;
