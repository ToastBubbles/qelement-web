import { ReactNode, useState } from "react";
import { IQPartDTOInclude } from "../interfaces/general";
import GenericPopup from "./GenericPopup";
import ElementIDEdit from "./Edit Components/ElementIDEdit";
import { imagePath } from "../utils/utils";
import ImageEdit from "./Edit Components/ImageEdit";
import { Link } from "react-router-dom";

interface IProps {
  part: IQPartDTOInclude;
  refetchFn: () => void;
}

export default function AdminTabPart({ part, refetchFn }: IProps) {
  //   const {
  //     state: {
  //       jwt: { token, payload },
  //       userPreferences: { payload: prefPayload },
  //     },
  //   } = useContext(AppContext);

  const [popupContent, setPopupContent] = useState<ReactNode>();

  const [popupOpen, setPopupOpen] = useState<boolean>();

  return (
    <>
      {popupOpen && (
        <GenericPopup content={popupContent} closePopup={closePopUp} />
      )}
      <div>
        <div>QPart:</div>
        <div>
          <Link className="black-txt" to={`/edit/qpart/${part.id}`}>
            Edit this QPart
          </Link>
        </div>
      </div>
      <div>
        <div>Element IDs:</div>
        <div className="d-flex flex-col">
          {part.elementIDs
            ? part.elementIDs.map((eId) => (
                <div
                  key={eId.id}
                  className="clickable"
                  onClick={() => {
                    setPopupContent(
                      <ElementIDEdit
                        eID={eId}
                        closePopup={closePopUp}
                        refetchFn={refetchFn}
                      />
                    );

                    setPopupOpen(true);
                  }}
                >
                  {eId.number}
                </div>
              ))
            : "No IDs found"}
        </div>
      </div>
      <div>Note:</div>
      <div>{part.note ? part.note : "No note"}</div>

      <div>
        <div>Part:</div>
        <Link
          className="black-txt"
          to={`/edit/part/${part.mold.parentPart.id}`}
        >
          {part.mold.parentPart.name}
        </Link>
      </div>
      <div>
        <div>Mold:</div>
        {part.isMoldUnknown ? (
          <div>Mold marked as Unknown</div>
        ) : (
          <Link className="black-txt" to={`/edit/mold/${part.mold.id}`}>
            {part.mold.number}
          </Link>
        )}
      </div>
      <div>Images</div>
      <div className="admin-image-container">
        {part.images.map((image) => {
          return (
            <div
              key={image.id}
              className={"admin-image-card clickable"}
              onClick={() => {
                setPopupContent(
                  <ImageEdit
                    image={image}
                    closePopup={closePopUp}
                    refetchFn={refetchFn}
                  />
                );
                setPopupOpen(true);
              }}
            >
              <div
                className={image.approvalDate == null ? " not-approved" : ""}
              >
                <div className="admin-image-div">
                  <img src={imagePath + image.fileName} alt="brick" />
                </div>
                <div className="d-flex flex-col ai-start">
                  <div className={"status-tag img-" + image.type}>
                    {image.type}
                  </div>

                  <div>
                    {image.isPrimary && (
                      <div className="primary-image-tag status-tag">
                        Primary
                      </div>
                    )}
                    {image.approvalDate == null && (
                      <div style={{ fontSize: "0.55em" }}>Not Approved</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  function closePopUp() {
    setPopupOpen(false);
  }
}
