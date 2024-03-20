import { useContext } from "react";
import { AppContext } from "../context/context";
import { ICollectionDTOGET } from "../interfaces/general";
import { filterImages, imagePath } from "../utils/utils";

interface iProps {
  data: ICollectionDTOGET;
}
export default function CollectionPart({ data }: iProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const images = filterImages(data.qpart.images);
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

  function getLetter(bool: boolean): string {
    if (!bool) return "";
    if (bool && !data.availDuplicates) return "Y";
    if (bool && data.availDuplicates) return "D";
    return "";
  }

  return (
    <div className="collection-item">
      <div className="goal-img">
        <img
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
          <div>
            {data.qpart.mold.parentPart.name} ({data.qpart.mold.number})
          </div>
          <div style={{ fontSize: "0.8em" }}>
            {data.qpart.color.bl_name
              ? data.qpart.color.bl_name
              : data.qpart.color.tlg_name}
          </div>
          <div style={{ fontSize: "0.8em" }}>Condition: {data.condition}</div>
        </div>
      </div>
      <div className="col-part-body">
        {prefPayload.differentiateMaterialsInCollection && (
          <div style={{ fontSize: "0.9em", overflow: "hidden", width: "7em" }}>
            {data.material.toUpperCase()}
          </div>
        )}
        <div
          style={{ fontWeight: "bolder" }}
          className={
            getLetter(data.forSale) == "D" && data.quantity <= 1
              ? "lt-grey-txt"
              : ""
          }
        >
          {getLetter(data.forSale)}
        </div>
        <div
          style={{ fontWeight: "bolder" }}
          className={
            getLetter(data.forTrade) == "D" && data.quantity <= 1
              ? "lt-grey-txt"
              : ""
          }
        >
          {getLetter(data.forTrade)}
        </div>
        <div>{data.quantity}</div>
      </div>
      {/* <div className={"goal-check check-" + data.isOwned}>
        {data.isOwned ? (
          <svg width="16" height="16" fill="var(--dk-grey)" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
          </svg>
        ) : (
          <svg width="16" height="16" fill="white" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        )}
      </div> */}
    </div>
  );
}
