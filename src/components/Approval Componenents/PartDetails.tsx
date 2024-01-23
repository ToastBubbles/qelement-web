import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { IAPIResponse, IPartDTO } from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import { useContext, useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import { AppContext } from "../../context/context";

interface IProps {
  part: IPartDTO;
  refetchFn: () => void;
}

export default function PartDetails({ part, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const partMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/parts/approve`,
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
      showToast("Part approved!", Mode.Success);
    },
  });

  const partDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/parts/deny`,
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
      showToast("Part deleted!", Mode.Info);
    },
  });

  return (
    <div className="coldeet">
      {showPopup && (
        <ConfirmPopup
          content="Are you sure you want to delete this part? All child part molds will also be deleted!"
          fn={denyRequest}
          closePopup={closePopUp}
        />
      )}
      <div>
        <div>Name:</div>
        <div>{part.name}</div>
      </div>
      <div>
        <div>Category:</div>
        <div>{part.Category.name}</div>
      </div>

      <section>
        Note:
        <div className="wrapbreak">{part.note}</div>
      </section>
      <div style={{ justifyContent: "end" }}>
        <button onClick={() => partMutation.mutate(part.id)}>Approve</button>
        <div style={{ width: "1em", textAlign: "center" }}>|</div>
        <button onClick={() => setShowPopup(true)}>Deny</button>
      </div>
    </div>
  );

  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    partDeleteMutation.mutate(part.id);
    setShowPopup(false);
  }
}
