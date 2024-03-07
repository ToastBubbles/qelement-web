import axios from "axios";
import { useQuery } from "react-query";

import { IQPartDTOInclude, ISculptureDTO } from "../../../interfaces/general";

import QPartDetails from "../../../components/Approval Componenents/QPartDetails";
import { Link } from "react-router-dom";
import SculptureDetails from "../../../components/Approval Componenents/SculptureDetails";

export default function ApproveSculptureView() {
  const {
    data: sculpData,
    isFetched,
    refetch,
  } = useQuery("notApprovedSculps", () =>
    axios.get<ISculptureDTO[]>("http://localhost:3000/sculpture/notApproved")
  );

  if (isFetched && sculpData) {
    const sculptures = sculpData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve qelements</h1>
          <Link className="link"  to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform">
            {sculptures.length > 0 ? (
              sculptures.map((sculpture) => {
                return (
                  <SculptureDetails
                    key={sculpture.id}
                    sculpture={sculpture}
                    refetchFn={refetch}
                  />
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
