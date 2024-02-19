import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { IElementID, IIdAndNumber, iIdOnly } from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { useMutation } from "react-query";
import axios from "axios";
import showToast, { Mode } from "../../utils/utils";

interface IProps {
  eID: IElementID;
  closePopup: () => void;
  refetchFn: () => void;
}

export default function ElementIDEdit({ eID, closePopup, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const defaultElementIDValues: IIdAndNumber = { id: -1, number: -1 };

  const [readyToDelete, setReadyToDelete] = useState<boolean>(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] =
    useState<boolean>(false);

  const [newElementID, setNewElementID] = useState<IIdAndNumber>(
    defaultElementIDValues
  );
  const eIDMutation = useMutation({
    mutationFn: ({ id, number }: IIdAndNumber) =>
      axios.post(
        `http://localhost:3000/elementID/edit`,
        {
          id,
          number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Element ID changed!", Mode.Success);
        setNewElementID(defaultElementIDValues);
        refetchFn();
        closePopup();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  const eIDDeletionMutation = useMutation({
    mutationFn: ({ id }: iIdOnly) =>
      axios.post(
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
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Element ID Deleted!", Mode.Success);
        setNewElementID(defaultElementIDValues);
        refetchFn();
        closePopup();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  useEffect(() => {
    setNewElementID((newElementID) => ({
      ...newElementID,
      ...{ id: eID.id },
    }));
  }, [eID]);

  return (
    <div>
      <div style={{ padding: "0 5em 3em 5em" }}>
        <div className="d-flex">
          <div className="w-33">Original eID</div>
          <div className="w-33"></div>
          <div className="w-33">New eID</div>
        </div>
        <div className="d-flex">
          <div className="w-33">{eID.number}</div>
          <div className="w-33">{"-->"}</div>
          <div className="w-33">
            {newElementID.number > 0 ? newElementID.number : "none"}
          </div>
        </div>
      </div>
      <div>
        <input
          maxLength={10}
          type="number"
          value={
            newElementID.number == -1 || newElementID.number == 0
              ? ""
              : newElementID.number
          }
          className="formInput w-50"
          placeholder="New Element ID"
          onChange={(e) =>
            setNewElementID((newElementID) => ({
              ...newElementID,
              ...{ number: Number(e.target.value) },
            }))
          }
        />

        <button
          disabled={newElementID.number < 1}
          onClick={() => {
            submitElementID();
          }}
        >
          Submit
        </button>
      </div>
      <div className="fake-hr"></div>
      <div className={readyToDelete ? "hidden" : ""}>
        <div style={{ padding: "2em 0" }}>Delete this Element ID</div>
        <button
          onClick={() => {
            setReadyToDelete(true);
            setDeleteButtonDisabled(true);
            setTimeout(() => {
              setDeleteButtonDisabled(false);
            }, 1500);
          }}
        >
          Delete...
        </button>
      </div>

      <div className={readyToDelete ? "" : "hidden"}>
        <div style={{ padding: "2em 0" }}>Are you sure?</div>
        <button
          disabled={deleteButtonDisabled}
          onClick={() => {
            eIDDeletionMutation.mutate({ id: eID.id });
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  function submitElementID() {
    if (
      newElementID.id > 0 &&
      newElementID.number &&
      newElementID.number > 999 &&
      newElementID.number < 999999999
    ) {
      eIDMutation.mutate(newElementID);
    }
  }
}
