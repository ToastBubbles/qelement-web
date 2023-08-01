import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { IAPIResponse, ImageDTOExtended } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";
import PopupImage from "./PopupImage";

interface IProps {
  img: ImageDTOExtended;
  refetchFn: () => void;
}

export default function ImageApprovalRow({ img, refetchFn }: IProps) {
  const [imageOpen, setImageOpen] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  function formatURL(fileName: string): string {
    const imagePathStarter = "http://localhost:9000/q-part-images/";
    return imagePathStarter + fileName;
  }

  const imgMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<IAPIResponse>(`http://localhost:3000/image/approve`, {
          id,
          isPrimary,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetchFn();
      showToast("Image approved!", Mode.Success);
    },
  });

  const imgDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.post<IAPIResponse>(`http://localhost:3000/image/delete`, {
        id,
      }),
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
      <div
        key={img.id}
        className="d-flex jc-space-b w-100 p-1 alternating-children"
      >
        <div
          className="img-approval-container"
          onClick={() => {
            setImageName(img.fileName);
            setImageOpen(true);
          }}
        >
          <img src={formatURL(img.fileName)} />
        </div>

        <div className="d-flex flex-col">
          <div>Type:</div>
          <div>{img.type}</div>
        </div>
        <div className="d-flex flex-col">
          <div>Color:</div>
          <div>
            {img.qpart.color.bl_name
              ? img.qpart.color.bl_name
              : img.qpart.color.tlg_name}
          </div>
        </div>
        <div className="d-flex flex-col">
          <div>Part:</div>
          <Link
            to={`/part/${img.qpart.mold.parentPart.id}?color=${img.qpart.color.id}`}
          >
            {img.qpart.mold.parentPart.name} ({img.qpart.mold.number})
          </Link>
        </div>
        <div className="d-flex flex-col">
          <div>Uploader:</div>
          <div>{img.uploader.name}</div>
          <div>{img.uploader.email}</div>
        </div>
        <div className="d-flex flex-col">
          <div>Make Primary:</div>
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
          <button onClick={() => imgDeleteMutation.mutate(img.id)}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
