import { useQuery } from "react-query";
import axios from "axios";
import { IMoldStatus, IQPartDTOInclude, color } from "../interfaces/general";

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

// interface IMoldIdWName {
//   id: number;
//   number: string;
// }
export default function AllColorStatus({ qparts, moldId, search }: IProps) {
  const { data: colorData, isLoading } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  const [arrayOrder, setArrayOrder] = useState<IMoldCounter[]>([]);

  function orderArray() {
    let rows = 1;
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
    rows = counterObj.length;
    const sortedCounterObj = counterObj
      .slice()
      .sort((a, b) => b.count - a.count);
    let output: IMoldCounter[] = [];
    sortedCounterObj.forEach((obj) =>
      output.push({ id: obj.id, count: obj.count, number: obj.number })
    );
    setArrayOrder(output);
  }

  function sortByStatus(colors: color[]): color[] {
    const sortKey = moldId === -1 ? arrayOrder[0] : moldId;

    const statusMapping: Record<string, Record<string, color[]>> = {
      primary: {
        found: [],
        seen: [],
        idOnly: [],
        known: [],
        other: [],
        unknown: [],
      },
      secondary: {
        found: [],
        seen: [],
        idOnly: [],
        known: [],
        other: [],
        unknown: [],
      },
    };

    const colorsWithoutStatus: color[] = [];

    colors.forEach((color) => {
      if (validateSearch(color, search)) {
        const sameColorQParts = qparts.filter(
          (qpart) => qpart.color.id === color.id
        );

        if (sameColorQParts.length > 0) {
          let alreadyAdded = false;

          sameColorQParts.forEach((scQPart) => {
            if (!alreadyAdded) {
              const statusObj = scQPart.partStatuses[0].status;
              const category =
                scQPart.mold.id === sortKey ? "primary" : "secondary";

              if (statusMapping[category][statusObj]) {
                statusMapping[category][statusObj].push(color);
                alreadyAdded = true;
              }
            }
          });
        } else {
          colorsWithoutStatus.push(color);
        }
      }
    });

    const output = [
      ...statusMapping.primary.found,
      ...statusMapping.primary.seen,
      ...statusMapping.primary.idOnly,
      ...statusMapping.primary.known,
      ...statusMapping.primary.other,
      ...statusMapping.primary.unknown,
      ...statusMapping.secondary.found,
      ...statusMapping.secondary.seen,
      ...statusMapping.secondary.idOnly,
      ...statusMapping.secondary.known,
      ...statusMapping.secondary.other,
      ...statusMapping.secondary.unknown,
      ...colorsWithoutStatus,
    ];

    return output;
  }
  function getStatuses(colorId: number): IMoldStatus[] {
    let output: IMoldStatus[] = [];
    arrayOrder.forEach((obj) => {
      let checker = qparts.find(
        (x) => x.mold.id == obj.id && x.color.id == colorId
      );
      if (checker) {
        output.push({ moldId: obj.id, status: checker.partStatuses[0].status });
      } else {
        output.push({ moldId: obj.id, status: "no status" });
      }
    });

    return output;
  }

  if (colorData && qparts) {
    if (arrayOrder.length == 0 && qparts.length > 0) {
      console.log("ordering array");

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
        {sortedColors.map((color) => (
          <ColorStatus
            key={color.id}
            color={color}
            statuses={getStatuses(color.id)}
          />
        ))}
      </>
    );
  }
}
