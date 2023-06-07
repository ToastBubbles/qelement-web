import { Link } from "react-router-dom";


function LoginBtn() {
  return (
    <>
      <Link to="/login">
        <button className="login-btn clickable">Login</button>
      </Link>
    </>
  );
}

export default LoginBtn;
