import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import {
  IElementID,
  IIdAndNumber,
  ISculptureDTO,
  ISculptureEdits,
  iIdOnly,
} from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { useMutation } from "react-query";
import axios from "axios";
import showToast, { Mode } from "../../utils/utils";

interface IProps {
  sculpture: ISculptureDTO;
  closePopup: () => void;
  refetchFn: () => void;
}

export default function SculptureEdit({
  sculpture,
  closePopup,
  refetchFn,
}: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const defaultSculptureValues: ISculptureEdits = {
    id: -1,
    name: "",
    brickSystem: "",
    yearMade: -1,
    yearRetired: -1,
    location: "",
    note: "",
  };
  const navigate = useNavigate();
  const [readyToDelete, setReadyToDelete] = useState<boolean>(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] =
    useState<boolean>(false);

  const [newSculptureValues, setNewSculptureValues] = useState<ISculptureEdits>(
    defaultSculptureValues
  );
  const sculptureMutation = useMutation({
    mutationFn: (data: ISculptureEdits) =>
      axios.post(`http://localhost:3000/sculpture/edit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Sculpture changes saved!", Mode.Success);
        setNewSculptureValues(defaultSculptureValues);
        refetchFn();
        closePopup();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  const sculptureDeletionMutation = useMutation({
    mutationFn: ({ id }: iIdOnly) =>
      axios.post(
        `http://localhost:3000/sculpture/deny`,
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
        showToast("Sculpture Deleted!", Mode.Success);
        setNewSculptureValues(defaultSculptureValues);

        closePopup();
        navigate("/sculpture/all");
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  useEffect(() => {
    setNewSculptureValues((newSculpture) => ({
      ...newSculpture,
      ...{ id: sculpture.id },
    }));
  }, [sculpture]);

  return (
    <div style={{ padding: "0 4em" }}>
      <div className="info-box w-100">
        <h3>Original Values</h3>
        <div className="d-flex jc-space-b">
          <div>Name:</div> <div>{sculpture.name}</div>
        </div>
        <div className="d-flex jc-space-b">
          <div>Brick System:</div>
          <div>{sculpture.brickSystem}</div>
        </div>
        <div className="d-flex jc-space-b">
          <div>Location:</div>
          <div>
            {sculpture.location ? (
              sculpture.location
            ) : (
              <span className="grey-txt">None</span>
            )}
          </div>
        </div>
        <div className="d-flex jc-space-b">
          <div>Years:</div>
          <div>
            {sculpture.yearMade ? (
              sculpture.yearMade
            ) : (
              <span className="grey-txt">--</span>
            )}{" "}
            -{" "}
            {sculpture.yearRetired ? (
              sculpture.yearRetired
            ) : (
              <span className="grey-txt">--</span>
            )}
          </div>
        </div>

        <div className="d-flex jc-space-b">
          <div>Note:</div>{" "}
          <div>
            {sculpture.note ? (
              sculpture.note
            ) : (
              <span className="grey-txt">None</span>
            )}
          </div>
        </div>
      </div>

      <div className="w-100" style={{ marginTop: "2em" }}>
        <div className="d-flex jc-space-b">
          <label htmlFor="name">Change Name:</label>
          <input
            name="name"
            className="formInput w-33"
            placeholder={sculpture.name}
            onChange={(e) =>
              setNewSculptureValues((newSculptureValues) => ({
                ...newSculptureValues,
                ...{ name: e.target.value },
              }))
            }
            value={newSculptureValues.name}
          />
        </div>
        <div className="d-flex jc-space-b">
          <label htmlFor="brick-system">Change Brick System:</label>
          <select
            name="brick-system"
            value={newSculptureValues.brickSystem}
            className={"formInput w-33"}
            onChange={(e) =>
              setNewSculptureValues((newSculptureValues) => ({
                ...newSculptureValues,
                ...{ brickSystem: e.target.value },
              }))
            }
          >
            <option value={-1} className="grey-txt">
              - Unchanged -
            </option>
            <option value={"system"}>System</option>
            <option value={"duplo"}>DUPLO</option>
            <option value={"technic"}>Technic</option>
            <option value={"hybrid"}>Hybrid</option>
            <option value={"other"}>Other</option>
          </select>
        </div>
        <div className="d-flex jc-space-b">
          <label htmlFor="location">Change Location:</label>
          <input
            name="location"
            className="formInput w-33"
            placeholder={sculpture.location ? sculpture.location : "Optional"}
            onChange={(e) =>
              setNewSculptureValues((newSculptureValues) => ({
                ...newSculptureValues,
                ...{ location: e.target.value },
              }))
            }
            value={newSculptureValues.location}
          />
        </div>

        <div className="d-flex jc-space-b">
          <label htmlFor="yearMade">Change Year Made:</label>
          <input
            maxLength={4}
            pattern="[0-9]"
            className="formInput w-33"
            type="text"
            name="yearMade"
            placeholder={
              sculpture.yearMade ? sculpture.yearMade.toString() : "Optional"
            }
            onKeyDown={(e) => {
              // Get the pressed key
              const key = e.key;
              // Allow non-character keys like backspace and arrow keys
              if (e.code.includes("Arrow") || key === "Backspace") {
                return;
              }
              // Regular expression pattern to match hexadecimal characters
              const yearPattern = /^[0-9]$/;
              // Check if the pressed key is a valid hexadecimal character
              if (!yearPattern.test(key)) {
                e.preventDefault(); // Prevent the character from being entered
              }
            }}
            onChange={(e) =>
              setNewSculptureValues((newSculptureValues) => ({
                ...newSculptureValues,
                ...{ yearMade: Number(e.target.value) },
              }))
            }
            value={
              newSculptureValues.yearMade <= 0
                ? ""
                : newSculptureValues.yearMade
            }
          />
        </div>
        <div className="d-flex jc-space-b">
          <label htmlFor="yearRetired">Change Year Retired:</label>
          <input
            maxLength={4}
            pattern="[0-9]"
            className="formInput w-33"
            type="text"
            name="yearRetired"
            placeholder={
              sculpture.yearRetired
                ? sculpture.yearRetired.toString()
                : "Optional"
            }
            onKeyDown={(e) => {
              // Get the pressed key
              const key = e.key;
              // Allow non-character keys like backspace and arrow keys
              if (e.code.includes("Arrow") || key === "Backspace") {
                return;
              }
              // Regular expression pattern to match hexadecimal characters
              const yearPattern = /^[0-9]$/;
              // Check if the pressed key is a valid hexadecimal character
              if (!yearPattern.test(key)) {
                e.preventDefault(); // Prevent the character from being entered
              }
            }}
            onChange={(e) =>
              setNewSculptureValues((newSculptureValues) => ({
                ...newSculptureValues,
                ...{ yearRetired: Number(e.target.value) },
              }))
            }
            value={
              newSculptureValues.yearRetired <= 0
                ? ""
                : newSculptureValues.yearRetired
            }
          />
        </div>
        <div className="d-flex jc-start w-100">
          <label htmlFor="note">Change Note:</label>
        </div>
        <div className="w-100">
          <textarea
            maxLength={255}
            id="satusnote"
            name="note"
            className="w-100 formInput"
            rows={5}
            placeholder={sculpture.note ? sculpture.note : "Optional"}
            onChange={(e) =>
              setNewSculptureValues((newSculptureValues) => ({
                ...newSculptureValues,
                ...{ note: e.target.value },
              }))
            }
            value={newSculptureValues.note}
          />
        </div>
        <div className="d-flex w-100 jc-center">
          <button onClick={submitSculptureEdits}>Submit Changes</button>
        </div>
      </div>

      <div className="fake-hr"></div>
      <div className={readyToDelete ? "hidden" : ""}>
        <div style={{ padding: "2em 0" }}>Delete this Sculpture</div>
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
            sculptureDeletionMutation.mutate({ id: sculpture.id });
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  function submitSculptureEdits() {
    if (validateSculptureEdits()) {
      sculptureMutation.mutate(newSculptureValues);
    }
  }

  function validateSculptureEdits(): boolean {
    let isGood = true;
    let hasChanges = false;

    if (newSculptureValues.id <= 0) {
      showToast("Error getting sculpture ID!", Mode.Error);
      return false;
    }
    if (
      newSculptureValues.name.length != 0 &&
      newSculptureValues.name.length <= 2
    ) {
      isGood = false;
      showToast("Name is too short.", Mode.Error);
    } else if (newSculptureValues.name.length > 255) {
      showToast("Name is too long.", Mode.Error);
      isGood = false;
    } else if (newSculptureValues.name == sculpture.name) {
      isGood = false;
      showToast("New name is the same as original name!", Mode.Error);
    } else {
      if (newSculptureValues.name.length != 0) {
        hasChanges = true;
      }
    }
    if (newSculptureValues.yearMade != -1) {
      if (newSculptureValues.yearMade < 1932) {
        showToast(
          "How was this sculpture made before LEGO was invented?!",
          Mode.Error
        );
        isGood = false;
      } else if (newSculptureValues.yearMade > new Date().getFullYear() + 5) {
        showToast(
          "We appriciate you coming from the future with this info, be we only need existing sculptures",
          Mode.Error
        );
        isGood = false;
      } else {
        hasChanges = true;
      }
    }
    if (newSculptureValues.yearRetired != -1) {
      if (newSculptureValues.yearRetired < 1932) {
        showToast(
          "How was this sculpture retired before LEGO was invented?!",
          Mode.Error
        );
        isGood = false;
      } else if (
        newSculptureValues.yearRetired >
        new Date().getFullYear() + 25
      ) {
        showToast(
          "Just leave Year Retired Blank if the planned retirement date is that far away.",
          Mode.Error
        );
        isGood = false;
      } else {
        hasChanges = true;
      }
    }

    if (newSculptureValues.brickSystem.length != 0 && validateBrickSystem()) {
      hasChanges = true;
    }
    if (
      newSculptureValues.location.length > 0 &&
      newSculptureValues.location.length <= 255 &&
      newSculptureValues.location != sculpture.location
    ) {
      hasChanges = true;
    }

    if (
      newSculptureValues.note.length > 0 &&
      newSculptureValues.note.length <= 255 &&
      newSculptureValues.note != sculpture.note
    ) {
      hasChanges = true;
    }

    if (!hasChanges) showToast("No changes were input!", Mode.Warning);
    return isGood && hasChanges;
  }

  function validateBrickSystem(): boolean {
    let bs = newSculptureValues.brickSystem;

    if (bs == sculpture.brickSystem) {
      showToast(
        "New Brick System is the same as the original value.",
        Mode.Error
      );
      return false;
    }

    if (
      bs == "system" ||
      bs == "duplo" ||
      bs == "technic" ||
      bs == "hybrid" ||
      bs == "other"
    )
      return true;
    return false;
  }
}
