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
interface IDimensions {
  width: number;
  height: number;
}

const ProfilePictureUploader = ({ userId }: iProps) => {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const defaultValue: IDimensions = { width: 0, height: 0 };
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<IDimensions>(defaultValue);

  if (userId > 0) {
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
                    setDimensions(defaultValue);
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
            if (!["image/jpeg", "image/png"].includes(selectedImage.type))
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
            <img
              alt="not found"
              width={"250px"}
              src={URL.createObjectURL(selectedImage)}
            />
            {/* <div>
              width: {dimensions.width} height: {dimensions.height}
            </div> */}
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
