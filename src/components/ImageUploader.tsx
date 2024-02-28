import axios from "axios";
import { FormEvent, useContext, useState } from "react";
import { useQuery } from "react-query";
import { AppContext } from "../context/context";
import {
  IAPIResponse,
  IQPartDTOInclude,
  ISculptureDTO,
} from "../interfaces/general";
import showToast, {
  Mode,
  getPrefColorName,
  reduceFraction,
} from "../utils/utils";
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
  const [resizedImage, setResizedImage] = useState<Blob | null>(null);

  const minWidth = 150;
  const maxWidth = 1000;

  const allowedTypes = ["image/jpeg", "image/png"];

  const { data: myqpartData } = useQuery({
    queryKey: "qpartimage" + qpartId,
    queryFn: () => {
      return axios.get<IQPartDTOInclude>(
        `http://localhost:3000/qpart/id/${qpartId}`
      );
    },
    staleTime: 100,
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
    enabled: sculptureId != -1 && sculptureId != null,
  });

  if (myqpartData || sculptureData) {
    const myqpart = myqpartData?.data || null;
    const mysculpture = sculptureData?.data || null;

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      let convertedFile = null;
      if (resizedImage)
        convertedFile = new File([resizedImage], "resized_image.jpg", {
          type: "image/jpeg",
        });
      const imageToUpload = convertedFile || selectedImage;
      if (!imageToUpload) {
        showToast("Please select an image.", Mode.Warning);
        return;
      }

      console.log("Converted: ", convertedFile);

      console.log("selected: ", selectedImage);

      console.log(imageToUpload);

      if (imageToUpload) {
        const image = new Image();
        image.src = URL.createObjectURL(imageToUpload);

        image.onload = () => {
          const width = image.width;
          const height = image.height;
          //   setDimensions({ width, height });
          if (
            height >= minWidth &&
            height <= maxWidth &&
            width >= minWidth &&
            width <= maxWidth &&
            isValidRatio(width, height) &&
            allowedTypes.includes(imageToUpload.type)
          ) {
            // All validation conditions met, proceed with uploading

            console.log(image);

            const imageData: ImageSubmission = {
              userId: payload.id,
              qpartId: myqpart ? myqpart.id : null,
              sculptureId: mysculpture ? mysculpture.id : null,
              type: myqpart ? imageType : "sculpture",
            };

            const formData = new FormData();
            formData.append("image", imageToUpload);
            formData.append("imageData", JSON.stringify(imageData));

            console.log(formData);

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
                    setResizedImage(null);
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
          } else {
            // Validation failed, show error message

            if (!isValidRatio(width, height))
              showToast(
                `Image must be be at least a 1 / 2 aspect ratio. Your image is ${
                  width < height ? "too narrow/tall." : "too wide/short."
                } (${reduceFraction(width, height)})`,
                Mode.Error
              );
            if (!allowedTypes.includes(imageToUpload.type))
              showToast(
                "Image must be in JPG, JPEG, or PNG format.",
                Mode.Error
              );
          }
        };

        image.onerror = () => {
          // Error loading image
          showToast("Error loading image. Please try again.", Mode.Error);
        };
      }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files !== null) {
        const file = event.target.files[0];
        if (allowedTypes.includes(file.type)) {
          setSelectedImage(file);
          setResizedImage(null);
          resizeImage(file);
        } else {
          showToast("Image must be in JPG, JPEG, or PNG format.", Mode.Error);
        }
      }
    };
    const resizeImage = (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) return;
          let { width, height } = image;
          const aspectRatio = width / height;
          if (!isValidRatio(width, height)) {
            showToast(
              `Image must be be at least a 1 / 2 aspect ratio. Your image is ${
                width < height ? "too narrow/tall." : "too wide/short."
              } (${reduceFraction(width, height)})`,
              Mode.Error
            );
          } else if (
            width > maxWidth ||
            width < minWidth ||
            height > maxWidth ||
            height < minWidth
          ) {
            if (width > height) {
              if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatio;
              } else if (width < minWidth) {
                width = minWidth;
                height = width / aspectRatio;
              }
            } else {
              if (height > maxWidth) {
                height = maxWidth;
                width = height * aspectRatio;
              } else if (height < minWidth) {
                height = minWidth;
                width = height * aspectRatio;
              }
            }
            canvas.width = width;
            canvas.height = height;
            context.drawImage(image, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (!blob) return;
              setResizedImage(blob);
              showToast(
                `Image successfully resized to ${Math.floor(
                  height
                )}x${Math.floor(width)}`,
                Mode.Success
              );
            }, file.type);
          }
        };
      };
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
                            <span>Supplemental:</span> Use this if the image is
                            supplemental, this could be a comparison photo
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
                  <option value={"supplemental"}>supplemental</option>
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
            <button
              onClick={(e) => {
                if (imageType != "") {
                  handleSubmit(e);
                } else {
                  showToast("Please select an Image Type first!", Mode.Warning);
                }
              }}
            >
              Submit
            </button>
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

              // setSelectedImage(event.target.files[0]);
              handleImageChange(event);
            }
          }}
        />
        {/* <button disabled={resizeButtonDisabled} onClick={handleResize}>
          Resize
        </button> */}
      </div>
    );
  } else {
    return <LoadingPage />;
  }

  function isValidRatio(width: number, height: number): boolean {
    const aspectRatio = 1 / 2;

    let biggerNumber = width > height ? width : height;
    let smallerNumber = width < height ? width : height;

    const myAspectRatio = smallerNumber / biggerNumber;

    return myAspectRatio >= aspectRatio;
  }
};

export default ImageUploader;
