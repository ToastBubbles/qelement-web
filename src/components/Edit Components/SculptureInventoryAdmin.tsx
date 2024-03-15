import { Link } from "react-router-dom";
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  IQPartWSculptureInventory,
  ISculpturePartIdPair,
  iIdOnly,
} from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { useMutation } from "react-query";
import axios from "axios";
import showToast, { Mode, imagePath } from "../../utils/utils";
import RecentQPart from "../RecentQPart";
import GenericPopup from "../GenericPopup";

interface IProps {
  qpart: IQPartWSculptureInventory;
  sculptureId: number;
  refetchFn: () => void;
}

export default function SculptureInventoryAdmin({
  qpart,
  sculptureId,
  refetchFn,
}: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const [isHovered, setHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  //   const [content, setContent] = useState<ReactNode>(<></>);
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const inventoryDeletionMutation = useMutation({
    mutationFn: (data: ISculpturePartIdPair) =>
      axios.post(`http://localhost:3000/sculptureInventory/denyOne`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Part in Sculpture Inventory Removed!", Mode.Success);
        refetchFn();
        closePopUp();
      } else {
        showToast(`Error ${e.data.code}`, Mode.Error);
      }
    },
  });
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="rib-container3"
    >
      {showPopup && (
        <GenericPopup
          content={
            <div>
              <div style={{ marginBottom: "2em" }}>
                Are you sure you wish to remove this part from this sculpture's
                inventory?
              </div>
              <button onClick={() => deleteInventoryItem()}>Delete</button>
            </div>
          }
          closePopup={closePopUp}
        />
      )}
      {isHovered && (
        <div className="trash-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className="clickable"
            name="delete-icon"
            fill="var(--lt-red)"
            onClick={() => {
              setShowPopup(true);
            }}
            viewBox="0 0 16 16"
          >
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg>
        </div>
      )}
      <RecentQPart
        key={qpart.id}
        qpart={qpart}
        hideDate={true}
        disableLinks={true}
        hideRibbon={true}
      />
    </div>
  );

  function deleteInventoryItem() {
    inventoryDeletionMutation.mutate({ qpartId: qpart.id, sculptureId });
  }

  function closePopUp() {
    setShowPopup(false);
  }
}
