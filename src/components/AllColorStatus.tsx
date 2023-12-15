import { useQuery } from "react-query";
import axios from "axios";
import { IMoldStatus, IQPartDTOInclude, color } from "../interfaces/general";
import { Link } from "react-router-dom";
import {
  getPrefColorIdString,
  getPrefColorName,
  getTextColor,
  validateSearch,
} from "../utils/utils";
import { ReactNode, useContext, useState } from "react";
import { AppContext } from "../context/context";
import ColorStatus from "./ColorStatus";

interface IProps {
  qparts: IQPartDTOInclude[];
  moldId: number;
  search: string;
}
interface IStatusWMoldId {
  status: string;
  moldId: number;
  moldNumber: string;
}
interface IMoldCounter {
  id: number;
  count: number;
}
export default function AllColorStatus({ qparts, moldId, search }: IProps) {
  const { data: colorData, isLoading } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  const [arrayOrder, setArrayOrder] = useState<number[]>([]);

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
      if (!exists) counterObj.push({ id: qpart.mold.id, count: 1 });
    });
    rows = counterObj.length;
    const sortedCounterObj = counterObj
      .slice()
      .sort((a, b) => b.count - a.count);
    let output: number[] = [];
    sortedCounterObj.forEach((obj) => output.push(obj.id));
    setArrayOrder(output);
  }

  function sortByStatus(colors: color[]): color[] {
    const sortKey = moldId === -1 ? arrayOrder[0] : moldId;
    const statusMapping: Record<string, color[]> = {
      found: [],
      seen: [],
      idOnly: [],
      known: [],
      other: [],
      unknown: [],
    };
    const secondaryStatusMapping: Record<string, color[]> = {
      found: [],
      seen: [],
      idOnly: [],
      known: [],
      other: [],
      unknown: [],
    };
    const colorsWithoutStatus: color[] = [];

    colors.forEach((color) => {
      if (validateSearch(color, search)) {
        const sameColorQParts = qparts.filter(
          (qpart) => qpart.color.id === color.id
        );

        if (sameColorQParts.length > 0) {
          sameColorQParts.forEach((scQPart) => {
            const statusKey = scQPart.mold.id === sortKey ? "" : "secondary";

            const statusObj = scQPart.partStatuses[0].status;
            const targetArray = statusKey
              ? secondaryStatusMapping[statusObj]
              : statusMapping[statusObj];

            targetArray.push(color);
          });
        } else {
          colorsWithoutStatus.push(color);
        }
      }
    });

    const output = [
      ...statusMapping.found,
      ...statusMapping.seen,
      ...statusMapping.idOnly,
      ...statusMapping.known,
      ...statusMapping.other,
      ...statusMapping.unknown,
      ...secondaryStatusMapping.found,
      ...secondaryStatusMapping.seen,
      ...secondaryStatusMapping.idOnly,
      ...secondaryStatusMapping.known,
      ...secondaryStatusMapping.other,
      ...secondaryStatusMapping.unknown,
      ...colorsWithoutStatus,
    ];

    return output;
  }

  function getStatuses(colorId: number): IMoldStatus[] {
    let output: IMoldStatus[] = [];
    arrayOrder.forEach((id) => {
      let checker = qparts.find(
        (x) => x.mold.id == id && x.color.id == colorId
      );
      if (checker) {
        output.push({ moldId: id, status: checker.partStatuses[0].status });
      } else {
        output.push({ moldId: id, status: "no status" });
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
    return (
      <>
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
  // function statusLookup(mId: number, cId: number): IStatusWMoldId[] {
  //   // let status = "no status";
  //   // let thisMoldId = -1;
  //   // let thisMoldNumber = "";
  //   let output: IStatusWMoldId[] = [];
  //   qparts.forEach((qpart) => {
  //     if (moldId == -1) {
  //       if (qpart.color.id == cId) {
  //         output.push({
  //           status: qpart.partStatuses[0].status,
  //           moldId: qpart.mold.id,
  //           moldNumber: qpart.mold.number,
  //         });
  //       }
  //     } else {
  //       if (qpart.color.id == cId && qpart.mold.id == mId) {
  //         output.push({
  //           status: qpart.partStatuses[0].status,
  //           moldId: qpart.mold.id,
  //           moldNumber: qpart.mold.number,
  //         });
  //       }
  //     }
  //   });

  //   return output;
  // }

  // function returnStatusJSX(
  //   color: color,
  //   status: string,
  //   moldIdLocal: number,
  //   moldNumber: string
  // ): ReactNode {
  //   let rows = 1;
  //   let mostCommonId = -1;
  //   if (moldId != -1) {
  //     let counterObj: IMoldCounter[] = [];
  //     qparts.forEach((qpart) => {
  //       let exists = false;
  //       counterObj.forEach((counter) => {
  //         if (counter.id == qpart.mold.id) {
  //           exists = true;
  //           counter.count++;
  //         }
  //       });
  //       if (!exists) counterObj.push({ id: qpart.mold.id, count: 1 });
  //     });
  //     rows = counterObj.length;
  //     const entryWithHighestCount = counterObj.reduce(
  //       (maxEntry, currentEntry) => {
  //         return currentEntry.count > maxEntry.count ? currentEntry : maxEntry;
  //       },
  //       counterObj[0]
  //     );

  //     mostCommonId = entryWithHighestCount.id;
  //   }
  //   return (
  //     <div key={color.id} className="color-row">
  //       <div
  //         className={
  //           "flag-status tag-" + (status == "no status" ? "nostatus" : status)
  //         }
  //       >
  //         {status.toUpperCase()}
  //       </div>
  //     </div>
  //   );
  // }
  // function returnColorJSX(color: color): ReactNode {
  //   return (
  //     <div key={color.id} className="color-row">
  //       <div className="table-id">
  //         {getPrefColorIdString(color, prefPayload.prefId)}
  //       </div>
  //       <Link
  //         to={`/part/${qparts[0].mold.parentPart.id}?color=${color.id}`}
  //         className="flag flag-fill"
  //         style={{
  //           backgroundColor: "#" + color.hex,
  //           color: getTextColor(color.hex),
  //         }}
  //       >
  //         {getPrefColorName(color, prefPayload.prefName)}
  //       </Link>
  //     </div>
  //   );
  // }
  // function sortAndReturnJSX(colors: color[]): ReactNode {
  //   let foundColors: ReactNode,
  //     seenColors: ReactNode,
  //     idOnlyColors: ReactNode,
  //     knownColors: ReactNode,
  //     otherColors: ReactNode,
  //     colorsWithoutStatus: ReactNode;
  //   let rows = 1;
  //   let counterObj: IMoldCounter[] = [];

  //   if (moldId == -1) {
  //     qparts.forEach((qpart) => {
  //       let exists = false;
  //       console.log(qpart);

  //       counterObj.forEach((counter) => {
  //         if (counter.id == qpart.mold.id) {
  //           exists = true;
  //           counter.count++;
  //         }
  //       });
  //       if (!exists) counterObj.push({ id: qpart.mold.id, count: 1 });
  //     });
  //     rows = counterObj.length;
  //   } else {
  //     qparts.forEach((qpart) => {
  //       if (qpart.mold.id == moldId) {
  //         let exists = false;
  //         counterObj.forEach((counter) => {
  //           if (counter.id == qpart.mold.id) {
  //             exists = true;
  //             counter.count++;
  //           }
  //         });
  //         if (!exists) counterObj.push({ id: qpart.mold.id, count: 1 });
  //       }
  //     });
  //     rows = counterObj.length;
  //   }
  //   const sortedCounterObj = counterObj
  //     .slice()
  //     .sort((a, b) => b.count - a.count);
  //   console.log(sortedCounterObj);

  //   colors.forEach((color) => {
  //     if (validateSearch(color, search)) {
  //       const statusObjArr = statusLookup(moldId, color.id);
  //       let output: ReactNode[] = [];

  //       output.push(returnColorJSX(color));

  //       statusObjArr.map((obj) => {
  //         if (obj.status != "no status") {
  //           if (obj.status == "found") {
  //             foundColors = [
  //               foundColors,
  //               returnStatusJSX(color, obj.status, obj.moldId, obj.moldNumber),
  //             ];
  //           } else if (obj.status == "seen") {
  //             seenColors = [
  //               seenColors,
  //               returnStatusJSX(color, obj.status, obj.moldId, obj.moldNumber),
  //             ];
  //           } else if (obj.status == "idOnly") {
  //             idOnlyColors = [
  //               idOnlyColors,
  //               returnStatusJSX(color, obj.status, obj.moldId, obj.moldNumber),
  //             ];
  //           } else if (obj.status == "known") {
  //             knownColors = [
  //               knownColors,
  //               returnStatusJSX(color, obj.status, obj.moldId, obj.moldNumber),
  //             ];
  //           } else {
  //             otherColors = [
  //               otherColors,
  //               returnStatusJSX(color, obj.status, obj.moldId, obj.moldNumber),
  //             ];
  //           }
  //         } else {
  //           colorsWithoutStatus = [
  //             colorsWithoutStatus,
  //             returnStatusJSX(color, obj.status, obj.moldId, obj.moldNumber),
  //           ];
  //         }
  //       });
  //     }
  //   });
  //   return [
  //     foundColors,
  //     seenColors,
  //     idOnlyColors,
  //     knownColors,
  //     otherColors,
  //     colorsWithoutStatus,
  //   ];
  // }
  // if (!isLoading && data) {
  //   const colors = data.data;

  //   return <div className="allColorStatus">{sortAndReturnJSX(colors)}</div>;
  // } else {
  //   return <p>Loading...</p>;
  // }
}
