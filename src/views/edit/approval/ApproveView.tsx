import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { INotApporvedCounts } from "../../../interfaces/general";
import { AppContext } from "../../../context/context";
import { useContext } from "react";

export default function ApproveView() {
  const {
    state: {
      jwt: { token },
    },
  } = useContext(AppContext);
  const { data } = useQuery("notApprovedCounts", () =>
    axios.get<INotApporvedCounts>(
      "http://localhost:3000/extra/getNotApprovedCounts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
  if (data) {
    const counts = data.data;
    return (
      <>
        <div className="formcontainer">
          <h1>Approval Overview</h1>

          <div className="mainform">
            <div className="d-flex jc-center flex-col">
              <Link className="black-txt" to={"/approve/colors"}>
                Colors {counts.colors > 0 && `(${counts.colors})`}
              </Link>
              <Link className="black-txt" to={"/approve/categories"}>
                Categories {counts.categories > 0 && `(${counts.categories})`}
              </Link>
              <Link className="black-txt" to={"/approve/parts"}>
                Parts {counts.parts > 0 && `(${counts.parts})`}
              </Link>
              <Link className="black-txt" to={"/approve/molds"}>
                Part Molds {counts.partMolds > 0 && `(${counts.partMolds})`}
              </Link>
              <Link className="black-txt" to={"/approve/qparts"}>
                QElements {counts.qelements > 0 && `(${counts.qelements})`}
              </Link>
              <Link className="black-txt" to={"/approve/status"}>
                Part Statuses{" "}
                {counts.partStatuses > 0 && `(${counts.partStatuses})`}
              </Link>
              <Link className="black-txt" to={"/approve/elementIDs"}>
                Element IDs {counts.elementIDs > 0 && `(${counts.elementIDs})`}
              </Link>
              <Link className="black-txt" to={"/approve/sculptures"}>
                Sculptures {counts.sculptures > 0 && `(${counts.sculptures})`}
              </Link>
              <Link className="black-txt" to={"/approve/sculptureInventories"}>
                Sculpture Inventory{" "}
                {counts.sculptureInventories > 0 &&
                  `(${counts.sculptureInventories})`}
              </Link>
              <Link className="black-txt" to={"/approve/similarColors"}>
                Similar Colors{" "}
                {counts.similarColors > 0 &&
                  `(${Math.ceil(counts.similarColors / 2)})`}
              </Link>
              <Link className="black-txt" to={"/approve/images"}>
                Images {counts.images > 0 && `(${counts.images})`}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else return <p>Loading...</p>;
}
