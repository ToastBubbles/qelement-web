import axios from "axios";
import { useMutation, useQuery } from "react-query";
import {
  IAPIResponse,
  IArrayOfIDs,
  ISculptureDTO,
} from "../../../interfaces/general";
import { Link } from "react-router-dom";
import SculptureInventoryDetails from "../../../components/Approval Componenents/SculptureInventoryDetails";
import { useContext, useState } from "react";
import ConfirmPopup from "../../../components/ConfirmPopup";
import showToast, { Mode } from "../../../utils/utils";
import { AppContext } from "../../../context/context";

interface ISculptureWithArrayOfIdsDTO {
  sculptureId: number;
  qpartIds: number[];
}

interface IArrayOfSculptureInvIds {
  data: ISculptureWithArrayOfIdsDTO[];
}

export default function ApproveSculptureInventoryView() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);
  const { data: sculpData, refetch } = useQuery("notApprovedSculpInv", () =>
    axios.get<ISculptureDTO[]>(
      "http://localhost:3000/sculpture/notApprovedInventory"
    )
  );
  const [idsToApprove, setIdsToApprove] = useState<
    ISculptureWithArrayOfIdsDTO[]
  >([]);
  const [idsToDeny, setIdsToDeny] = useState<ISculptureWithArrayOfIdsDTO[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const sculptureMutation = useMutation({
    mutationFn: (data: IArrayOfSculptureInvIds) =>
      axios
        .post<IAPIResponse>(
          `http://localhost:3000/sculptureInventory/approveInventory`,
          data
        )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetch();
      showToast("Sculpture parts approved!", Mode.Success);
    },
  });
  const sculptureDeleteMutation = useMutation({
    mutationFn: (data: IArrayOfSculptureInvIds) =>
      axios
        .post<IAPIResponse>(
          `http://localhost:3000/sculptureInventory/denyInventory`,

          data
        )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetch();
      showToast("Sculpture parts denied!", Mode.Info);
    },
  });
  if (sculpData) {
    const sculptures = sculpData.data;

    return (
      <>
        <div className="formcontainer">
          {showPopup && (
            <ConfirmPopup
              content={`Are you sure you want to delete the ${
                idsToDeny.length
              } selected part${
                idsToDeny.length > 1 ? "s" : ""
              }? This will only remove the item from the sculpture's inventory, this will not delete the QPart.`}
              fn={denyRequest}
              closePopup={closePopUp}
            />
          )}
          <h1>approve sculpture inventory</h1>
          <Link to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform">
            {sculptures.length > 0 ? (
              sculptures.map((sculpture) => {
                return (
                  <SculptureInventoryDetails
                    key={sculpture.id}
                    sculpture={sculpture}
                    refetchFn={refetch}
                    addFn={addToArray}
                    removeFn={removeFromArray}
                  />
                );
              })
            ) : (
              <div className="text-center my-1">
                nothing to approve right now!
              </div>
            )}
            <div className="d-flex">
              <button
                onClick={() => {
                  if (payload.id) {
                    idsToApprove.length > 0
                      ? sculptureMutation.mutate({
                          data: idsToApprove,
                        })
                      : showToast(
                          "You must select at least one part to approve.",
                          Mode.Warning
                        );
                  }
                }}
              >
                Approve Selected Parts
              </button>
              <div style={{ width: "1em", textAlign: "center" }}>|</div>
              <button
                onClick={() => {
                  idsToDeny.length > 0
                    ? setShowPopup(true)
                    : showToast(
                        "You must select at least one part to deny.",
                        Mode.Warning
                      );
                }}
              >
                Deny Selected Parts
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }

  function addToArray(sculptureId: number, qpartId: number, type: string) {
    if (type === "app") {
      // Check if sculptureId already exists in the state
      const existingIndex = idsToApprove.findIndex(
        (x) => x.sculptureId === sculptureId
      );

      if (existingIndex !== -1) {
        // If sculptureId exists, add qpartId to its array
        setIdsToApprove((data) => {
          const newData = [...data];
          newData[existingIndex].qpartIds.push(qpartId);
          return newData;
        });
      } else {
        // If sculptureId doesn't exist, create a new entry
        setIdsToApprove((data) => [
          ...data,
          {
            sculptureId: sculptureId,
            qpartIds: [qpartId],
          },
        ]);
      }
    } else if (type === "del") {
      // Check if sculptureId already exists in the state
      const existingIndex = idsToDeny.findIndex(
        (x) => x.sculptureId === sculptureId
      );

      if (existingIndex !== -1) {
        // If sculptureId exists, add qpartId to its array
        setIdsToDeny((data) => {
          const newData = [...data];
          newData[existingIndex].qpartIds.push(qpartId);
          return newData;
        });
      } else {
        // If sculptureId doesn't exist, create a new entry
        setIdsToDeny((data) => [
          ...data,
          {
            sculptureId: sculptureId,
            qpartIds: [qpartId],
          },
        ]);
      }
    }
  }

  function removeFromArray(sculptureId: number, qpartId: number, type: string) {
    if (type === "app") {
      setIdsToApprove((data) => {
        const newData = data.map((item) => {
          if (item.sculptureId === sculptureId) {
            // Remove qpartId from the array
            item.qpartIds = item.qpartIds.filter((id) => id !== qpartId);
          }
          return item;
        });

        // Remove entries with no qpartIds
        return newData.filter((item) => item.qpartIds.length > 0);
      });
    } else if (type === "del") {
      setIdsToDeny((data) => {
        const newData = data.map((item) => {
          if (item.sculptureId === sculptureId) {
            // Remove qpartId from the array
            item.qpartIds = item.qpartIds.filter((id) => id !== qpartId);
          }
          return item;
        });

        // Remove entries with no qpartIds
        return newData.filter((item) => item.qpartIds.length > 0);
      });
    }
  }
  function closePopUp() {
    setShowPopup(false);
  }
  function denyRequest() {
    // sculptureDeleteMutation.mutate(sculpture.id);

    if (payload.id)
      sculptureDeleteMutation.mutate({
        data: idsToDeny,
      });

    setShowPopup(false);
  }
}
