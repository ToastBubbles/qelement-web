import { useContext, useState } from "react";
import { IAPIResponse, INotification } from "../interfaces/general";
import showToast, { Mode, paginate, sortByCreatedAt } from "../utils/utils";
import Notification from "./Notification";
import PaginationControl from "./PaginationControl";
import { Link } from "react-router-dom";
import ConfirmPopup from "./ConfirmPopup";
import axios from "axios";
import { useMutation } from "react-query";
import { AppContext } from "../context/context";

interface iProps {
  notifications: INotification[] | undefined;
  refetchFn: () => void;
  closePopdown: () => void;
}

export default function NotificationPopdown({
  notifications,
  refetchFn,
  closePopdown,
}: iProps) {
  const {
    state: {
      jwt: { token },
    },
  } = useContext(AppContext);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isHovered, setHovered] = useState(false);
  const [showEllipsisContent, setShowEllipsisContent] =
    useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  if (notifications) {
    notifications = sortByCreatedAt(notifications, false);
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    const paginatedItems =
      notifications.length > itemsPerPage
        ? paginate(notifications, currentPage, itemsPerPage)
        : notifications;

    const notifDeleteAllMutation = useMutation({
      mutationFn: () =>
        axios.post<IAPIResponse>(
          `http://localhost:3000/notification/deleteAll`,
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
          showToast("Notifications Cleared", Mode.Info);
          refetchFn();
          closePopup();
        } else {
          showToast("Error deleting notification", Mode.Error);
        }
      },
    });

    const notifReadAllMutation = useMutation({
      mutationFn: () =>
        axios.post<IAPIResponse>(
          `http://localhost:3000/notification/readAll`,
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
          showToast("Error making changes!", Mode.Error);
        }
      },
    });
    return (
      <div className={"notif-pop-down"}>
        {showPopup && (
          <ConfirmPopup
            fn={deleteAllNotifications}
            content="Are you sure you want to delete all notifications?"
            closePopup={closePopup}
          />
        )}
        {showEllipsisContent && (
          <div
            className="ellipsis-dropdown"
            style={{ right: "1.15em", top: "2.25em" }}
          >
            <Link to={"/"} className="link">
              Manage Notifications
            </Link>

            {hasUnreadNotifications() && (
              <>
                {" "}
                <div className="fake-hr" style={{ margin: "0.5em 0" }}></div>
                <div
                  className="clickable"
                  onClick={() => readAllNotifications()}
                >
                  Mark all as Read
                </div>
              </>
            )}
            {notifications.length > 0 && (
              <>
                <div className="fake-hr" style={{ margin: "0.5em 0" }}></div>
                <div className="clickable" onClick={() => setShowPopup(true)}>
                  Clear all notifications
                </div>
              </>
            )}
          </div>
        )}
        <div className="d-flex jc-space-b ai-center">
          <div className="notif-header">Notifications</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            className="clickable color-fade"
            onClick={() => {
              setShowEllipsisContent(!showEllipsisContent);
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            fill={isHovered || showEllipsisContent ? "#555" : "#bbb"}
            style={{ marginRight: "1em" }}
            viewBox="0 0 16 16"
          >
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
          </svg>
        </div>
        {paginatedItems.length > 0 ? (
          <>
            {paginatedItems.map((notif) => (
              <Notification
                key={notif.id}
                notification={notif}
                refetchFn={refetchFn}
                closePopdown={closePopdown}
              />
            ))}
            {notifications.length > itemsPerPage && (
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <>
            <div className="fake-hr" style={{ margin: "1em 0 0 0" }}></div>
            <div className="grey-txt" style={{ margin: "1em" }}>
              No Notifications
            </div>
          </>
        )}
      </div>
    );
    function closePopup() {
      setShowPopup(false);
    }
    function hasUnreadNotifications(): boolean {
      let hasUnread = false;
      if (notifications && notifications.length > 0) {
        notifications.forEach((notif) => {
          if (!notif.read) hasUnread = true;
          return;
        });
      }
      return hasUnread;
    }
    function readAllNotifications() {
      if (notifications && notifications.length > 0) {
        if (hasUnreadNotifications()) notifReadAllMutation.mutate();
      }
    }

    function deleteAllNotifications() {
      if (notifications && notifications.length > 0) {
        notifDeleteAllMutation.mutate();
      }
    }
  }
  return (
    <div className={"notif-pop-down"}>
      {showEllipsisContent && (
        <div
          className="ellipsis-dropdown"
          style={{ right: "1.15em", top: "2.25em" }}
        >
          <Link to={"/"} className="link">
            Manage Notifications
          </Link>
        </div>
      )}
      <div className="d-flex jc-space-b ai-center">
        <div className="notif-header">Notifications</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          className="clickable color-fade"
          onClick={() => {
            setShowEllipsisContent(!showEllipsisContent);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          fill={isHovered || showEllipsisContent ? "#555" : "#bbb"}
          style={{ marginRight: "1em" }}
          viewBox="0 0 16 16"
        >
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
        </svg>
      </div>
      <div className="grey-txt" style={{ margin: "1em" }}>
        Could not load notifications!
      </div>
    </div>
  );
}
