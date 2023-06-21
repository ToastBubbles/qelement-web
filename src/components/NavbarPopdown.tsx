import { Link } from "react-router-dom";
import { logout } from "../auth/auth";
import { useQuery } from "react-query";
import axios from "axios";
import { IAPIResponse } from "../interfaces/general";
import { useContext } from "react";
import { AppContext } from "../context/context";
import useComponentVisible from "../utils/hooks";

export default function NavbarPopdown() {
  const { ref, isComponentVisible } = useComponentVisible(true);
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);

  const {
    data: adminData,
    isLoading: adminIsLoading,
    error: adminError,
  } = useQuery({
    queryKey: "isAdmin",
    queryFn: () =>
      axios.get<IAPIResponse>(
        `http://localhost:3000/user/checkIfAdmin/${payload.id}`
      ),
    retry: false,
    // refetchInterval: 30000,
    enabled: !!payload.id,
  });
  return (
    <div className={"nav-pop-down"}>
      <div>
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
      <div>
        <div>
          Add:
          <ul className="nav-pop-down-ul">
            <li>
              <Link to={"/add/qpart"}>New QElement</Link>
            </li>
            <li>
              <Link to={"/add/part"}>New Part</Link>
            </li>
            <li>
              <Link to={"/add/color"}>New Color</Link>
            </li>
          </ul>
        </div>
        {adminData && adminData.data.code == 200 && (
          <Link to={"/approve"}>Approve Content</Link>
        )}
      </div>
    </div>
  );
}
