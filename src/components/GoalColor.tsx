import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { IQPartDTOIncludeLess, color } from "../interfaces/general";
interface ICollectionQPart {
  isOwned: boolean;
  qpart: IQPartDTOIncludeLess;
}
interface iProps {
  data: ICollectionQPart;
}
export default function GoalColor({ data }: iProps) {
  let hex: string;
  if (data.isOwned) hex = "#" + data.qpart.color.hex;
  else hex = "#eee";
  return (
    <div
      className="status-tag d-flex"
      style={{ backgroundColor: hex, height: "1.75em", marginBottom: '0.2em' }}
    >
      <div
        style={{
          borderRight: "solid 1px var(--lt-grey)",
          paddingRight: "0.4em",
        }}
      >
        {data.qpart.color.bl_name
          ? data.qpart.color.bl_name
          : data.qpart.color.tlg_name}
      </div>
      <div className="goal-color-check">
        {data.isOwned ? (
          <svg
            stroke="#FFFFFF50"
            stroke-width="1px"
            width="16"
            height="16"
            fill="#5AAF2B"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
        ) : (
          <svg
            stroke="#FFFFFF50"
            stroke-width="1px"
            width="16"
            height="16"
            fill="var(--lt-red)"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
          </svg>
        )}
      </div>
    </div>
  );
}
