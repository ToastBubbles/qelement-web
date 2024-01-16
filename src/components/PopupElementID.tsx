import axios from "axios";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { AppContext } from "../context/context";
import {
  IAPIResponse,
  IElementIDCreationDTO,
  IQPartDTOInclude,
} from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";

interface IProps {
  qpart: IQPartDTOInclude;
  closePopup: () => void;
  refetchFn: () => void;
}

export default function PopupElementID({
  qpart,
  closePopup,
  refetchFn,
}: IProps) {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);

  const [elementId, setElementId] = useState<number>(-1);

  const elementIDMutation = useMutation({
    mutationFn: (eIdData: IElementIDCreationDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/elementID/add`, eIdData),
    onSuccess: (resp) => {
      console.log(resp.data);

      if (resp.data.code == 201 || resp.data.code == 206) {
        showToast("Element ID added!", Mode.Success);
        setElementId(-1);
        refetchFn();
        closePopup();
      } else if (resp.data.code == 200 || resp.data.code == 205) {
        showToast("Element ID submitted for approval!", Mode.Success);
        setElementId(-1);
        refetchFn();
      } else
        showToast(
          "Failed to add element ID, it may be in use by another part or pending approval.",
          Mode.Error
        );
    },
  });

  return (
    <div className="popup-container">
      <div className="popup-body">
        <button className="popup-close" onClick={closePopup}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
        <h1 style={{ marginBottom: "0.5em" }}>Add Element ID:</h1>
        <h3 style={{ marginBottom: "1.5em" }}>
          {qpart.color.bl_name ? qpart.color.bl_name : qpart.color.tlg_name}{" "}
          {qpart.mold.parentPart.name} ({qpart.mold.number})
        </h3>
        <div className="w-100 d-flex jc-space-b my-1 ">
          <label htmlFor="eid">Element ID:</label>
          <input
            style={{ width: "6em", marginBottom: "2em" }}
            type="number"
            placeholder="1234567"
            value={elementId <= 0 ? "" : elementId}
            onChange={(e) => setElementId(Number(e.target.value))}
          ></input>
        </div>
        <button
          className="formInputNM"
          onClick={() => {
            if (payload.id && elementId > 999 && elementId < 99999999) {
              elementIDMutation.mutate({
                number: elementId,
                creatorId: payload.id,
                qpartId: qpart.id,
              });
            } else {
              showToast(
                `Error, Element ID may be too big or small.`,
                Mode.Error
              );
            }
          }}
        >
          Submit Element ID
        </button>
      </div>
    </div>
  );
}
