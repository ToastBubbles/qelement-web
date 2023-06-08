import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function ColorWheel() {
  return (
    <Link to="/colors" className="color-wheel clickable">
      <div>colors</div>
    </Link>
  );
}

export default ColorWheel;
