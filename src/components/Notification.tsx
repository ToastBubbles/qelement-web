import { Link } from "react-router-dom";
import { IAPIResponse, INotification } from "../interfaces/general";
import showToast, { Mode, formatDate } from "../utils/utils";
import { useMutation } from "react-query";
import axios from "axios";
import { useContext, useState } from "react";
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

  const [isHovered, setHovered] = useState(false);
  const [showEllipsisContent, setShowEllipsisContent] =
    useState<boolean>(false);

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

  const notifDeleteMutation = useMutation({
    mutationFn: () =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/notification/delete/${notification.id}`,
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
      } else {
        showToast("Error deleting notification", Mode.Error);
      }
    },
  });
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  return (
    <div className="notification" style={{ position: "relative" }}>
      {showEllipsisContent && (
        <div className="ellipsis-dropdown">
          {!notification.read && (
            <>
              <div
                className="clickable w-100"
                onClick={() => {
                  if (!notification.read) {
                    notifReadMutation.mutate();
                    setShowEllipsisContent(false);
                  }
                }}
              >
                Mark as Read
              </div>
              <div className="fake-hr" style={{ margin: "0.5em 0" }}></div>
            </>
          )}
          <div
            className="clickable w-100"
            onClick={() => {
              notifDeleteMutation.mutate();
              setShowEllipsisContent(false);
            }}
          >
            Remove Notification
          </div>
        </div>
      )}
      <div className={`listing new-listing`}>
        <Link
          className="link fg-1"
          to={notification.link == null ? "/" : notification.link}
          style={
            notification.link == null ? { pointerEvents: "none" } : undefined
          }
          onClick={() => {
            if (!notification.read) notifReadMutation.mutate();
            closePopdown();
          }}
        >
          <div className="w-100">
            <div className="d-flex jc-space-b">
              <div className={notification.read ? "" : "bold-notif"}>
                {notification.name}
              </div>
              <div className="grey-txt">
                {formatDate(notification.createdAt, "short", true)}
              </div>
            </div>
            <div className="grey-txt" style={{fontSize: '0.75em'}}>{notification.content}</div>
          </div>
        </Link>

        <div
          className="ellipsis-icon-notif"
          style={{ marginLeft: "1em" }}
          onClick={() => {
            setShowEllipsisContent(!showEllipsisContent);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className="clickable color-fade"
            name="ellipsis-icon"
            fill={isHovered || showEllipsisContent ? "#555" : "#bbb"}
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          </svg>
        </div>
      </div>
    </div>
  );
}
