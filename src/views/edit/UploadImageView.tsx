import ImageUploader from "../../components/ImageUploader";
import showToast, { Mode } from "../../utils/utils";

export default function UploadImageView() {
  const queryParameters = new URLSearchParams(window.location.search);
  const urlQPartId = queryParameters.get("qpartId");
  const urlSculptureId = queryParameters.get("sculptureId");

  if (urlQPartId) {
    if (urlQPartId && urlSculptureId) {
      showToast(
        "URL contains ID for sculture and QPart, only showing form for QPart",
        Mode.Warning
      );
    }
    return (
      <>
        <div className="formcontainer">
          <h1>upload image</h1>
          <div className="mainform">
            <div>
              Image must follow the below requirements:
              <ul>
                <li className="grey-txt">width/height must be 150px to 1000px</li>
                <li className="grey-txt">must be at least a 1 / 2 aspect ratio, 1 / 1 preferred</li>
                <li className="grey-txt">must be JPG/JPEG/PNG</li>
              </ul>
            </div>
            <ImageUploader qpartId={Number(urlQPartId)} sculptureId={null} />
          </div>
        </div>
      </>
    );
  } else if (urlSculptureId) {
    return (
      <>
        <div className="formcontainer">
          <h1>upload image</h1>
          <div className="mainform">
            <ImageUploader
              qpartId={null}
              sculptureId={Number(urlSculptureId)}
            />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="formcontainer">
          <h1>upload image</h1>
          <div className="mainform">
            <ImageUploader qpartId={null} sculptureId={null} />
          </div>
        </div>
      </>
    );
  }
}
