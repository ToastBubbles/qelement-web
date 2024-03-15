import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { AppContext } from "../context/context";
import showToast, { Mode, getProfilePicture } from "../utils/utils";
import LoginBtn from "./LoginBtn";
import NavbarPopdown from "./NavbarPopdown";
import SearchBarMain from "./SearchBarMain";
import ColorWheelButton from "./ColorWheelButton";
import { INotification, IUserDTO } from "../interfaces/general";
import NotificationPopdown from "./NotificationPopdown";

function Navbar() {
  // const { dropdownRef, isComponentVisible } = useComponentVisible(true);
  const [toggleMainDropdown, setToggleMainDropdown] = useState<boolean>(false);
  const [toggleNotificationDropdown, setToggleNotificationDropdown] =
    useState<boolean>(false);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  // const [messageCount, setMessageCount] = useState<number>(0);
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);

  const { data: msgData } = useQuery({
    queryKey: `msgCount${payload.id}`,
    queryFn: () =>
      axios.get<number>(
        `http://localhost:3000/message/getUnreadCountById/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    retry: false,
    refetchInterval: 300000,
    enabled: !!payload.id,
  });

  const { data: notifData, refetch: notifRefetch } = useQuery({
    queryKey: `notifs${payload.id}`,
    queryFn: () =>
      axios.get<INotification[]>(
        `http://localhost:3000/notification/myNotifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    retry: false,
    refetchInterval: 300000,
    enabled: !!payload.id,
  });

  const { data } = useQuery({
    queryKey: `user${payload.id}`,
    queryFn: () =>
      axios.get<IUserDTO>(`http://localhost:3000/user/id/${payload.id}`),
    // onSuccess(res) {

    // },
    enabled: !!payload.id,
  });

  useEffect(() => {
    if (msgData?.data != undefined && msgData.data > 0) {
      let message = "new message";
      msgData.data > 1 && (message += "s");
      showToast(`${msgData.data} ${message}`, Mode.Success);
    }
  }, [msgData?.data]);

  useEffect(() => {
    if (notifData?.data) {
      let notifications = notifData.data;
      const unreadCount = notifications.reduce((count, notification) => {
        // Check if the notification has read: false
        if (!notification.read) {
          return count + 1; // Increment count if read is false
        } else {
          return count; // Otherwise, return the current count
        }
      }, 0); // Start with an initial count of 0
      setNotificationCount(unreadCount);
    } else setNotificationCount(0);
  }, [notifData]);

  useEffect(() => {
    return () => {
      // Clean up the timer when the component unmounts
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);
  // console.log(token);

  return (
    <nav className="navbar">
      <div className="text-logo w-33">
        <Link to={"/"}>
          <span className="lt-red">q</span>
          <span>element</span>
        </Link>
      </div>
      <div className="d-flex jc-center w-33">
        <SearchBarMain />
      </div>
      <div className="w-33 nav-end">
        <div className="fg-1"></div>
        <ColorWheelButton link="/sculpture/all" content="sculptures" />
        <ColorWheelButton link="/part-categories" content="parts" />
        <ColorWheelButton link="/colors" content="colors" />

        {token === "" ? (
          <LoginBtn />
        ) : (
          <>
            {!toggleMainDropdown && toggleNotificationDropdown && (
              <NotificationPopdown
                notifications={notifData?.data}
                refetchFn={notifRefetch}
                closePopdown={closeNotifPopdown}
              />
            )}
            <Link
              className="mail-svg"
              to={"/profile/messages"}
              style={{ paddingLeft: "0.5em" }}
            >
              <div>
                {msgData && msgData.data > 0 && (
                  <div className="mail-badge">{msgData.data}</div>
                )}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="#eee"
                  className="bi-envelope-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                </svg>
              </div>
            </Link>

            <div
              style={{
                marginLeft: "0.75em",
                marginRight: "0.25em",
                position: "relative",
              }}
              className="clickable"
              onClick={() => {
                setToggleNotificationDropdown(!toggleNotificationDropdown);
                if (toggleMainDropdown) {
                  setToggleMainDropdown(false);
                }
              }}
            >
              {notificationCount > 0 && (
                <div className="notif-badge">{notificationCount}</div>
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill={notificationCount > 0 ? "var(--lt-red)" : "#eee"}
                className="bi-envelope-fill"
                viewBox="0 0 448 512"
              >
                <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
              </svg>
            </div>
            <div
              onMouseOver={() => {
                if (!toggleNotificationDropdown) {
                  setToggleMainDropdown(true);
                  if (timerId) {
                    clearTimeout(timerId);
                    setTimerId(null);
                  }
                }
              }}
              onMouseLeave={() => {
                if (!toggleNotificationDropdown && toggleMainDropdown) {
                  setTimerId(
                    setTimeout(() => {
                      setToggleMainDropdown(false);
                      setTimerId(null);
                    }, 500)
                  );
                }
              }}
              onClick={() => {
                if (toggleNotificationDropdown) {
                  setToggleNotificationDropdown(false);
                  setToggleMainDropdown(true);
                }
              }}
            >
              <button className="navbarProfileImg">
                <img
                  className="profile-img clickable"
                  src={getProfilePicture(data?.data.profilePicture, true)}
                />
              </button>
              <div
                onClick={() => {
                  setToggleMainDropdown(false);
                }}
              >
                {toggleMainDropdown && !toggleNotificationDropdown && (
                  <NavbarPopdown />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
  function closeNotifPopdown() {
    setToggleNotificationDropdown(false);
  }
}

export default Navbar;
