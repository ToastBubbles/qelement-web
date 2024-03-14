import { INotification } from "../interfaces/general";
import Notification from "./Notification";

interface iProps {
  notifications: INotification[] | undefined;
}

export default function NotificationPopdown({ notifications }: iProps) {
  return (
    <div className={"notif-pop-down"}>
      <div>Clear Notifications</div>
      <div className="fake-hr"></div>
      {notifications && notifications.length > 0 ? notifications.map(notif =><Notification key={notif.id} notification={notif}/>) : <div className="grey-txt">No Notifications</div>}
    </div>
  );
}
