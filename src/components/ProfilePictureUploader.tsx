import axios from "axios";
import { FormEvent, useContext, useState } from "react";
import { useQuery } from "react-query";
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
}

const ProfilePictureUploader = ({ userId }: iProps) => {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  if (userId > 0) {
    // const handleSubmit = (event: FormEvent) => {
    //   event.preventDefault();

    //   if (selectedImage) {
    //     const imageData: iIdOnly = {
    //       id: userId,
    //     };

    //     const formData = new FormData();
    //     formData.append("image", selectedImage);
    //     formData.append("imageData", JSON.stringify(imageData));

    //     try {
    //       axios
    //         .post<IAPIResponse>(
    //           "http://localhost:3000/image/upload",
    //           formData,
    //           {
    //             headers: {
    //               Authorization: `Bearer ${token}`,
    //               "Content-Type": "multipart/form-data",
    //             },
    //           }
    //         )
    //         .then((resp) => {
    //           console.log(resp.data);

    //           if (resp.data.code == 201 || resp.data.code == 202) {
    //             setSelectedImage(null);
    //             if (resp.data.code == 201)
    //               showToast("Image submitted for approval!", Mode.Success);
    //             else showToast("Image added!", Mode.Success);
    //           } else {
    //             showToast("Error uploading image.", Mode.Error);
    //           }
    //         });

    //       // console.log("Image uploaded successfully");
    //     } catch (error) {
    //       console.error("Error uploading image:", error);
    //     }
    //   }
    // };
    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      if (selectedImage) {
        const image = new Image();
        image.src = URL.createObjectURL(selectedImage);

        image.onload = () => {
          const width = image.width;
          const height = image.height;

          if (
            width === height &&
            width >= 100 &&
            width <= 250 &&
            ["image/jpeg", "image/png"].includes(selectedImage.type)
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
            showToast(
              "Please upload an image that is a perfect square between 100x100 and 250x250 pixels, in JPG, JPEG, or PNG format.",
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
            <li className="grey-txt">must be 100x100px to 250-250px</li>
            <li className="grey-txt">must be a perfect square</li>
            <li className="grey-txt">must be JPG/JPEG/PNG</li>
        </ul>
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

export default ProfilePictureUploader;
