import axios from "axios";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { IPartStatusWQPart, IQPartDTOInclude } from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import { useContext, useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import RecentQPart from "../RecentQPart";
import { AppContext } from "../../context/context";

interface IProps {
  status: IPartStatusWQPart;
  refetchFn: () => void;
}

export default function PartStatusDetails({ status, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const statusMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<number>(
        `http://localhost:3000/partStatus/approve`,
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
      showToast("Status approved!", Mode.Success);
    },
  });
  const statusDeletionMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<number>(
        `http://localhost:3000/partStatus/deny`,
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
      showToast("Status denied!", Mode.Info);
    },
  });

  if (status) {
    let qpart = status.qpart;
    let currentStatus =
      status.qpart.partStatuses.length > 0
        ? status.qpart.partStatuses[0].status
        : "none";
    // console.log(qpart.partStatuses);

    return (
      <div className="coldeet">
        {showPopup && (
          <ConfirmPopup
            content="Are you sure you want to delete this Status?"
            fn={denyRequest}
            closePopup={closePopUp}
          />
        )}
        <div className="d-flex flex-col">
          <div>Q-Element:</div>
          <RecentQPart qpart={status.qpart} hideDate={true} />
        </div>
        <div className="status-compare">
          <div className="d-flex flex-col ai-center">
            <div>Current</div>
            {/* <div className={"status-tag tag-" + classType}>
              {status.toUpperCase()}
            </div> */}
            <div className={"status-tag tag-" + currentStatus}>
              {currentStatus.toUpperCase()}
            </div>
          </div>
          <div className="d-flex ai-center">{"-->>"}</div>
          <div className="d-flex flex-col ai-center">
            <div>This Status</div>
            <div className={"status-tag tag-" + status.status}>
              {status.status.toUpperCase()}
            </div>
          </div>
        </div>

        <div>
          <div>Requestor:</div>
          <div>
            {qpart.creator.name} ({qpart.creator.email})
          </div>
        </div>

        <section>
          Note:
          <div className="wrapbreak">{status.note}</div>
        </section>
        {qpart.approvalDate == null ? (
          <div style={{ color: "red", float: "right" }}>
            Please approve QPart first!
          </div>
        ) : (
          <div style={{ justifyContent: "end" }}>
            <button onClick={() => statusMutation.mutate(status.id)}>
              Approve
            </button>
            <div style={{ width: "1em", textAlign: "center" }}>|</div>
            <button onClick={() => setShowPopup(true)}>Deny</button>
          </div>
        )}
      </div>
    );
  } else return <p>Loading</p>;
  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    statusDeletionMutation.mutate(status.id);
    setShowPopup(false);
  }
}
