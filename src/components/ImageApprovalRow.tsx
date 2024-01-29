import axios from "axios";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { IAPIResponse, ImageDTOExtended } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";
import PopupImage from "./PopupImage";
import ConfirmPopup from "./ConfirmPopup";
import { AppContext } from "../context/context";

interface IProps {
  img: ImageDTOExtended;
  refetchFn: () => void;
}

export default function ImageApprovalRow({ img, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token },
      // userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [imageOpen, setImageOpen] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  function formatURL(fileName: string): string {
    const imagePathStarter = "http://localhost:9000/q-part-images/";
    return imagePathStarter + fileName;
  }

  const imgMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/image/approve`,
        {
          id,
          isPrimary,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: (e) => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: () => {
      refetchFn();
      showToast("Image approved!", Mode.Success);
    },
  });

  const imgDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(
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
    onError: (e) => {
      showToast("401 Permissions Error", Mode.Error);
    },
    onSuccess: (e) => {
      if (e.data.code == 200) {
        refetchFn();
        showToast("Image deleted...", Mode.Info);
      } else {
        showToast("Error deleting image", Mode.Error);
      }
    },
  });
  return (
    <>
      {imageOpen && imageName && (
        <PopupImage
          imgPath={formatURL(imageName)}
          closePopup={() => setImageOpen(false)}
        />
      )}
      {showDeletePopup && (
        <ConfirmPopup
          content="Are you sure you want to delete this image?"
          closePopup={closePopUp}
          fn={denyRequest}
        />
      )}
      <div
        key={img.id}
        className="grid-container-image w-100 p-1 alternating-children"
      >
        <div
          className="img-approval-container clickable"
          onClick={() => {
            setImageName(img.fileName);
            setImageOpen(true);
          }}
        >
          <img src={formatURL(img.fileName)} />
        </div>

        <div className="d-flex flex-col">
          <div>{img.type}</div>
        </div>
        {img.qpart ? (
          <>
            <div className="d-flex flex-col">
              <div>
                {img.qpart.color.bl_name
                  ? img.qpart.color.bl_name
                  : img.qpart.color.tlg_name}
              </div>
            </div>
            <div className="d-flex flex-col">
              <Link
                to={`/part/${img.qpart.mold.parentPart.id}?color=${img.qpart.color.id}`}
              >
                {img.qpart.mold.parentPart.name} ({img.qpart.mold.number})
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex flex-col"></div>
            <div className="d-flex flex-col"></div>
          </>
        )}
        <div className="d-flex flex-col">
          <div>{img.uploader.name}</div>
          <div>{img.uploader.email}</div>
        </div>
        <div className="d-flex flex-col">
          <input
            type="checkbox"
            onChange={(e) => setIsPrimary(e.target.checked)}
          />
        </div>
        <div>
          <button
            onClick={() => {
              imgMutation.mutate(img.id);
            }}
          >
            Approve
          </button>
          <div className="button-spacer">|</div>
          <button onClick={() => setShowDeletePopup(true)}>Delete</button>
        </div>
      </div>
    </>
  );

  function closePopUp() {
    // setSelectedCategoryId(null);
    setShowDeletePopup(false);
  }
  function denyRequest() {
    // if (selectedCategoryId)
    imgDeleteMutation.mutate(img.id);
    setShowDeletePopup(false);
  }
}
