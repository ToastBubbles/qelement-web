import axios from "axios";
import { useQuery } from "react-query";

import {
  IPartStatusDTO,
  IPartStatusWQPart,
  IQPartDTOInclude,
} from "../../../interfaces/general";

import QPartDetails from "../../../components/QPartDetails";
import { Link } from "react-router-dom";
import PartStatusDetails from "../../../components/PartStatusDetail";

export default function ApproveStatusView() {
  const {
    data: statusData,
    isFetched,
    refetch,
  } = useQuery("notApprovedStatuses", () =>
    axios.get<IPartStatusWQPart[]>(
      "http://localhost:3000/partStatus/notApproved"
    )
  );

  if (isFetched && statusData) {
    const statuses = statusData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve qelements</h1>
          <Link to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform">
            {statuses.length > 0 ? (
              statuses.map((status) => {
                return (
                  <PartStatusDetails
                    key={status.id}
                    status={status}
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
