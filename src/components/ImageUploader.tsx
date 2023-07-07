import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  IQPartDTO,
  IQPartDTOInclude,
  color,
  part,
} from "../interfaces/general";
import { useQuery } from "react-query";
import showToast, { Mode } from "../utils/utils";
import LoadingPage from "./LoadingPage";
import { AppContext } from "../context/context";
import MyToolTip from "./MyToolTip";

interface iProps {
  qpartId: number;
}
interface ImageSubmission {
  // formData: FormData;
  qpartId: number;
  userId: number;
  type: string;
}

const ImageUploader = ({ qpartId }: iProps) => {
  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageType, setImageType] = useState<string>("");
  // const [partNumber, setPartNumber] = useState<string>("");

  // const {
  //   data: partData,
  //   isLoading: partIsLoading,
  //   error: partError,
  //   refetch: partRefetch,
  // } = useQuery({
  //   queryKey: "partByNumber",
  //   queryFn: () =>
  //     axios.get<part | "">(
  //       `http://localhost:3000/parts/byNumber/${partNumber.trim()}`
  //     ),
  //   onSuccess(data) {
  //     if (data.data === "") {
  //       showToast("Part number not found", Mode.Error);
  //     } else {
  //       showToast("Part retrieved!", Mode.Success);
  //     }
  //   },
  //   enabled: false,
  // });

  // const {
  //   data: colData,
  //   isLoading: colIsLoading,
  //   error: colError,
  // } = useQuery("allColors", () =>
  //   axios.get<color[]>("http://localhost:3000/color")
  // );
  // const {
  //   data: qpartData,
  //   isLoading: qpartIsLoading,
  //   error: qpartError,
  //   refetch: qpartRefetch,
  // } = useQuery({
  //   queryKey: "qparts" + partData?.data.id,
  //   queryFn: () => {
  //     return axios.get<IQPartDTO[]>(
  //       `http://localhost:3000/qpart/matchesByPartId/${partData?.data.id}`
  //     );
  //   },
  //   staleTime: 0,
  //   enabled:
  //     partData?.data !== "" && !partIsLoading && partData?.data.id != undefined,
  // });

  // function validatePartNo() {
  //   partRefetch();
  // }

  //   qparts = qpartData?.data;
  // let colors = colData?.data;
  // function getColorName(colorId: number): string {
  //   let thisColor = colors?.find((x) => x.id == colorId);

  //   if (thisColor) {
  //     return thisColor.bl_name ? thisColor.bl_name : thisColor.tlg_name;
  //   }
  //   return "Unnamed Color";
  // }

  if (qpartId != -1) {
    const {
      data: myqpartData,
      isLoading: myqpartIsLoading,
      error: myqpartError,
      refetch: myqpartRefetch,
    } = useQuery({
      queryKey: "qpart" + qpartId,
      queryFn: () => {
        return axios.get<IQPartDTOInclude>(
          `http://localhost:3000/qpart/id/${qpartId}`
        );
      },
      staleTime: 100,
      // enabled: partData?.data !== "" && !partIsLoading,
    });
    if (myqpartData) {
      let myqpart = myqpartData.data;

      const handleSubmit = (event) => {
        event.preventDefault();

        if (selectedImage && imageType != "") {
          // let data: ImageSubmission = {

          //   qpartId: myqpart.id,
          //   userId: payload.id,
          //   type: "part",
          // };
          // const formData =

          const imageData: ImageSubmission = {
            userId: payload.id,
            qpartId: myqpart.id,
            type: imageType,
          };
          const formData = new FormData();
          formData.append("image", selectedImage);
          formData.append("imageData", JSON.stringify(imageData));

          try {
            axios.post("http://localhost:3000/image/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            // console.log("Image uploaded successfully");
            setImageType("");
            setSelectedImage(null);
            showToast("Image submitted for approval!", Mode.Success);
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
                {myqpart.color.bl_name
                  ? myqpart.color.bl_name
                  : myqpart.color.tlg_name}
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
                        <li>
                          <span>Sculpture:</span> Use this if the image is of
                          the part used in a build/model/sculpture.
                        </li>
                        <li>
                          <span>Damaged:</span> Use this if the part is visually
                          and significantly damaged.
                        </li>
                        <li>
                          <span>Other:</span> Use this for other types of images
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
                <option value={"sculpture"}>Sculpture</option>
                <option value={"damaged"}>Damaged</option>
                <option value={"other"}>Other</option>
              </select>
            </div>
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
  } else
    return (
      <div>
        {/* <div>
          <div>
            Part Name:{" "}
            <span className="lt-red">
              {partData?.data && partData?.data.name}
            </span>
          </div>
          <div>
            Part Number:
            <input
              onChange={(e) => setPartNumber(e.target.value)}
              onBlur={(e) => {
                if (e.target.value.length > 1) {
                  validatePartNo();
                }
              }}
              value={partNumber}
            />
          </div>
          <div>
            Part Color:{" "}
            <select
              name="qpartcolors"
              id="qpartcolors"
              className="qpart-color-dropdown"
              // onChange={(e) => setSelectedQPartid(Number(e.target.value))}
              // value={selectedQPartid}
            >
              <option value="-1">--</option>
              {qpartData?.data &&
                qpartData.data.map((qpart) => (
                  <option key={qpart.id} value={`${qpart.id}`}>
                    {getColorName(qpart.colorId)}
                  </option>
                ))}
            </select>
          </div>
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
            <button onClick={() => setSelectedImage(null)}>Submit</button>
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
        /> */}
      </div>
    );
};

export default ImageUploader;
