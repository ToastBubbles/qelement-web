import axios from "axios";
import { useState, useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { logout } from "../auth/auth";
import { AppContext } from "../context/context";
import LoginBtn from "./LoginBtn";

function Navbar() {
  // let toggleDropdown = false;
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [messageCount, setMessageCount] = useState<number>(0);
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);

  const {
    data: msgData,
    isLoading: msgIsLoading,
    error: msgError,
    isFetched,
  } = useQuery({
    queryKey: "individualMessage",
    queryFn: () =>
      axios.get<number>(
        `http://localhost:3000/message/getUnreadCountById/${payload.id}`
      ),
    retry: false,
    enabled: !!payload.id,
  });

  return (
    <nav className="navbar">
      <>
        <div className="text-logo fg-1">
          <Link to={"/colors"}>
            <span className="lt-red">q</span>
            <span>element</span>
          </Link>
        </div>

        {/* {payload.username && <p>Hello, {payload.username}</p>} */}
        {token === "" ? (
          <LoginBtn />
        ) : (
          <>
            <Link className="mail-svg" to={"/profile/messages"}>
              <div>
                {msgData && msgData.data > 0 && (
                  <div className="mail-badge">{msgData.data}</div>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#eee"
                  className="bi-envelope-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                </svg>
              </div>
            </Link>
            <button
              className="navbarProfileImg"
              onClick={(e) => {
                setToggleDropdown(!toggleDropdown);
                console.log("clicked");
              }}
            >
              <img
                className="profile-img clickable"
                src="/img/blank_profile.webp"
              />
            </button>
            {/* <LogoutBtn /> */}
            <div
              className={
                "nav-pop-down clickable" + (toggleDropdown ? "" : " hidden")
              }
            >
              <Link to={"/profile"}>My Profile</Link>
              <Link to={"/profile"}>My Wanted List</Link>
              <Link to={"/profile"}>My Inventory</Link>
              <Link to={"/profile"}>Settings</Link>
              <div
                onClick={(e) => {
                  logout();
                  // redirect("/colors");
                }}
              >
                Logout
              </div>
            </div>
          </>
        )}
      </>
    </nav>
  );
}

// function doStuff() {
//   setUserId(payload?.id as number);
//   msgData && setMessageCount(msgData.data);
// }

export default Navbar;
