import axios from "axios";
import { useQuery } from "react-query";
import { IQPartDTOInclude, ISculptureDTO } from "../interfaces/general";
import RecentQPart from "./RecentQPart";
import RecentSculpture from "./RecentSculpture";
interface IProps {
  type: string;
}
function NewAdditions({ type }: IProps) {
  if (type == "qpart") {
    const { data: qData } = useQuery("recentqparts", () =>
      axios.get<IQPartDTOInclude[]>(`http://localhost:3000/qpart/recent/${6}`)
    );
    // if (qData) console.log(qData.data);
    return (
      <div className="hp-panel-body rib-container">
        {qData?.data.map((qpart) => {
          return <RecentQPart key={qpart.id} qpart={qpart} />;
        })}
      </div>
    );
  } else if (type == "sculpture") {
    const { data: sculptData } = useQuery("recentSculpts", () =>
      axios.get<ISculptureDTO[]>(`http://localhost:3000/sculpture/recent/${6}`)
    );

    // if (qData) console.log(qData.data);
    return (
      <div className="hp-panel-body rib-container">
        {sculptData?.data.map((sculpture) => {
          return <RecentSculpture key={sculpture.id} sculpture={sculpture} />;
        })}
      </div>
    );
  } else return <>Loading....</>;
}

export default NewAdditions;
