import axios from "axios";
import { useQuery } from "react-query";

import { IPartMoldDTO } from "../../../interfaces/general";

import PartMoldDetails from "../../../components/Approval Componenents/PartMoldDetails";
import { Link } from "react-router-dom";

export default function ApprovePartMoldView() {
  const {
    data: moldData,
    isFetched,
    refetch,
  } = useQuery("notApprovedMolds", () =>
    axios.get<IPartMoldDTO[]>("http://localhost:3000/partMold/notApproved")
  );

  if (isFetched && moldData) {
    const molds = moldData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve molds</h1>
          <Link  className="link" to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform">
            {molds.length > 0 ? (
              molds.map((mold) => {
                return (
                  <PartMoldDetails
                    key={mold.id}
                    mold={mold}
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
