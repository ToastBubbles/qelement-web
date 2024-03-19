import { useQuery } from "react-query";
import axios from "axios";
import {
  IColorWUnk,
  IMoldStatusWUNK,
  IPartStatusDTO,
  IQPartDTOInclude,
  color,
} from "../interfaces/general";
import { validateSearch } from "../utils/utils";
import { useState } from "react";
import ColorStatus from "./ColorStatus";

interface IProps {
  qparts: IQPartDTOInclude[];
  moldId: number;
  search: string;
}

interface IMoldCounter {
  id: number;
  count: number;
  number: string;
}

export default function AllColorStatus({ qparts, moldId, search }: IProps) {
  const { data: colorData } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  const [arrayOrder, setArrayOrder] = useState<IMoldCounter[]>([]);

  function orderArray() {
    let counterObj: IMoldCounter[] = [];
    qparts.forEach((qpart) => {
      let exists = false;
      counterObj.forEach((counter) => {
        if (counter.id == qpart.mold.id) {
          exists = true;
          counter.count++;
        }
      });
      if (!exists)
        counterObj.push({
          id: qpart.mold.id,
          count: 1,
          number: qpart.mold.number,
        });
    });

    const sortedCounterObj = counterObj
      .slice()
      .sort((a, b) => b.count - a.count);
    let output: IMoldCounter[] = [];
    sortedCounterObj.forEach((obj) =>
      output.push({ id: obj.id, count: obj.count, number: obj.number })
    );

    setArrayOrder(output);
  }

  function sortByStatus(colors: color[]): IColorWUnk[] {
    // const sortKey = moldId === -1 ? arrayOrder[0].id : moldId;
    let sortBySwatch = false;
    if (moldId == -1) sortBySwatch = true;
    const sortKey = moldId;

    const statusMapping: Record<string, Record<string, IColorWUnk[]>> = {
      primary: {
        found: [],
        seen: [],
        idOnly: [],
        known: [],
        other: [],
        unknown: [],
        noStatus: [],
      },
      secondary: {
        found: [],
        seen: [],
        idOnly: [],
        known: [],
        other: [],
        unknown: [],
        noStatus: [],
      },
    };

    const colorsWithoutParts: IColorWUnk[] = [];

    colors.forEach((color) => {
      if (validateSearch(color, search)) {
        const sameColorQParts = qparts.filter(
          (qpart) => qpart.color.id === color.id
        );

        if (sameColorQParts.length > 0) {
          let alreadyAdded = false;

          //sort here

          sameColorQParts.sort((a, b) => {
            const countA =
              arrayOrder.find((obj) => obj.id === a.mold.id)?.count || 0;
            const countB =
              arrayOrder.find((obj) => obj.id === b.mold.id)?.count || 0;

            // If the mold IDs are the same as sortKey, prioritize that
            if (a.mold.id === sortKey) {
              return -1;
            } else if (b.mold.id === sortKey) {
              return 1;
            }

            // Sort in descending order based on mold count
            return countB - countA;
          });

          sameColorQParts.forEach((scQPart) => {
            if (!alreadyAdded) {
              if (scQPart.partStatuses.length > 0) {
                // const statusObj = scQPart.partStatuses[0].status;
                const statusObj = findHighestStatus(
                  scQPart.partStatuses
                ).status;
                const category =
                  scQPart.mold.id === sortKey ? "primary" : "secondary";

                if (statusMapping[category][statusObj]) {
                  statusMapping[category][statusObj].push({
                    unknown: scQPart.isMoldUnknown,
                    color: color,
                  });
                  alreadyAdded = true;
                }
              } else {
                console.log("here", color);

                const category =
                  scQPart.mold.id === sortKey ? "primary" : "secondary";
                console.log(statusMapping[category].noStatus);

                if (statusMapping[category].noStatus) {
                  console.log("pushing ", color.bl_name);

                  statusMapping[category].noStatus.push({
                    unknown: scQPart.isMoldUnknown,
                    color: color,
                  });
                  alreadyAdded = true;
                }
              }
            }
          });
        } else {
          colorsWithoutParts.push({ unknown: false, color: color });
        }
      }
    });
    console.log(statusMapping.primary.noStatus);

    let output = [
      ...statusMapping.primary.found,
      ...statusMapping.primary.seen,
      ...statusMapping.primary.idOnly,
      ...statusMapping.primary.known,
      ...statusMapping.primary.other,
      ...statusMapping.primary.unknown,
      ...statusMapping.primary.noStatus,
      ...statusMapping.secondary.found,
      ...statusMapping.secondary.seen,
      ...statusMapping.secondary.idOnly,
      ...statusMapping.secondary.known,
      ...statusMapping.secondary.other,
      ...statusMapping.secondary.unknown,
      ...statusMapping.secondary.noStatus,
      // ...colorsWithoutParts,
    ];
    if (sortBySwatch) {
      output.sort((a, b) => a.color.swatchId - b.color.swatchId);
    }
    console.log(output);

    output = [...output, ...colorsWithoutParts];
    return output;
  }

  function findHighestStatus(statuses: IPartStatusDTO[]): IPartStatusDTO {
    if (statuses.length == 0)
      return {
        id: -1,
        status: "no status",
        date: "",
        location: "",
        note: "",
        qpartId: -1,
        creatorId: -1,
        approvalDate: "",
        createdAt: "",
      };
    const sortedStatuses = statuses.sort((a, b) => {
      // Parse date strings into Date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    const statusOrder = [
      "known",
      "found",
      "seen",
      "idOnly",
      "other",
      "unknown",
      "noStatus",
    ];

    for (const status of statusOrder) {
      const highestStatus = sortedStatuses.find((x) => x.status === status);
      if (highestStatus) {
        return highestStatus;
      }
    }
    console.log("Fallback, returning first entry");

    return sortedStatuses[0];
  }
  function getStatuses(color: color): IMoldStatusWUNK[] {
    let output: IMoldStatusWUNK[] = [];

    arrayOrder.forEach((obj) => {
      let checker = qparts.find(
        (x) => x.mold.id == obj.id && x.color.id == color.id
      );
      if (checker) {
        // console.log(`Checker ${checker.mold.number} ${color.bl_name}`);
        // console.log(checker.partStatuses);

        output.push({
          partId: qparts[0].mold.parentPart.id,
          moldId: obj.id,
          status: findHighestStatus(checker.partStatuses).status,
          unknown: checker.isMoldUnknown,
        });
      } else {
        output.push({
          partId: qparts[0].mold.parentPart.id,
          moldId: obj.id,
          status: "no parts",
          unknown: false,
        });
      }
    });

    return output;
  }

  if (colorData && qparts) {
    if (arrayOrder.length == 0 && qparts.length > 0) {
      orderArray();
    }
    let colors = colorData.data;
    let sortedColors = sortByStatus(colors);

    let i = 0;
    return (
      <>
        <div className="rot-text-container">
          {arrayOrder.map((obj) => {
            i++;
            if (i <= 4) {
              return (
                <div
                  key={i}
                  className={`txt-col-header text-sizebyqty-${
                    arrayOrder.length > 4 ? 4 : arrayOrder.length
                  }`}
                >
                  {obj.number}
                </div>
              );
            }
          })}
        </div>
        {sortedColors.map((colorWUNK) => (
          <ColorStatus
            key={colorWUNK.color.id}
            color={colorWUNK.color}
            statuses={getStatuses(colorWUNK.color)}
          />
        ))}
      </>
    );
  }
}
