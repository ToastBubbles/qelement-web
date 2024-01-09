import { IColorWCreator, color } from "../interfaces/general";
import axios from "axios";
import { useMutation } from "react-query";
import showToast, { Mode } from "../utils/utils";
import { useState } from "react";
import ConfirmPopup from "./ConfirmPopup";

interface IProps {
  color: IColorWCreator;
  refetchFn: () => void;
}

export default function ColorDetails({ color, refetchFn }: IProps) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const colMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/color/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Color approved!", Mode.Success);
    },
  });

  const colDeletionMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/color/deny`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Color soft deleted", Mode.Info);
    },
  });

  return (
    <div className="coldeet">
      {showPopup && (
        <ConfirmPopup
          content="Are you sure you want to delete this color?"
          closePopup={closePopUp}
          fn={denyRequest}
        />
      )}
      <div>
        <div>BL:</div>
        <div>
          {color.bl_name} ({color.bl_id})
        </div>
      </div>
      <div>
        <div>TLG:</div>
        <div>
          {color.tlg_name} ({color.tlg_id})
        </div>
      </div>
      <div>
        <div>BO:</div>
        <div>
          {color.bo_name} ({color.bo_id})
        </div>
      </div>
      <div>
        <div>HEX:</div>
        <div>
          {" "}
          #{color.hex.toUpperCase()}
          <div
            className={"listing-color-swatch " + color.type}
            style={{ backgroundColor: `#${color.hex}` }}
          ></div>
        </div>
      </div>
      <div>
        <div>Type:</div>
        <div> {color.type}</div>
      </div>
      <div>
        <div>Requestor:</div>
        <div>
          {color.creator.name} ({color.creator.email})
        </div>
      </div>
      <section>
        Note:
        <div className="wrapbreak">{color.note}</div>
      </section>
      <button onClick={() => setShowPopup(true)}>Deny</button>
      <button onClick={() => colMutation.mutate(color.id)}>Approve</button>
    </div>
  );

  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    colDeletionMutation.mutate(color.id);
  }
}
