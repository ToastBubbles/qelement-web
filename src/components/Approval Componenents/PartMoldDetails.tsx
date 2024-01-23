import axios from "axios";
import { useMutation } from "react-query";
import { IPartMoldDTO } from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import { useContext, useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import { AppContext } from "../../context/context";

interface IProps {
  mold: IPartMoldDTO;
  refetchFn: () => void;
}

export default function PartMoldDetails({ mold, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const partMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<number>(
        `http://localhost:3000/partMold/approve`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: () => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: () => {
      refetchFn();
      showToast("Part Mold approved!", Mode.Success);
    },
  });
  const partDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<number>(
        `http://localhost:3000/partMold/deny`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: () => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: () => {
      refetchFn();
      showToast("Part Mold deleted!", Mode.Info);
    },
  });

  return (
    <div className="coldeet">
      {showPopup && (
        <ConfirmPopup
          content="Are you sure you want to delete this Part Mold? Parent part will remain unaffected."
          fn={denyRequest}
          closePopup={closePopUp}
        />
      )}
      <div>
        <div>For:</div>
        <div>{mold.parentPart.name}</div>
      </div>
      <div>
        <div>Number:</div>
        <div>{mold.number}</div>
      </div>

      <section>
        Note:
        <div className="wrapbreak">{mold.note}</div>
      </section>
      {mold.parentPart.approvalDate == null ? (
        <div style={{ color: "red", float: "right" }}>
          Please approve parent part first
        </div>
      ) : (
        <div style={{ justifyContent: "end" }}>
          <button onClick={() => partMutation.mutate(mold.id)}>Approve</button>
          <div style={{ width: "1em", textAlign: "center" }}>|</div>
          <button onClick={() => setShowPopup(true)}>Deny</button>
        </div>
      )}
    </div>
  );
  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    partDeleteMutation.mutate(mold.id);
    setShowPopup(false);
  }
}
