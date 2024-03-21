import { CSSProperties, useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import { ICollectionDTOGET, iIdOnly } from "../interfaces/general";
import showToast, { Mode, filterImages, imagePath } from "../utils/utils";
import ConfirmPopup from "./ConfirmPopup";
import { useMutation } from "react-query";
import axios from "axios";

interface iProps {
  data: ICollectionDTOGET;
  allowEdit: boolean;
  tellParentImEditing?: (b: boolean) => void;
}

interface IColEdits {
  id: number;
  forTrade: boolean;
  forSale: boolean;
  availDuplicates: boolean;
  material: string;
  quantity: number;
  condition: string;
}
export default function CollectionPart({
  data,
  allowEdit,
  tellParentImEditing,
}: iProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [isHovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopdown, setShowPopdown] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [PsuedoDelete, setPsuedoDelete] = useState<boolean>(false);

  const [forTrade, setForTrade] = useState<boolean>(data.forTrade);
  const [forSale, setForSale] = useState<boolean>(data.forSale);
  const [availDuplicates, setAvailDuplicates] = useState<boolean>(
    data.availDuplicates
  );
  const [material, setMaterial] = useState<string>(data.material);
  const [quantity, setQuantity] = useState<number>(data.quantity);
  const [condition, setCondition] = useState<string>(data.condition);
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

  useEffect(() => {
    if (tellParentImEditing) tellParentImEditing(isEditing);
  }, [isEditing]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  function getLetter(bool: boolean): string {
    if (!bool) return "";
    if (bool && !data.availDuplicates) return "Y";
    if (bool && data.availDuplicates) return "D";
    return "";
  }

  const collectionEditMutation = useMutation({
    mutationFn: (collectionDTO: IColEdits) =>
      axios.post(`http://localhost:3000/userInventory/edit`, collectionDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        setIsEditing(false);
        showToast("Changes saved!", Mode.Success);
        //psuedo pop element
      } else if (e.data.code == 505) {
        showToast("No valid changes were found!", Mode.Warning);
      } else {
        showToast("Error saving changes!", Mode.Error);
        console.log(e.data);
      }
      //   qpartRefetch();
    },
  });

  const collectionDeleteMutation = useMutation({
    mutationFn: (data: iIdOnly) =>
      axios.post(`http://localhost:3000/userInventory/deleteOne`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Item deleted!", Mode.Success);
        //psuedo pop element
      } else {
        showToast("Error deleting item!", Mode.Error);
        console.log(e.data);
      }
      //   qpartRefetch();
    },
  });

  const checkboxStyles: CSSProperties = {
    transform: "scale(1.5)", // Adjust the scale factor as needed
    margin: "auto",
  };
  return (
    <div className={"collection-item " + (PsuedoDelete ? "hidden" : "")}>
      {showDeletePopup && isEditing && (
        <ConfirmPopup
          content="Are you sure you want to remove this item from your collection?"
          delayInSeconds={0.5}
          fn={confirmDelete}
          closePopup={closeDeletePopup}
        />
      )}
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

      <div
        className="col-part-body"
        style={{ width: isEditing ? "28.2em" : "18.2em" }}
      >
        {allowEdit && isEditing ? (
          <>
            <div style={{ width: "7em" }}>
              <select
                className="w-100"
                onChange={(e) => setCondition(e.target.value)}
                value={condition}
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            <div>
              <input
                type="checkbox"
                className="formInput"
                style={checkboxStyles}
                checked={availDuplicates}
                onChange={(e) => {
                  setAvailDuplicates(e.target.checked);
                }}
              ></input>
            </div>
            {prefPayload.differentiateMaterialsInCollection && (
              <div
                style={{ fontSize: "0.9em", overflow: "hidden", width: "7em" }}
              >
                <input
                  className="col-edit"
                  value={material}
                  onChange={(e) => {
                    setMaterial(e.target.value);
                  }}
                ></input>
              </div>
            )}
            <div>
              <input
                type="checkbox"
                className="formInput"
                style={checkboxStyles}
                checked={forSale}
                onChange={(e) => {
                  setForSale(e.target.checked);
                }}
              ></input>
            </div>
            <div>
              <input
                type="checkbox"
                className="formInput"
                style={checkboxStyles}
                checked={forTrade}
                onChange={(e) => {
                  setForTrade(e.target.checked);
                }}
              ></input>
            </div>

            <div>
              <input
                className="col-edit showSpinner"
                value={quantity}
                style={{ width: "100%" }}
                type="number"
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
              ></input>
            </div>
          </>
        ) : (
          <>
            {prefPayload.differentiateMaterialsInCollection && (
              <div
                style={{ fontSize: "0.9em", overflow: "hidden", width: "7em" }}
              >
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
          </>
        )}
        {allowEdit &&
          (isEditing ? (
            <>
              <div className="d-flex flex-col">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="var(--dk-grey)"
                  onClick={saveChanges}
                  className="clickable"
                  style={{ marginBottom: "0.5em" }}
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
                  <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
                </svg>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    onClick={togglePopdown}
                    fill="var(--dk-grey)"
                    className="clickable"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                  </svg>
                  {showPopdown && (
                    <div
                      className="ellipsis-dropdown"
                      style={{ right: "13px", top: "50px" }}
                    >
                      <div className="clickable" onClick={closeEditor}>
                        Cancel
                      </div>
                      <div
                        className="fake-hr"
                        style={{ margin: "0.5em 0" }}
                      ></div>
                      <div
                        className="clickable red-txt"
                        onClick={initiateDeleteItem}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div>
              <svg
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsEditing(true)}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                className="color-fade clickable"
                height="16"
                fill={isHovered ? "var(--dk-grey)" : "var(--lt-grey)"}
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
              </svg>
            </div>
          ))}
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
  function saveChanges() {
    collectionEditMutation.mutate({
      id: data.id,
      forTrade,
      forSale,
      availDuplicates,
      material,
      quantity,
      condition,
    });
  }

  function togglePopdown() {
    setShowPopdown(!showPopdown);
  }
  function initiateDeleteItem() {
    setShowDeletePopup(true);
  }

  function confirmDelete() {
    closeDeletePopup();
    setPsuedoDelete(true);
    collectionDeleteMutation.mutate({ id: data.id });
  }

  function closeEditor() {
    setIsEditing(false);
  }

  function closeDeletePopup() {
    setShowDeletePopup(false);
  }
}
