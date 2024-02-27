import { ReactNode, useState } from "react";
import { IQPartDTOInclude, ISculptureDTO } from "../interfaces/general";
import GenericPopup from "./GenericPopup";
import ElementIDEdit from "./Edit Components/ElementIDEdit";
import { imagePath } from "../utils/utils";
import ImageEdit from "./Edit Components/ImageEdit";
import RecentQPart from "./RecentQPart";
import SculptureInventoryAdmin from "./Edit Components/SculptureInventoryAdmin";

interface IProps {
  sculpture: ISculptureDTO;
  refetchFn: () => void;
}

export default function AdminTabSculpture({ sculpture, refetchFn }: IProps) {
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
        <div>Element IDs:</div>
      </div>
      <div>Note:</div>

      <div>Images</div>
      <div className="admin-image-container">
        {sculpture.images.map((image) => {
          return (
            <div
              key={image.id}
              className={"admin-image-card clickable"}
              onClick={() => {
                setPopupContent(
                  <ImageEdit
                    image={image}
                    disableTypeMutation={true}
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
      <div className="d-flex w-100 flex-col">
        <div>Parts</div>
        <div className="rib-container">
          {sculpture.inventory.map((qpart) => (
            <SculptureInventoryAdmin
              qpart={qpart}
              sculptureId={sculpture.id}
              key={qpart.id}
              refetchFn={refetchFn}
            />
          ))}
        </div>
      </div>
    </>
  );

  function closePopUp() {
    setPopupOpen(false);
  }
}
