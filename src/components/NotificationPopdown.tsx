import { useState } from "react";
import { INotification } from "../interfaces/general";
import { paginate, sortByCreatedAt } from "../utils/utils";
import Notification from "./Notification";
import PaginationControl from "./PaginationControl";

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
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  if (notifications) {
    notifications = sortByCreatedAt(notifications, false);
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    const paginatedItems =
      notifications.length > itemsPerPage
        ? paginate(notifications, currentPage, itemsPerPage)
        : notifications;
    return (
      <div className={"notif-pop-down"}>
        <div>Clear Notifications</div>
        <div className="fake-hr"></div>
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
          <div className="grey-txt">No Notifications</div>
        )}
      </div>
    );
  }
  return <>No notifications</>;
}
