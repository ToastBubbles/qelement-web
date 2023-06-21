import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { IQPartDTOInclude, qpart } from "../interfaces/general";
import RecentQPart from "./RecentQPart";

function NewAdditions() {
  const {
    data: qData,
    isLoading: qIsLoading,
    error: qError,
  } = useQuery("allqparts", () =>
    axios.get<IQPartDTOInclude[]>(`http://localhost:3000/qpart/recent/${6}`)
  );
  if (qData) console.log(qData.data);
  return (
    <div className="hp-panel-body">
      {qData?.data.map((qpart) => (

          <RecentQPart
            key={qpart.id}
            qpart={qpart}
          />

      ))}
    </div>
  );
}

export default NewAdditions;
