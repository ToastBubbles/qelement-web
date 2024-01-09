import axios from "axios";
import { useQuery } from "react-query";
import { ISculptureDTO} from "../../interfaces/general";
import { Link } from "react-router-dom";

export default function AllSculptureView() {
  const { data: sculptData } = useQuery("allSculpts", () =>
    axios.get<ISculptureDTO[]>("http://localhost:3000/sculpture")
  );
  if (sculptData) {
    let sculptures = sculptData.data;
    if (sculptures.length > 0) {
      return (
        <>
          <div className="mx-w">
            <h1>All Sculptures</h1>
            <div className="parts-view">
              {sculptures.map((sculpt) => {
                return (
                  <Link key={sculpt.id} to={"/sculpture/" + sculpt.id}>
                    {sculpt.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="mx-w">
            <h1>All Sculptures</h1>
            <div className="parts-view">No Sculptures found!</div>
          </div>
        </>
      );
    }
  } else {
    return <p>loading</p>;
  }
}
