import axios from "axios";
import { useQuery } from "react-query";

import { IPartDTO } from "../../../interfaces/general";

import PartDetails from "../../../components/PartDetails";

export default function ApprovePartView() {
  const {
    data: partData,
    isFetched,
    refetch,
  } = useQuery("notApprovedParts", () =>
    axios.get<IPartDTO[]>("http://localhost:3000/parts/notApproved")
  );

  if (isFetched && partData) {
    let parts = partData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve parts</h1>
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
