import axios from "axios";
import { useQuery, useMutation } from "react-query";
import showToast, { Mode } from "../../../utils/utils";
import {
  IAPIResponse,
  ImageDTO,
  ImageDTOExtended,
} from "../../../interfaces/general";
import PopupImage from "../../../components/PopupImage";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ApproveImageView() {
  const [imageOpen, setImageOpen] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("");
  const {
    data: imgData,
    isFetched,
    refetch,
  } = useQuery("notApprovedImgs", () =>
    axios.get<ImageDTOExtended[]>("http://localhost:3000/image/notApproved")
  );
  const imgMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<IAPIResponse>(`http://localhost:3000/image/approve`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetch();
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
        refetch();
        showToast("Image deleted...", Mode.Info);
      } else {
        showToast("Error deleting image", Mode.Error);
      }
    },
  });

  if (isFetched && imgData) {
    let imgs = imgData.data;

    function formatURL(fileName: string): string {
      const imagePathStarter = "http://localhost:9000/q-part-images/";
      return imagePathStarter + fileName;
    }
    return (
      <>
        {imageOpen && imageName && (
          <PopupImage
            imgPath={formatURL(imageName)}
            closePopup={() => setImageOpen(false)}
          />
        )}
        <div className="formcontainer">
          <h1>approve images</h1>
          <div className="mainform-wide">
            {imgs.length > 0 ? (
              imgs.map((img) => {
                return (
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
                        {img.qpart.mold.parentPart.name} (
                        {img.qpart.mold.number})
                      </Link>
                    </div>
                    <div className="d-flex flex-col">
                      <div>Uploader:</div>
                      <div>{img.uploader.name}</div>
                      <div>{img.uploader.email}</div>
                    </div>

                    <div>
                      <button onClick={() => imgMutation.mutate(img.id)}>
                        Approve
                      </button>
                      <div className="button-spacer">|</div>
                      <button onClick={() => imgDeleteMutation.mutate(img.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-1">
                nothing to approve right now!
              </div>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
