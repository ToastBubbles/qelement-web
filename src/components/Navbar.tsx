import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { logout } from "../auth/auth";
import { AppContext } from "../context/context";
import LoginBtn from "./LoginBtn";
import ColorWheel from "./ColorWheel";
import PartsButton from "./PartsButton";
import showToast, { Mode } from "../utils/utils";
import { IAPIResponse } from "../interfaces/general";
import NavbarPopdown from "./NavbarPopdown";
import useComponentVisible from "../utils/hooks";

function Navbar() {
  const { dropdownRef, isComponentVisible } = useComponentVisible(true);
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
    refetchInterval: 30000,
    enabled: !!payload.id,
  });

  useEffect(() => {
    if (msgData?.data != undefined && msgData.data > 0) {
      let message = "new message";
      msgData.data > 1 && (message += "s");
      showToast(`${msgData.data} ${message}`, Mode.Success);
    }
  }, [msgData?.data]);

  return (
    <nav className="navbar">
      <>
        <div className="text-logo fg-1">
          <Link to={"/"}>
            <span className="lt-red">q</span>
            <span>element</span>
          </Link>
        </div>
        <PartsButton />
        <ColorWheel />

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
            <div ref={dropdownRef}>{toggleDropdown && <NavbarPopdown />}</div>
          </>
        )}
      </>
    </nav>
  );
}

export default Navbar;
