import { Link } from "react-router-dom";

interface iProps {
  link: string;
  content: string;
  imgPath: string;
}
export default function ProfileButton({ link, content, imgPath }: iProps) {
  return (
    <Link to={link} className="profile-button clickable">
      <div className="profile-btn-img-container">
        <img src={imgPath}></img>
      </div>
      <div className="fake-hr-80 "></div>
      <div>{content}</div>
    </Link>
  );
}
