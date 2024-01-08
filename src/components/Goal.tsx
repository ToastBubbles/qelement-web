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
  condition: string;
  qpart: IQPartDTOIncludeLess;
}
export default function Goal({ goal, collection }: IProps) {
  const theseParts: ICollectionDTOGET[] = [];

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

  const { data: qpartData } = useQuery({
    queryKey: `qpartByPartId${goal.part.id}m${goal.partMoldId}`,
    queryFn: () => {
      return axios.get<IQPartDTOIncludeLess[]>(
        `http://localhost:3000/qpart/matchesByPartId/${goal.part.id}`
      );
    },
    staleTime: 50,
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
      if (count > 0) output += " & ";
      output += "Transparent";
      count++;
    }
    if (goal.includeOther) {
      if (count > 0) output += " & ";
      output += "Other";
      count++;
    }

    return (output + " Colors Only").trim();
  }
  function calcPercent(mappedParts: ICollectionQPart[]) {
    let count = 0;
    //   console.log("mappppppped", mappedParts);

    for (const item of mappedParts) {
      if (item.isOwned) {
        count++;
      }
    }
    const output = Math.floor((count / mappedParts.length) * 100);

    return output;
  }
  function getRatio(mappedParts: ICollectionQPart[]): string {
    let count = 0;
    //   console.log("mappppppped", mappedParts);

    for (const item of mappedParts) {
      if (item.isOwned) {
        count++;
      }
    }

    return `${count} / ${mappedParts.length}`;
  }

  if (qpartData) {
    const qparts = qpartData.data;
    const mappedParts: ICollectionQPart[] = [];

    qparts.forEach((qpart) => {
      // console.log(qpart);
      let isKnown = false;
      for (const statusData of qpart.partStatuses) {
        if (statusData.status == "known") {
          isKnown = true;
        }
      }

      if ((!goal.includeKnown && !isKnown) || goal.includeKnown) {
        if (
          (goal.includeSolid && qpart.color.type == "solid") ||
          (goal.includeTrans && qpart.color.type == "transparent") ||
          (goal.includeOther &&
            qpart.color.type != "solid" &&
            qpart.color.type != "transparent")
        ) {
          let count = 0;
          let bestCondition = "";
          let temp;
          for (const part of theseParts) {
            if (part.qpart.id === qpart.id) {
              temp = part.qpart;
              count++;
              if (count == 1) {
                bestCondition = part.condition;
              } else {
                if (bestCondition == "damaged") {
                  bestCondition = part.condition;
                } else if (bestCondition == "used" && part.condition == "new") {
                  bestCondition = part.condition;
                }
              }
            }
          }
          // let temp = theseParts.find((x) => x.qpart.id == qpart.id);

          if (temp) {
            // console.log("temp", temp);
            console.log("goal", goal.partMoldId);
            if (
              (goal.partMoldId != null && goal.partMoldId == temp.mold.id) ||
              goal.partMoldId == null
            )
              mappedParts.push({
                isOwned: true,
                qpart: qpart,
                condition: bestCondition,
              });
          } else {
            // console.log("else");

            // console.log(
            //   `goal: ${goal.partMoldId}  part: ${qpart.color.bl_name} ${qpart.mold.number} (${qpart.mold.id}) temp: ${temp}`
            // );
            // console.log(theseParts);
            // console.log(typeof goal.partMoldId);

            if (
              (goal.partMoldId != null && goal.partMoldId == qpart.mold.id) ||
              goal.partMoldId == null
            )
              mappedParts.push({ isOwned: false, qpart: qpart, condition: "" });
          }
        }
      }
    });

    return (
      <div className="goal-body">
        <div style={{ fontSize: "2em", padding: "0 0.25em " }}>
          {goal.part.name}
        </div>

        <div
          style={{
            color: "var(--dk-grey)",
            borderBottom: "solid 1px var(--lt-grey)",
            padding: "0 0.5em 0.5em 0.5em",
            fontSize: "0.9em",
          }}
        >
          {showMold()} - {goal.includeKnown ? "QParts & Known" : "QParts only"}{" "}
          - {showColors()}
        </div>
        <div className="goal-body-colors">
          {mappedParts.map((qpart) => (
            <GoalColor data={qpart} />
          ))}
        </div>
        <div className="goal-meter-container">
          <div className="goal-percentage">{getRatio(mappedParts)}</div>

          <div
            className="goal-meter"
            style={{ width: calcPercent(mappedParts) + "%" }}
          ></div>
        </div>
      </div>
    );
  }
}
