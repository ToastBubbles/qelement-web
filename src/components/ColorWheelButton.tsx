import { Link } from "react-router-dom";

interface iProps {
  link: string;
  content: string;
}
export default function ColorWheelButton({ link, content }: iProps) {
  return (
    <Link to={link} className="color-wheel clickable">
      <div>{content}</div>
    </Link>
  );
}
