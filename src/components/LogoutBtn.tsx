import { Link } from "react-router-dom";
import { logout } from "../auth/auth";


function LogoutBtn() {
  return (
    <>
      <Link to="/colors">
        <button
          onClick={() => {
            logout();
            // redirect("/colors");
          }}
        >
          Logout
        </button>
      </Link>
    </>
  );
}

export default LogoutBtn;
