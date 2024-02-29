import axios from "axios";
import { FormEvent, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { AppContext } from "../context/context";
import {
  IAPIResponse,
  IQPartDTOInclude,
  ISculptureDTO,
  iIdOnly,
} from "../interfaces/general";
import showToast, { Mode, getPrefColorName } from "../utils/utils";
import LoadingPage from "./LoadingPage";
import MyToolTip from "./MyToolTip";

interface iProps {
  userId: number;
  refetchFn: () => void;
  pfpId?: number;
}

const ProfilePictureUploader = ({ userId, refetchFn, pfpId }: iProps) => {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [resizedImage, setResizedImage] = useState<Blob | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [cropDataPercent, setCropDataPercent] = useState<Crop>();

  const [readyToDelete, setReadyToDelete] = useState<boolean>(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] =
    useState<boolean>(false);
  const minWidth = 150;
  const maxWidth = 250;

  const allowedTypes = ["image/jpeg", "image/png"];

  const imgDeleteMutation = useMutation({
    mutationFn: () =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/image/removeMyPFP`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onError: (e) => {
      console.log(e);

      showToast("Permissions Error", Mode.Error);
    },
    onSuccess: (e) => {
      if (e.data.code == 200) {
        refetchFn();
        showToast("Profile Picture deleted...", Mode.Info);
      } else {
        showToast(`Error deleting image (${e.data.code})`, Mode.Error);
      }
    },
  });

  if (userId > 0) {
    const handleCropComplete = (croppedArea: Crop, croppedAreaPixels: Crop) => {
      // Handle the cropped area
      console.log("Cropped Area:", croppedArea);
      console.log("Cropped Area Pixels:", croppedAreaPixels);
      setCropDataPercent(croppedAreaPixels);
    };

    const handleCropImage = () => {
      if (!selectedImage || !crop) return;

      const image = new Image();
      image.src = URL.createObjectURL(selectedImage);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      image.onload = () => {
        if (cropDataPercent) {
          let cropWidth = Math.floor(
            (image.width * cropDataPercent.width) / 100
          );
          let cropHeight = Math.floor(
            (image.height * cropDataPercent.height) / 100
          );

          let cropX = Math.floor((image.width * cropDataPercent.x) / 100);
          let cropY = Math.floor((image.height * cropDataPercent.y) / 100);

          canvas.width = cropWidth;
          canvas.height = cropHeight;

          context.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
          );

          canvas.toBlob((blob) => {
            if (!blob) return;

            // Set the cropped image as the selected image
            setSelectedImage(
              new File([blob], "cropped_image.jpg", { type: "image/jpeg" })
            );
            setIsCropping(false);

            // You can optionally display the cropped image
            // setCroppedImageUrl(URL.createObjectURL(blob));
          }, "image/jpeg");
        } else {
          showToast("Error getting crop data!", Mode.Error);
        }
      };
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files !== null) {
        const file = event.target.files[0];
        if (allowedTypes.includes(file.type)) {
          setSelectedImage(file);
          // setResizedImage(null);
          // resizeImage(file);
        } else {
          showToast("Image must be in JPG, JPEG, or PNG format.", Mode.Error);
        }
      }
    };
    const resizeImage = () => {
      if (selectedImage) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = () => {
          const image = new Image();
          image.src = reader.result as string;
          image.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) return;
            let { width, height } = image;
            const aspectRatio = width / height;

            if (
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
                setSelectedImage(
                  new File([blob], "resized_image.jpg", { type: "image/jpeg" })
                );
                showToast(
                  `Image successfully resized to ${Math.floor(
                    height
                  )}x${Math.floor(width)}`,
                  Mode.Success
                );
              }, selectedImage.type);
            }
          };
        };
      }
    };
    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      if (selectedImage) {
        const image = new Image();
        image.src = URL.createObjectURL(selectedImage);

        image.onload = () => {
          const width = image.width;
          const height = image.height;
          //   setDimensions({ width, height });
          if (
            width === height &&
            width >= 100 &&
            width <= 250 &&
            allowedTypes.includes(selectedImage.type)
          ) {
            // All validation conditions met, proceed with uploading
            const imageData: iIdOnly = {
              id: userId,
            };

            const formData = new FormData();
            formData.append("image", selectedImage);
            formData.append("imageData", JSON.stringify(imageData));

            try {
              axios
                .post<IAPIResponse>(
                  "http://localhost:3000/image/uploadPFP",
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
          } else {
            // Validation failed, show error message

            if (width !== height)
              showToast("Image must be square.", Mode.Error);
            if (width < 100)
              showToast("Image must be at least 100px wide.", Mode.Error);
            if (width > 250)
              showToast("Image must be less than 250px wide.", Mode.Error);
            if (!allowedTypes.includes(selectedImage.type))
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
    return (
      <div>
        Image must follow the below requirements:
        <ul>
          <li className="grey-txt">must be 100x100 px to 250x250 px</li>
          <li className="grey-txt">must be a perfect square</li>
          <li className="grey-txt">must be JPG/JPEG/PNG</li>
        </ul>
        {selectedImage && (
          <div className="max-size">
            {isCropping ? (
              <ReactCrop
                aspect={1}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
              >
                <img src={URL.createObjectURL(selectedImage)} />
              </ReactCrop>
            ) : (
              <img
                alt="not found"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
              />
            )}
            <br />
            <button
              disabled={isCropping}
              onClick={() => setSelectedImage(null)}
            >
              Remove
            </button>
            <button disabled={isCropping} onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
        <br />
        <br />
        <input
          type="file"
          name="myImage"
          disabled={isCropping}
          onChange={(event) => {
            if (event.target.files !== null) {
              console.log(event.target.files[0]);

              handleImageChange(event);
            }
          }}
        />
        {selectedImage ? (
          <>
            {isCropping ? (
              <button onClick={handleCropImage}>Confirm Crop</button>
            ) : (
              <button
                onClick={() => {
                  if (selectedImage) {
                    setIsCropping(true);
                  }
                }}
              >
                Crop
              </button>
            )}
            <button disabled={isCropping} onClick={resizeImage}>
              Auto Resize
            </button>
          </>
        ) : (
          <>
            {pfpId && pfpId > 0 && (
              <>
                <div className="fake-hr"></div>

                <div className={readyToDelete ? "hidden" : ""}>
                  <div style={{ padding: "2em 0" }}>
                    Delete my Profile Picture
                  </div>
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
                      imgDeleteMutation.mutate();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  } else {
    return <LoadingPage />;
  }
};

export default ProfilePictureUploader;
