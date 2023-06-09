import axios from "axios";
import { useQuery } from "react-query";

import { IPartMoldDTO } from "../../../interfaces/general";

import PartMoldDetails from "../../../components/PartMoldDetails";

export default function ApprovePartMoldView() {
  const {
    data: moldData,
    isFetched,
    refetch,
  } = useQuery("notApprovedMolds", () =>
    axios.get<IPartMoldDTO[]>("http://localhost:3000/partMold/notApproved")
  );

  if (isFetched && moldData) {
    let molds = moldData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve molds</h1>
          <div className="mainform">
            {molds.length > 0 ? (
              molds.map((mold) => {
                return (

                    <PartMoldDetails key={mold.id} mold={mold} refetchFn={refetch} />
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
