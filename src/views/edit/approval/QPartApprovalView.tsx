import axios from "axios";
import { useQuery } from "react-query";

import { IQPartDTO, IQPartDTOInclude } from "../../../interfaces/general";

import PartDetails from "../../../components/PartDetails";
import QPartDetails from "../../../components/QPartDetails";

export default function ApproveQPartView() {
  const {
    data: qpartData,
    isFetched,
    refetch,
  } = useQuery("notApprovedQParts", () =>
    axios.get<IQPartDTOInclude[]>("http://localhost:3000/qpart/notApproved")
  );

  if (isFetched && qpartData) {
    let qparts = qpartData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve qelements</h1>
          <div className="mainform">
            {qparts.length > 0 ? (
              qparts.map((qpart) => {
                return (
                  <QPartDetails
                    key={qpart.id}
                    qpart={qpart}
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
