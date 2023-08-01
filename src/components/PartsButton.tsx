import { Link } from "react-router-dom";

export default function PartsButton() {
  return (
    <Link to="/part-categories" className="color-wheel clickable">
      <div>parts</div>
    </Link>
  );
}
