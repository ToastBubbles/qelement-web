import { useQuery } from "react-query";
import axios from "axios";
import { IQPartDTOInclude, color } from "../interfaces/general";
import { Link } from "react-router-dom";
import { validateSearch } from "../utils/utils";
import { ReactNode } from "react";

interface IProps {
  qparts: IQPartDTOInclude[];
  moldId: number;
  search: string;
}

export default function AllColorStatus({ qparts, moldId, search }: IProps) {
  const { data, isLoading, error } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );
  function statusLookup(mId: number, cId: number) {
    let output = "no status";
    qparts.forEach((qpart) => {
      if (moldId == -1) {
        if (qpart.color.id == cId) {
          output = qpart.partStatuses[0].status;
        }
      } else {
        if (qpart.color.id == cId && qpart.mold.id == mId) {
          output = qpart.partStatuses[0].status;
        }
      }
    });
    return output;
  }
  function returnJSX(color: color, status: string): ReactNode {
    return (
      <div key={color.id} className="color-row">
        <div className="table-id">{color.tlg_id == 0 ? "" : color.tlg_id}</div>
        <Link
          to={"/color/" + color.id}
          className="flag lt-grey"
          style={{ backgroundColor: "#" + color.hex }}
        >
          {color.bl_name.length == 0 ? color.tlg_name : color.bl_name}
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

  if (!isLoading && data) {
    let colors = data.data;
    function sortAndReturnJSX(): ReactNode {
      let foundColors: ReactNode,
        seenColors: ReactNode,
        idOnlyColors: ReactNode,
        knownColors: ReactNode,
        otherColors: ReactNode,
        colorsWithoutStatus: ReactNode;

      colors.forEach((color) => {
        if (validateSearch(color, search)) {
          let status = statusLookup(moldId, color.id);
          if (status != "no status") {
            if (status == "found") {
              foundColors = [foundColors, returnJSX(color, status)];
            } else if (status == "seen") {
              seenColors = [seenColors, returnJSX(color, status)];
            } else if (status == "idOnly") {
              idOnlyColors = [idOnlyColors, returnJSX(color, status)];
            } else if (status == "known") {
              knownColors = [knownColors, returnJSX(color, status)];
            } else {
              otherColors = [otherColors, returnJSX(color, status)];
            }
          } else {
            colorsWithoutStatus = [
              colorsWithoutStatus,
              returnJSX(color, status),
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

    return <div className="allColorStatus">{sortAndReturnJSX()}</div>;
  } else {
    return <p>Loading...</p>;
  }
}
