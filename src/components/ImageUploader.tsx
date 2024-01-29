import axios from "axios";
import { FormEvent, useContext, useState } from "react";
import { useQuery } from "react-query";
import { AppContext } from "../context/context";
import {
  IAPIResponse,
  IQPartDTOInclude,
  ISculptureDTO,
} from "../interfaces/general";
import showToast, { Mode, getPrefColorName } from "../utils/utils";
import LoadingPage from "./LoadingPage";
import MyToolTip from "./MyToolTip";

interface iProps {
  qpartId: number | null;
  sculptureId: number | null;
}
interface ImageSubmission {
  // formData: FormData;
  qpartId: number | null;
  userId: number;
  sculptureId: number | null;
  type: string;
}

const ImageUploader = ({ qpartId, sculptureId }: iProps) => {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageType, setImageType] = useState<string>("");

  const { data: myqpartData } = useQuery({
    queryKey: "qpartimage" + qpartId,
    queryFn: () => {
      return axios.get<IQPartDTOInclude>(
        `http://localhost:3000/qpart/id/${qpartId}`
      );
    },
    staleTime: 100,
    // enabled: partData?.data !== "" && !partIsLoading,
    enabled: qpartId != -1 && qpartId != null,
  });
  const { data: sculptureData } = useQuery({
    queryKey: "sculptureimage" + sculptureId,
    queryFn: () => {
      return axios.get<ISculptureDTO>(
        `http://localhost:3000/sculpture/byId/${sculptureId}`
      );
    },
    staleTime: 100,
    // enabled: partData?.data !== "" && !partIsLoading,
    enabled: sculptureId != -1 && sculptureId != null,
  });

  if (myqpartData || sculptureData) {
    // const mode = myqpartData ? "qpart" : "sculpture";
    const myqpart = myqpartData?.data || null;
    const mysculpture = sculptureData?.data || null;

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      if (selectedImage) {
        const imageData: ImageSubmission = {
          userId: payload.id,
          qpartId: myqpart ? myqpart.id : null,
          sculptureId: mysculpture ? mysculpture.id : null,
          type: myqpart ? imageType : "sculpture",
        };
        console.log(imageData);

        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("imageData", JSON.stringify(imageData));

        try {
          axios
            .post<IAPIResponse>(
              "http://localhost:3000/image/upload",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((resp) => {
              console.log(resp.data);

              if (resp.data.code == 201 || resp.data.code == 202) {
                setImageType("");
                setSelectedImage(null);
                if (resp.data.code == 201)
                  showToast("Image submitted for approval!", Mode.Success);
                else showToast("Image added!", Mode.Success);
              } else {
                showToast("Error uploading image.", Mode.Error);
              }
            });

          // console.log("Image uploaded successfully");
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      } else if (imageType == "") {
        showToast("Please select a type for this image.", Mode.Warning);
      }
    };
    return (
      <div>
        <div className="ui-space-out">
          {myqpart && (
            <>
              <div>
                <div>Part Name:</div>
                <div>{myqpart.mold.parentPart.name}</div>
              </div>
              <div>
                <div>Part Number:</div>
                <div>{myqpart.mold.number}</div>
              </div>
              <div>
                <div>Part Color:</div>
                <div>
                  {getPrefColorName(myqpart.color, prefPayload.prefName)}
                </div>
              </div>

              <div>
                <div>
                  Type:
                  <MyToolTip
                    content={
                      <div
                        style={{ maxWidth: "20em" }}
                        className="d-flex flex-col jc-start"
                      >
                        <div>See below for a guide:</div>
                        <ul className="tt-list">
                          <li>
                            <span>Part:</span> Use this if the part is the only
                            subject in the photo, ideally with a neutral
                            background and clear focus.
                          </li>
                          <li>
                            <span>Suplemental:</span> Use this if the image is
                            suplemental, this could be a comparison photo
                            including multiple parts, or it could be a photo of
                            the underside of a part to show additional details.
                          </li>
                          {/* <li>
                        <span>Sculpture:</span> Use this if the image is of the
                        part used in a build/model/sculpture.
                      </li> */}
                          <li>
                            <span>Damaged:</span> Use this if the part is
                            visually and significantly damaged.
                          </li>
                          <li>
                            <span>Other:</span> Use this for other types of
                            images
                          </li>
                        </ul>
                      </div>
                    }
                    id="img-type"
                  />
                </div>
                <select
                  onChange={(e) => setImageType(e.target.value)}
                  value={imageType}
                >
                  <option value={""}>--</option>
                  <option value={"part"}>Part</option>
                  <option value={"suplemental"}>Suplemental</option>
                  {/* <option value={"sculpture"}>Sculpture</option> */}
                  <option value={"damaged"}>Damaged</option>
                  <option value={"other"}>Other</option>
                </select>
              </div>
            </>
          )}
          {mysculpture && (
            <>
              <div>
                <div>Sculpture Name:</div>
                <div>{mysculpture.name}</div>
              </div>
            </>
          )}
        </div>

        {selectedImage && (
          <div className="max-size">
            <img
              alt="not found"
              width={"250px"}
              src={URL.createObjectURL(selectedImage)}
            />
            <br />
            <button onClick={() => setSelectedImage(null)}>Remove</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}

        <br />
        <br />

        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            if (event.target.files !== null) {
              console.log(event.target.files[0]);

              setSelectedImage(event.target.files[0]);
            }
          }}
        />
      </div>
    );
  } else {
    return <LoadingPage />;
  }
};

export default ImageUploader;
