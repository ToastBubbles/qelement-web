import axios from "axios";
import { useQuery, useMutation } from "react-query";
import showToast, { Mode } from "../../../utils/utils";
import { color, iIdOnly } from "../../../interfaces/general";
import ColorDetails from "../../../components/ColorDetails";

export default function ApproveColorView() {
  const {
    data: colData,
    isLoading,
    error,
    isFetched,
    refetch,
  } = useQuery("notApprovedColors", () =>
    axios.get<color[]>("http://localhost:3000/color/notApproved")
  );

  if (isFetched && colData) {
    let colors = colData.data;
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
