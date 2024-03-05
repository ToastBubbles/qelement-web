import axios from "axios";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import {
  IPartStatusDTO,
  IPartStatusWQPart,
  IQPartDTOInclude,
} from "../../interfaces/general";
import showToast, { Mode, formatDate, sortStatus } from "../../utils/utils";
import { ReactNode, useContext, useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import RecentQPart from "../RecentQPart";
import { AppContext } from "../../context/context";
import GenericPopup from "../GenericPopup";

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
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
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
    let approvedStatuses = status.qpart.partStatuses.filter(
      (s) => s.approvalDate != null
    );
    console.log("unfiltered:", status.qpart.partStatuses);

    console.log("filtered", approvedStatuses);

    let currentStatus =
      approvedStatuses.length > 0 ? approvedStatuses[0].status : "none";
    // console.log(qpart.partStatuses);
    console.log(status);

    return (
      <div className="coldeet">
        {showPopup && (
          <ConfirmPopup
            content="Are you sure you want to delete this Status?"
            fn={denyRequest}
            closePopup={closePopUp}
          />
        )}
        {showStatusPopup && (
          <GenericPopup
            content={makeStatusPopupContent(status.qpart.partStatuses)}
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
            {status.creator.name} ({status.creator.email})
          </div>
        </div>
        <div>
          <div>Location:</div>
          <div>
            {status.location ? (
              status.location
            ) : (
              <span className="grey-txt">None</span>
            )}
          </div>
        </div>
        <div>
          <div>Status Date:</div>
          <div>{status.date}</div>
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
          <div>
            <div className="fg-1">
              <button onClick={() => setShowStatusPopup(true)}>Statuses</button>
            </div>
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

  function makeStatusPopupContent(statuses: IPartStatusDTO[]): ReactNode {
    let sortedStatus = sortStatus(statuses, true, true);
    return (
      <>
        {sortedStatus.map((s) => (
          <div className="d-flex">
            <div className="w-33">{s.id == status.id ? "This status -->" : ""}</div>
            <div
              className={`w-33 status-tag tag-${s.status} ${
                s.approvalDate == null ? "tag-notApproved" : ""
              }`}
            >
              {s.status.toUpperCase()}
            </div>
            <div className="w-33">{formatDate(s.date)}</div>
          </div>
        ))}
      </>
    );
  }
  function closePopUp() {
    setShowPopup(false);
    setShowStatusPopup(false);
  }
  function denyRequest() {
    statusDeletionMutation.mutate(status.id);
    setShowPopup(false);
  }
}
