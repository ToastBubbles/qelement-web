import axios from "axios";
import { useQuery } from "react-query";
import ColorDetails from "../../../components/ColorDetails";
import { color } from "../../../interfaces/general";

export default function ApproveColorView() {
  const {
    data: colData,
 
    isFetched,
    refetch,
  } = useQuery("notApprovedColors", () =>
    axios.get<color[]>("http://localhost:3000/color/notApproved")
  );

  if (isFetched && colData) {
    const colors = colData.data;
    return (
      <>
        <div className="formcontainer">
          <h1>approve colors</h1>
          <div className="mainform">
            {colors.length > 0 ? (
              colors.map((color) => {
                return (
                  <ColorDetails
                    key={color.id}
                    color={color}
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
