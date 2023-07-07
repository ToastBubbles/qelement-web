import axios from "axios";
import { useQuery, useMutation, MutationFunction } from "react-query";
import showToast, { Mode } from "../../../utils/utils";
import {
  IAPIResponse,
  ImageDTO,
  ImageDTOExtended,
} from "../../../interfaces/general";
import PopupImage from "../../../components/PopupImage";
import { useState } from "react";
import { Link } from "react-router-dom";
import ImageApprovalRow from "../../../components/ImageApprovalRow";

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

  if (isFetched && imgData) {
    let imgs = imgData.data;

    function formatURL(fileName: string): string {
      const imagePathStarter = "http://localhost:9000/q-part-images/";
      return imagePathStarter + fileName;
    }
    return (
      <>
        {/* {imageOpen && imageName && (
          <PopupImage
            imgPath={formatURL(imageName)}
            closePopup={() => setImageOpen(false)}
          />
        )} */}
        <div className="formcontainer">
          <h1>approve images</h1>
          <div className="mainform-wide">
            {imgs.length > 0 ? (
              imgs.map((img) => {
                return <ImageApprovalRow img={img} refetchFn={refetch} />;
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
