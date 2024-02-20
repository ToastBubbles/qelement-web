import { ReactNode, useState } from "react";
import {
  IQPartDTOInclude,
} from "../interfaces/general";
import GenericPopup from "./GenericPopup";
import ElementIDEdit from "./Edit Components/ElementIDEdit";

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
        <div>Element IDs:</div>
        <div className="d-flex flex-col">
          {part.elementIDs
            ? part.elementIDs.map((eId) => (
                <div
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
    </>
  );

  function closePopUp() {
    setPopupOpen(false);
  }
}
