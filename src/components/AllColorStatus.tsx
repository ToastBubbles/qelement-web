import { useQuery } from "react-query";
import axios from "axios";
import { IQPartDTOInclude, color } from "../interfaces/general";
import { Link } from "react-router-dom";
import {
  getPrefColorIdString,
  getPrefColorName,
  getTextColor,
  validateSearch,
} from "../utils/utils";
import { ReactNode, useContext } from "react";
import { AppContext } from "../context/context";

interface IProps {
  qparts: IQPartDTOInclude[];
  moldId: number;
  search: string;
}
interface IStatusWMoldId {
  status: string;
  moldId: number;
}
export default function AllColorStatus({ qparts, moldId, search }: IProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const { data, isLoading } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );
  function statusLookup(mId: number, cId: number): IStatusWMoldId {
    let output = "no status";
    let thisMoldId = -1;
    qparts.forEach((qpart) => {
      if (moldId == -1) {
        if (qpart.color.id == cId) {
          output = qpart.partStatuses[0].status;
          thisMoldId = qpart.mold.id;
        }
      } else {
        if (qpart.color.id == cId && qpart.mold.id == mId) {
          output = qpart.partStatuses[0].status;
          thisMoldId = qpart.mold.id;
        }
      }
    });
    return { status: output, moldId: thisMoldId };
  }

  function returnJSX(color: color, status: string, moldId: number): ReactNode {
    return (
      <div key={color.id} className="color-row">
        <div className="table-id">
          {getPrefColorIdString(color, prefPayload.prefId)}
        </div>
        <Link
          to={`/part/${moldId}?color=${color.id}`}
          className="flag flag-fill"
          style={{
            backgroundColor: "#" + color.hex,
            color: getTextColor(color.hex),
          }}
        >
          {getPrefColorName(color, prefPayload.prefName)}
        </Link>
        <div
          className={
            "flag-status tag-" + (status == "no status" ? "nostatus" : status)
          }
        >
          {status.toUpperCase()}
        </div>
      </div>
    );
  }
  function sortAndReturnJSX(colors: color[]): ReactNode {
    let foundColors: ReactNode,
      seenColors: ReactNode,
      idOnlyColors: ReactNode,
      knownColors: ReactNode,
      otherColors: ReactNode,
      colorsWithoutStatus: ReactNode;

    colors.forEach((color) => {
      if (validateSearch(color, search)) {
        const statusObj = statusLookup(moldId, color.id);
        if (statusObj.status != "no status") {
          if (statusObj.status == "found") {
            foundColors = [
              foundColors,
              returnJSX(color, statusObj.status, statusObj.moldId),
            ];
          } else if (statusObj.status == "seen") {
            seenColors = [
              seenColors,
              returnJSX(color, statusObj.status, statusObj.moldId),
            ];
          } else if (statusObj.status == "idOnly") {
            idOnlyColors = [
              idOnlyColors,
              returnJSX(color, statusObj.status, statusObj.moldId),
            ];
          } else if (statusObj.status == "known") {
            knownColors = [
              knownColors,
              returnJSX(color, statusObj.status, statusObj.moldId),
            ];
          } else {
            otherColors = [
              otherColors,
              returnJSX(color, statusObj.status, statusObj.moldId),
            ];
          }
        } else {
          colorsWithoutStatus = [
            colorsWithoutStatus,
            returnJSX(color, statusObj.status, statusObj.moldId),
          ];
        }
      }
    });
    return [
      foundColors,
      seenColors,
      idOnlyColors,
      knownColors,
      otherColors,
      colorsWithoutStatus,
    ];
  }
  if (!isLoading && data) {
    const colors = data.data;

    return <div className="allColorStatus">{sortAndReturnJSX(colors)}</div>;
  } else {
    return <p>Loading...</p>;
  }
}
