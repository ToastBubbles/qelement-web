
import { Link } from "react-router-dom";
import { INotification, } from "../interfaces/general";


interface IProps {
  notification: INotification;
}

export default function Notification({ notification }: IProps) {
  return (
    <div>
      <Link
        to={notification.link == null ? "/" : notification.link}
        style={
          notification.link == null ? { pointerEvents: "none" } : undefined
        }
        className={`listing link new-listing`}
      >
        <div>
          <div>{notification.name}</div>
          <div className="grey-txt">{notification.content}</div>
        </div>
      </Link>
    </div>
  );
}
