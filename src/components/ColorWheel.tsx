import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function ColorWheel() {
  return (
    <Link to="/colors" className="color-wheel clickable">
      <div>colors</div>
    </Link>
  );
}
