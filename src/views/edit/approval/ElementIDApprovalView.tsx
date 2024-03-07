import axios from "axios";
import { useMutation, useQuery } from "react-query";
import {
  IAPIResponse,
  IElementIDWQPart,
  IQPartDTOInclude,
} from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import ConfirmPopup from "../../../components/ConfirmPopup";
import RecentQPart from "../../../components/RecentQPart";
import { AppContext } from "../../../context/context";

export default function ElementIDApprovalView() {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(
    null
  );
  const {
    data: eIDData,
    isFetched,
    refetch,
  } = useQuery("notApprovedEIDs", () =>
    axios.get<IElementIDWQPart[]>("http://localhost:3000/elementID/notApproved")
  );
  const eIDMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/elementID/approve`,
        {
          id,
        },
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
      refetch();
      showToast("Element ID approved!", Mode.Success);
    },
  });

  const eIDDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/elementID/deny`,
        {
          id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: () => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: (e) => {
      if (e.data.code == 200) {
        refetch();
        showToast("Element ID deleted...", Mode.Info);
      } else {
        showToast("Error deleting Element ID", Mode.Error);
      }
    },
  });

  if (isFetched && eIDData) {
    const eIDs = eIDData.data;
    console.log(eIDs);

    return (
      <div className="formcontainer">
        {showPopup && (
          <ConfirmPopup
            content="Are you sure you want to delete this Element ID?"
            closePopup={closePopUp}
            fn={denyRequest}
          />
        )}
        <h1>approve element IDs</h1>
        <Link  className="link" to={"/approve"}>Back to Approval Overview</Link>
        <div className="mainformwide">
          {eIDs.length > 0 ? (
            eIDs.map((eID) => {
              return (
                <div
                  key={eID.id}
                  className="d-flex jc-space-b w-100 p-1 alternating-children"
                >
                  <div className="eid-row">
                    <div>
                      <div className="rib-container">
                        <RecentQPart
                          qpart={eID.qpart}
                          hideDate={true}
                          disableLinks={true}
                        />
                      </div>
                      <div>
                        <div>
                          <span className="lt-black">
                            Requestor: {eID.creator.name} ({eID.creator.email})
                          </span>
                        </div>
                        <div>
                          <span className="lt-black">Existing eIDS:</span>{" "}
                          {showExistingEIDs(eID.qpart)}
                        </div>
                      </div>
                    </div>
                    <div className="center-item">{eID.number}</div>
                    <div>
                      <button onClick={() => eIDMutation.mutate(eID.id)}>
                        Approve
                      </button>
                      <div className="button-spacer">|</div>
                      <button onClick={() => handleDeny(eID.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-1">nothing to approve right now!</div>
          )}
        </div>
      </div>
    );
    function showExistingEIDs(qpart: IQPartDTOInclude): string {
      let output = "";

      if (qpart.elementIDs.length > 0) {
        qpart.elementIDs.forEach((eid) => {
          if (output.length > 0) output += " - ";

          output += eid.number;
        });
      } else {
        return "none";
      }

      return output;
    }
    function handleDeny(id: number) {
      setSelectedElementId(id);
      setShowPopup(true);
    }
    function closePopUp() {
      setSelectedElementId(null);
      setShowPopup(false);
    }
    function denyRequest() {
      if (selectedElementId) eIDDeleteMutation.mutate(selectedElementId);
      setShowPopup(false);
    }
  } else {
    return <p>Loading...</p>;
  }
}
