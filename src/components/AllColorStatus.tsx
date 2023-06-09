import React from "react";
import { useRouter } from "next/router";
import colors from "@/utils/data.js";
import { useQuery } from "react-query";
import axios from "axios";
import { color } from "../interfaces/general";
import { Link } from "react-router-dom";
// const ColorId = () => {
//   const router = useRouter();
//   const { colorId } = router.query;

//   return colorId;
// };

function statusLookup(partId: number, colorId: string) {
  return "unkown";
}

function AllColorStatus({ partId = 0 }) {
  const { data, isLoading, error } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  return (
    <div>
      {!isLoading && data ? (
        data.data.map((color) => (
          <div key={color.id} className="color-row">
            <div className="table-id">
              {color.tlg_id == 0 ? "" : color.tlg_id}
            </div>
            <Link
              to={"/color/" + color.id}
              className="flag lt-grey"
              style={{ backgroundColor: "#" + color.hex }}
            >
              {color.bl_name.length == 0 ? color.tlg_name : color.bl_name}
            </Link>
            <div className="flag flag-status flag-unknown">
              {statusLookup(partId, color.tlg_name)}
            </div>
          </div>
          // <Comment comment={singleComment} key={i + " " + singleComment.id} />
        ))
      ) : (
        <p>loading...</p>
      )}
      {/* {colors.map((singleColor, i) => (
        <div className="color-row">
          <div className="table-id">{singleColor.Lid}</div>
          <Link
            to={"/color/" + singleColor.Lid}
            className="flag"
            style={{ backgroundColor: "#" + singleColor.color }}
          >
            {singleColor.BLName.length == 0
              ? singleColor.LName
              : singleColor.BLName}
          </Link>
          <div className="flag flag-status flag-unknown">
            {statusLookup(partId, singleColor.Lid)}
          </div>
        </div>
        // <Comment comment={singleComment} key={i + " " + singleComment.id} />
      ))} */}
    </div>

    // <Comment comment={singleComment} key={i + " " + singleComment.id} />
    //   ))}
    // </div>
  );
}

export default AllColorStatus;
