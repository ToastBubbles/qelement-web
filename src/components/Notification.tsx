import { Link } from "react-router-dom";
import { IAPIResponse, INotification } from "../interfaces/general";
import { formatDate } from "../utils/utils";
import { useMutation } from "react-query";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/context";

interface IProps {
  notification: INotification;
  refetchFn: () => void;
  closePopdown: () => void;
}

export default function Notification({
  notification,
  refetchFn,
  closePopdown,
}: IProps) {
  const {
    state: {
      jwt: { token },
    },
  } = useContext(AppContext);

  const notifReadMutation = useMutation({
    mutationFn: () =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/notification/read/${notification.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (resp) => {
      console.log(resp.data);

      if (resp.data.code == 200) {
        refetchFn();
      }
    },
  });
  return (
    <div className="notification">
      <Link
        to={notification.link == null ? "/" : notification.link}
        style={
          notification.link == null ? { pointerEvents: "none" } : undefined
        }
        className={`listing link new-listing`}
        onClick={() => {
          notifReadMutation.mutate();
          closePopdown();
        }}
      >
        <div className="w-100">
          <div className="d-flex jc-space-b">
            <div className={notification.read ? "" : "bold-notif"}>
              {notification.name}
            </div>
            <div className="grey-txt">{formatDate(notification.createdAt)}</div>
          </div>
          <div className="grey-txt">{notification.content}</div>
        </div>
      </Link>
    </div>
  );
}
