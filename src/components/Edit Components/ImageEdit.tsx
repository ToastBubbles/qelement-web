import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { IIdAndString, ImageDTO, iIdOnly } from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { useMutation } from "react-query";
import axios from "axios";
import showToast, { Mode, imagePath } from "../../utils/utils";

interface IProps {
  image: ImageDTO;
  disableTypeMutation?: boolean;
  closePopup: () => void;
  refetchFn: () => void;
}

export default function ImageEdit({
  image,
  disableTypeMutation = false,
  closePopup,
  refetchFn,
}: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const defaultElementIDValues: IIdAndString = {
    id: -1,
    string: "",
  };

  const [readyToDelete, setReadyToDelete] = useState<boolean>(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] =
    useState<boolean>(false);

  const [newImageValues, setNewImageValues] = useState<IIdAndString>(
    defaultElementIDValues
  );
  const imageEditMutation = useMutation({
    mutationFn: ({ id, string }: IIdAndString) =>
      axios.post(
        `http://localhost:3000/image/edit`,
        {
          id,
          string,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Image Changes saved!", Mode.Success);
        setNewImageValues(defaultElementIDValues);
        refetchFn();
        closePopup();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  const imageDeletionMutation = useMutation({
    mutationFn: ({ id }: iIdOnly) =>
      axios.post(
        `http://localhost:3000/image/deny`,
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
        showToast("Image Deleted!", Mode.Success);
        setNewImageValues(defaultElementIDValues);
        refetchFn();
        closePopup();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  const imageMarkPrimaryMutation = useMutation({
    mutationFn: ({ id }: iIdOnly) =>
      axios.post(
        `http://localhost:3000/image/markPrimary`,
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
        showToast("Image Marked as Primary!", Mode.Success);
        setNewImageValues(defaultElementIDValues);
        refetchFn();
        closePopup();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  useEffect(() => {
    setNewImageValues({
      id: image.id,
      string: image.type,
    });
  }, [image]);

  return (
    <div className="d-flex flex-col ai-center">
      <div className="small-image-container">
        <img src={imagePath + image.fileName} alt="brick" />
      </div>

      {!disableTypeMutation && (
        <div
          className="d-flex jc-space-b"
          style={{ marginTop: "2em", width: "50%" }}
        >
          <label htmlFor="type">Type:</label>
          <select
            name="type"
            onChange={(e) =>
              setNewImageValues((newImageValues) => ({
                ...newImageValues,
                string: e.target.value.toLowerCase(),
              }))
            }
            value={newImageValues.string}
          >
            <option value={""}>--</option>
            <option value={"part"}>Part</option>
            <option value={"supplemental"}>Supplemental</option>
            <option value={"sculpture"}>Sculpture</option>
            <option value={"damaged"}>Damaged</option>
            <option value={"other"}>Other</option>
          </select>
        </div>
      )}

      <div
        className={
          "d-flex w-50" + (disableTypeMutation ? " jc-center" : " jc-space-b")
        }
        style={{ marginTop: "2em" }}
      >
        <button
          disabled={image.isPrimary || image.approvalDate == null}
          onClick={() => markPrimary()}
        >
          Make Primary
        </button>
        {!disableTypeMutation && (
          <button onClick={() => submitImageChanges()}>Submit</button>
        )}
      </div>

      <div className="fake-hr"></div>

      <div className={readyToDelete ? "hidden" : ""}>
        <div style={{ padding: "2em 0" }}>Delete this Image</div>
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
            imageDeletionMutation.mutate({ id: image.id });
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  function submitImageChanges() {
    if (newImageValues.id > 0 && validateImageType(newImageValues.string)) {
      imageEditMutation.mutate(newImageValues);
    }
  }

  function markPrimary() {
    if (!image.isPrimary) imageMarkPrimaryMutation.mutate({ id: image.id });
  }

  function validateImageType(str: string): boolean {
    if (
      str == "part" ||
      str == "supplemental" ||
      str == "sculpture" ||
      str == "damaged" ||
      str == "other"
    )
      return true;
    return false;
  }
}
