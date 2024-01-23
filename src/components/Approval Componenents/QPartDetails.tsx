import axios from "axios";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { IQPartDTOInclude } from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import { useContext, useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import { AppContext } from "../../context/context";

interface IProps {
  qpart: IQPartDTOInclude;
  refetchFn: () => void;
}

export default function QPartDetails({ qpart, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const qpartMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<number>(
        `http://localhost:3000/qpart/approve`,
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
      showToast("Qelement approved!", Mode.Success);
    },
  });
  const qpartDeletionMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<number>(
        `http://localhost:3000/qpart/deny`,
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
      showToast("Qelement denied!", Mode.Info);
    },
  });

  if (qpart) {
    return (
      <div className="coldeet">
        {showPopup && (
          <ConfirmPopup
            content="Are you sure you want to delete this Q-Element?"
            fn={denyRequest}
            closePopup={closePopUp}
          />
        )}
        <div>
          <div>Part:</div>
          <Link to={`/part/${qpart.mold.parentPart.id}`}>
            {qpart.mold.parentPart.name} ({qpart.mold.number})
          </Link>
        </div>
        <div>
          <div>Color:</div>
          <Link to={`/color/${qpart.color.id}`}>
            {qpart.color?.bl_name ? qpart.color.bl_name : qpart.color?.tlg_name}
          </Link>
        </div>
        <div>
          <div>Type:</div>
          <div>{qpart.type}</div>
        </div>
        {/* <div>
          <div>Element ID:</div>
          <div>{qpart.elementId}</div>
        </div> */}

        <div>
          <div>Requestor:</div>
          <div>
            {qpart.creator.name} ({qpart.creator.email})
          </div>
        </div>

        <section>
          Note:
          <div className="wrapbreak">{qpart.note}</div>
        </section>
        <div style={{ justifyContent: "end" }}>
          <button onClick={() => qpartMutation.mutate(qpart.id)}>
            Approve
          </button>
          <div style={{ width: "1em", textAlign: "center" }}>|</div>
          <button onClick={() => setShowPopup(true)}>Deny</button>
        </div>
      </div>
    );
  } else return <p>Loading</p>;
  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    qpartDeletionMutation.mutate(qpart.id);
    setShowPopup(false);
  }
}
