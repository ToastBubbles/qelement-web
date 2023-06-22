import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { INotApporvedCounts } from "../../../interfaces/general";

export default function ApproveView() {
  const { data } = useQuery("notApprovedCounts", () =>
    axios.get<INotApporvedCounts>(
      "http://localhost:3000/extra/getNotApprovedCounts"
    )
  );
  if (data) {
    let counts = data.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve</h1>
          <div className="mainform">
            <div className="d-flex jc-center flex-col">
              <Link to={"/approve/colors"}>
                Colors {counts.colors > 0 && `(${counts.colors})`}
              </Link>
              <Link to={"/approve/categories"}>
                Categories {counts.colors > 0 && `(${counts.colors})`}
              </Link>
              <Link to={"/approve/parts"}>
                Parts {counts.parts > 0 && `(${counts.parts})`}
              </Link>
              <Link to={"/approve/molds"}>
                Part Molds {counts.partMolds > 0 && `(${counts.partMolds})`}
              </Link>
              <Link to={"/approve/qparts"}>
                QElements {counts.qelements > 0 && `(${counts.qelements})`}
              </Link>
              <Link to={"/approve/partStatus"}>
                Part Status{" "}
                {counts.partStatuses > 0 && `(${counts.partStatuses})`}
              </Link>
              <Link to={"/approve/similarColors"}>
                Similar Colors{" "}
                {counts.similarColors > 0 && `(${counts.similarColors})`}
              </Link>
              <Link to={"/approve/images"}>
                Images {counts.images > 0 && `(${counts.images})`}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else return <p>Loading...</p>;
}
