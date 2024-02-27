import {
  ISimilarColorDetailedWithInversionId,
  iIdOnly,
} from "../../interfaces/general";
import axios from "axios";
import { useMutation } from "react-query";
import showToast, { Mode } from "../../utils/utils";
import { useContext, useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import ColorLink from "../ColorLink";
import { AppContext } from "../../context/context";

interface IProps {
  data: ISimilarColorDetailedWithInversionId;
  refetchFn: () => void;
}
interface ISimColorIdWithInversionId {
  id: number;
  inversionId: number;
}
export default function SimilarColorDetails({ data, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const simColMutation = useMutation({
    mutationFn: (id: iIdOnly) =>
      axios.post<number>(`http://localhost:3000/similarColor/approve`, id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onError: () => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: () => {
      refetchFn();
      showToast("Similar Color approved!", Mode.Success);
    },
  });

  const simColDeletionMutation = useMutation({
    mutationFn: (id: iIdOnly) =>
      axios.post<number>(`http://localhost:3000/similarColor/deny`, id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onError: () => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: () => {
      refetchFn();
      showToast("Similar Color denied.", Mode.Info);
    },
  });

  return (
    <div className="coldeet">
      {showPopup && (
        <ConfirmPopup
          content="Are you sure you want to delete this similar color relationship?"
          closePopup={closePopUp}
          fn={denyRequest}
        />
      )}
      <div style={{ justifyContent: "center" }}>
        <div style={{ flex: "1" }}>
          <ColorLink color={data.color1} centerText={true} />
        </div>
        <div className="d-flex ai-center" style={{ padding: "0 1em" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"
            />
          </svg>
        </div>
        <div style={{ flex: "1" }}>
          <ColorLink color={data.color2} centerText={true} />
        </div>
      </div>
      <div>
        <div>Requestor:</div>
        <div>
          {data.creator.name} ({data.creator.email})
        </div>
      </div>
      <div style={{ justifyContent: "end", paddingTop: "1em" }}>
        <button
          onClick={() =>
            simColMutation.mutate({
              id: data.id,
            })
          }
        >
          Approve
        </button>{" "}
        <div style={{ width: "1em", textAlign: "center" }}>|</div>
        <button onClick={() => setShowPopup(true)}>Deny</button>
      </div>
    </div>
  );

  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    simColDeletionMutation.mutate({
      id: data.id,
    });
  }
}
