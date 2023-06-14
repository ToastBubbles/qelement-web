import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { color, part } from "../interfaces/general";
import { formatDate } from "../utils/utils";

interface IProps {
  id: number;
  partId: number;
  colorId: number;
  createdAt: string;
}

export default function RecentQPart({
  id,
  partId,
  colorId,
  createdAt,
}: IProps) {
  const {
    data: partData,
    isLoading: partIsLoading,
    error: partError,
  } = useQuery({
    queryKey: "part",
    queryFn: () => axios.get<part>(`http://localhost:3000/parts/${partId}`),
    enabled: !!partId,
  });

  if (partData) {
    const {
      data: colData,
      isLoading: colIsLoading,
      error: colError,
    } = useQuery(`colors${colorId}`, () =>
      axios.get<color>(`http://localhost:3000/color/${colorId}`)
    );
    if (colData)
      return (
        <Link
          to={`/part/${partId}?color=${colorId}`}
          className="listing new-listing"
        >
          <div className="listing-img"></div>
          <div>
            {" "}
            <div>{partData.data.name}</div>
            <div className="listing-color">
              <div
                className={"listing-color-swatch " + colData.data.type}
                style={{ backgroundColor: "#" + colData.data.hex }}
              ></div>
              <div>
                {colData.data.bl_name
                  ? colData.data.bl_name
                  : colData.data.tlg_name}
              </div>
            </div>
            <div style={{ fontSize: "0.8em" }}>
              Added: {formatDate(createdAt)}
            </div>
          </div>
        </Link>
      );
  } else return <div className="listing new-listing">Loading...</div>;
}
