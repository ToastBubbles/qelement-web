import { Link } from "react-router-dom";

export default function UpdateView() {
  return (
    <>
      <div className="page-content-wrapper">
        <div className="page-content">
          <h1>Website Updates</h1>
          <div>
            <ol id="terms">
              <li>Known Bugs:</li>
              <div></div>
              <li>Coming Soon:</li>
              <div>Changes section on homepage</div>
              <div>Site Stats on homepage</div>
              <div>Add a forum</div>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
