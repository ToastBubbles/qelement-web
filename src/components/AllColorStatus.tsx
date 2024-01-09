import { useQuery } from "react-query";
import axios from "axios";
import {
  IColorWUnk,
  IMoldStatusWUNK,
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

  function sortByStatus(colors: color[]): IColorWUnk[] {
    console.log(arrayOrder);

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

    const colorsWithoutStatus: IColorWUnk[] = [];

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
              const statusObj = scQPart.partStatuses[0].status;
              const category =
                scQPart.mold.id === sortKey ? "primary" : "secondary";
              // console.log(scQPart.mold.number, scQPart.color.bl_name, category);
              // console.log(statusMapping[category][statusObj]);

              if (statusMapping[category][statusObj]) {
                statusMapping[category][statusObj].push({
                  unknown: scQPart.isMoldUnknown,
                  color: color,
                });
                alreadyAdded = true;
              }
            }
          });
        } else {
          colorsWithoutStatus.push({ unknown: false, color: color });
        }
      }
    });
    let output = [
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
      // ...colorsWithoutStatus,
    ];
    if (sortBySwatch) {
      output.sort((a, b) => a.color.swatchId - b.color.swatchId);
    }
    output = [...output, ...colorsWithoutStatus];
    return output;
  }
  function getStatuses(colorId: number): IMoldStatusWUNK[] {
    let output: IMoldStatusWUNK[] = [];
    arrayOrder.forEach((obj) => {
      let checker = qparts.find(
        (x) => x.mold.id == obj.id && x.color.id == colorId
      );
      if (checker) {
        output.push({
          moldId: obj.id,
          status: checker.partStatuses[0].status,
          unknown: checker.isMoldUnknown,
        });
      } else {
        output.push({ moldId: obj.id, status: "no status", unknown: false });
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
            statuses={getStatuses(colorWUNK.color.id)}
          />
        ))}
      </>
    );
  }
}
