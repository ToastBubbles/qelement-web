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
          <h1>approve color</h1>
          <div className="mainform">
            {colors.map((color) => {
              return <ColorDetails color={color} refetchFn={refetch} />;
            })}
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
