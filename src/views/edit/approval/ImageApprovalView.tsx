import axios from "axios";
import { useQuery } from "react-query";

import { ImageDTOExtended } from "../../../interfaces/general";

import ImageApprovalRow from "../../../components/ImageApprovalRow";
import { Link } from "react-router-dom";

export default function ApproveImageView() {
  // const [imageOpen, setImageOpen] = useState<boolean>(false);
  // const [imageName, setImageName] = useState<string>("");
  const {
    data: imgData,
    isFetched,
    refetch,
  } = useQuery("notApprovedImgs", () =>
    axios.get<ImageDTOExtended[]>("http://localhost:3000/image/notApproved")
  );

  if (isFetched && imgData) {
    const imgs = imgData.data;

    // function formatURL(fileName: string): string {
    //   const imagePathStarter = "http://localhost:9000/q-part-images/";
    //   return imagePathStarter + fileName;
    // }
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
          <Link className="link"  to={"/approve"}>Back to Approval Overview</Link>
          <div className="mainform-wide">
            <div className="grid-container-image w-100 p-1">
              <div>Image</div>
              <div>Type</div>
              <div>Color</div>
              <div>Part</div>
              <div>Requestor</div>
              <div>Primary?</div>
             
            </div>
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
