import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { IQPartDTOIncludeLess, color } from "../interfaces/general";
import { filterImages, imagePath } from "../utils/utils";
interface ICollectionQPart {
  isOwned: boolean;
  condition: string;
  qpart: IQPartDTOIncludeLess;
}
interface iProps {
  data: ICollectionQPart;
}
export default function GoalColor({ data }: iProps) {
  let hex: string;
  if (data.isOwned) hex = "#" + data.qpart.color.hex;
  else hex = "#eee";
  let images = filterImages(data.qpart.images);
  let primaryImage = images[images.length - 1];
  for (let i = images.length - 1; i >= 0; i--) {
    if (images[i].type == "part") {
      primaryImage = images[i];
    }
    if (images[i].isPrimary) {
      primaryImage = images[i];
      break;
    }
  }
  return (
    <Link
      to={`/part/${data.qpart.mold.parentPart.id}?color=${data.qpart.color.id}`}
      className="goal-item"
    >
      <div className="goal-img">
        <img
          className={data.isOwned ? "" : "goal-not-owned"}
          src={
            images.length > 0
              ? imagePath + primaryImage.fileName
              : "/img/missingimage.png"
          }
        />
      </div>
      <div
        style={{ backgroundColor: "#" + data.qpart.color.hex }}
        className={"goal-color-swatch " + data.qpart.color.type}
      ></div>
      <div style={{ flexGrow: "1" }}>
        <div>
          <div style={{ fontSize: "0.8em" }}>
            L: {data.qpart.color.tlg_name}
          </div>
          <div style={{ fontSize: "0.8em" }}>
            BL: {data.qpart.color.bl_name}
          </div>
          <div style={{ fontSize: "0.8em" }}>
            {data.isOwned ? `Condition: ${data.condition}` : ""}
          </div>
        </div>
      </div>
      <div className={"goal-check check-" + data.isOwned}>
        {data.isOwned ? (
          <svg width="16" height="16" fill="var(--dk-grey)" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
          </svg>
        ) : (
          <svg width="16" height="16" fill="white" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        )}
      </div>
    </Link>
    // <div
    //   className="status-tag d-flex"
    //   style={{ backgroundColor: hex, height: "1.75em", marginBottom: '0.2em' }}
    // >
    //   <div
    //     style={{
    //       borderRight: "solid 1px var(--lt-grey)",
    //       paddingRight: "0.4em",
    //     }}
    //   >
    //     {data.qpart.color.bl_name
    //       ? data.qpart.color.bl_name
    //       : data.qpart.color.tlg_name}
    //   </div>
    //   <div className="goal-color-check">
    //     {data.isOwned ? (
    //       <svg
    //         stroke="#FFFFFF50"
    //         stroke-width="1px"
    //         width="16"
    //         height="16"
    //         fill="#5AAF2B"
    //         viewBox="0 0 16 16"
    //       >
    //         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    //       </svg>
    //     ) : (
    //       <svg
    //         stroke="#FFFFFF50"
    //         stroke-width="1px"
    //         width="16"
    //         height="16"
    //         fill="var(--lt-red)"
    //         viewBox="0 0 16 16"
    //       >
    //         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
    //       </svg>
    //     )}
    //   </div>
    // </div>
  );
}
