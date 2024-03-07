import axios from "axios";
import { useQuery } from "react-query";

import { IPartDTO } from "../../../interfaces/general";

import PartDetails from "../../../components/Approval Componenents/PartDetails";
import { Link } from "react-router-dom";

export default function ApprovePartView() {
  const {
    data: partData,
    isFetched,
    refetch,
  } = useQuery("notApprovedParts", () =>
    axios.get<IPartDTO[]>("http://localhost:3000/parts/notApproved")
  );

  if (partData) {
    const parts = partData.data;
    console.log(parts);

    return (
      <>
        <div className="formcontainer">
          <h1>approve parts</h1>
          <Link  className="link" to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform">
            {parts.length > 0 ? (
              parts.map((part) => {
                return (
                  <PartDetails key={part.id} part={part} refetchFn={refetch} />
                );
              })
            ) : (
              <div className="text-center my-1">
                nothing to approve right now!
              </div>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
