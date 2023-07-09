import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  ICollectionDTOGET,
  IGoalDTOExtended,
  IQPartDTOIncludeLess,
} from "../interfaces/general";
import { useQuery } from "react-query";
import axios from "axios";
import GoalColor from "./GoalColor";

interface IProps {
  goal: IGoalDTOExtended;
  collection: ICollectionDTOGET[];
}
interface ICollectionQPart {
  isOwned: boolean;
  qpart: IQPartDTOIncludeLess;
}
export default function Goal({ goal, collection }: IProps) {
  let theseParts: ICollectionDTOGET[] = [];

  collection.forEach((part) => {
    if (goal.partMoldId != null) {
      if (part.qpart.mold.id == goal.partMoldId) {
        theseParts.push(part);
      }
    } else {
      if (part.qpart.mold.parentPart.id == goal.part.id) {
        theseParts.push(part);
      }
    }
  });
  console.log("my parts", theseParts);

  const { data: qpartData, refetch: qpartRefetch } = useQuery({
    queryKey: `qpartByPartId${goal.part.id}`,
    queryFn: () => {
      return axios.get<IQPartDTOIncludeLess[]>(
        `http://localhost:3000/qpart/matchesByPartId/${goal.part.id}`
      );
    },
    staleTime: 100,
    // enabled: !!payload.id,
  });

  function showMold() {
    if (goal.partMoldId == null) return "All Molds";
    return goal.part.molds.find((x) => x.id == goal.partMoldId)?.number;
  }
  function showColors() {
    if (goal.includeSolid && goal.includeTrans && goal.includeOther)
      return "All Colors";
    let output = "";
    let count = 0;
    if (goal.includeSolid) {
      output += "Solid";
      count++;
    }
    if (goal.includeTrans) {
      if (count > 0) output += " and ";
      output += "Transparent";
      count++;
    }
    if (goal.includeOther) {
      if (count > 0) output += " and ";
      output += "Other";
      count++;
    }

    return (output + " Colors Only").trim();
  }
  if (qpartData) {
    let qparts = qpartData.data;
    let mappedParts: ICollectionQPart[] = [];
    qparts.forEach((qpart) => {
      let temp = theseParts.find((x) => x.qpart.id == qpart.id);
      if (temp) {
        mappedParts.push({ isOwned: true, qpart: qpart });
      } else {
        mappedParts.push({ isOwned: false, qpart: qpart });
      }
    });
    function calcPercent() {
      let count = 0;
      console.log("mappppppped", mappedParts);

      for (const item of mappedParts) {
        if (item.isOwned) {
          count++;
        }
      }
      let output = Math.floor((count / mappedParts.length) * 100);
      console.log(output);

      return output;
    }
    return (
      <div className="goal-body">
        <div style={{ fontSize: "2em" }}>
          {goal.name ? goal.name : goal.part.name}
        </div>

        <div
          style={{
            color: "var(--dk-grey)",
            borderBottom: "solid 1px var(--lt-grey)",
          }}
        >
          {goal.part.name} - {showMold()} - {showColors()}
        </div>
        <div className="goal-body-colors" style={{ padding: "0.5em" }}>
          {mappedParts.map((qpart) => (
            <GoalColor data={qpart} />
          ))}
        </div>
        <div className="goal-meter-container">
          <div className="goal-percentage">{calcPercent() + "%"}</div>

          <div
            className="goal-meter"
            style={{ width: calcPercent() + "%" }}
          ></div>
        </div>
      </div>
    );
  }
}
