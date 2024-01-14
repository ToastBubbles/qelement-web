import axios from "axios";
import { useQuery } from "react-query";
import {
  ISculptureDTO,
  ISculptureInventory,
} from "../../../interfaces/general";
import { Link } from "react-router-dom";
import SculptureInventoryDetails from "../../../components/Approval Componenents/SculptureInventoryDetails";

export default function ApproveSculptureInventoryView() {
  const { data: sculpData, refetch } = useQuery("notApprovedSculpInv", () =>
    axios.get<ISculptureDTO[]>(
      "http://localhost:3000/sculpture/notApprovedInventory"
    )
  );

  if (sculpData) {
    const sculptures = sculpData.data;
    console.log(sculptures);

    return (
      <>
        <div className="formcontainer">
          <h1>approve sculpture inventory</h1>
          <Link to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform">
            {sculptures.length > 0 ? (
              sculptures.map((sculpture) => {
                return (
                  <SculptureInventoryDetails
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
