import axios from "axios";
import { useQuery } from "react-query";
import ColorDetails from "../../../components/Approval Componenents/ColorDetails";
import { IColorWCreator, color } from "../../../interfaces/general";
import { Link } from "react-router-dom";

export default function ApproveColorView() {
  const {
    data: colData,

    isFetched,
    refetch,
  } = useQuery("notApprovedColors", () =>
    axios.get<IColorWCreator[]>("http://localhost:3000/color/notApproved")
  );

  if (isFetched && colData) {
    const colors = colData.data;
    console.log(colors);

    return (
      <>
        <div className="formcontainer">
          <h1>approve colors</h1>
          <Link className="link"  to={"/approve"}>Back to Approval Overview</Link>
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
