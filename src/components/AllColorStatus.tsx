import React from "react";
import { useRouter } from "next/router";
import colors from "@/utils/data.js";
import { useQuery } from "react-query";
import axios from "axios";
import { color } from "../interfaces/general";
import { Link } from "react-router-dom";
import { validateSearch } from "../utils/utils";

function statusLookup(partId: number, colorId: string) {
  return "unkown";
}

interface IProps {
  partId: number;
  search: string;
}

function AllColorStatus({ partId = 0, search }: IProps) {
  const { data, isLoading, error } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  return (
    <div className="allColorStatus">
      {!isLoading && data ? (
        data.data.map((color) => (
          validateSearch(color, search) &&
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
        ))
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}

export default AllColorStatus;
