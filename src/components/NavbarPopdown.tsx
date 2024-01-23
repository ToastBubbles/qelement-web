import axios from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { AppContext } from "../context/context";
import { Types } from "../context/jwt/reducer";
import { IAPIResponse } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";

export default function NavbarPopdown() {
  // const { ref, isComponentVisible } = useComponentVisible(true);
  const {
    state: {
      jwt: { payload },
    },
    dispatch,
  } = useContext(AppContext);

  const { data: adminData } = useQuery({
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
        <Link to={"/profile/wanted"}>My Wanted List</Link>
        <Link to={"/profile/collection"}>My Collection</Link>
        <Link to={"/profile/settings"}>Settings</Link>
        <div
          className="clickable"
          onClick={() => {
            dispatch({
              type: Types.ClearJWT,
            });
            Cookies.remove("userJWT");
            showToast("Successfully Logged Out.", Mode.Info);
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
            <li>
              <Link to={"/add/sculpture"}>New Sculpture</Link>
            </li>
            <li>
              <Link to={"/add/known"}>Known Elements</Link>
            </li>
          </ul>
        </div>
        {adminData && adminData.data.code == 200 && (
          <>
            <Link to={"/approve"}>Approve Content</Link>
            <Link to={"/delete"}>Delete Content</Link>
            <Link to={"/userManagement"}>User Management</Link>
          </>
        )}
      </div>
    </div>
  );
}
