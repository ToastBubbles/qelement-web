import { Link } from "react-router-dom";

export default function ApproveView() {
  return (
    <>
      <div className="formcontainer">
        <h1>approve</h1>
        <div className="mainform">
          <div className="d-flex jc-center flex-col">
            <Link to={"/approve/colors"}>Colors</Link>
            <Link to={"/approve/categories"}>Categories</Link>
            <Link to={"/approve/parts"}>Parts</Link>
            <Link to={"/approve/qparts"}>QElements</Link>
            <Link to={"/approve/partStatus"}>Part Status</Link>
            <Link to={"/approve/similarColors"}>Similar Colors</Link>
            <Link to={"/approve/images"}>Images</Link>
          </div>
        </div>
      </div>
    </>
  );
}
