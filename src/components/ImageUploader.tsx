import axios from "axios";
import React, { useEffect, useState } from "react";
import { IQPartDTO, color, part } from "../interfaces/general";
import { useQuery } from "react-query";
import showToast, { Mode } from "../utils/utils";

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [partNumber, setPartNumber] = useState<string>("");
  //   const [targetPart, setTargetPart] = useState<part | null>(null);
  const [qparts, setQparts] = useState<IQPartDTO[] | undefined>(undefined);

  const {
    data: partData,
    isLoading: partIsLoading,
    error: partError,
    refetch: partRefetch,
  } = useQuery({
    queryKey: "partByNumber",
    queryFn: () =>
      axios.get<part | "">(
        `http://localhost:3000/parts/byNumber/${partNumber.trim()}`
      ),
    onSuccess(data) {
      if (data.data === "") {
        showToast("Part number not found", Mode.Error);
      } else {
        showToast("Part retrieved!", Mode.Success);
      }
    },
    enabled: false,
  });

  const {
    data: colData,
    isLoading: colIsLoading,
    error: colError,
  } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );
  const {
    data: qpartData,
    isLoading: qpartIsLoading,
    error: qpartError,
    refetch: qpartRefetch,
  } = useQuery({
    queryKey: "qpart" + partData?.data.id,
    queryFn: () => {
      return axios.get<IQPartDTO[]>(
        `http://localhost:3000/qpart/matchesByPartId/${partData?.data.id}`
      );
    },
    staleTime: 0,
    enabled: partData?.data !== "" && !partIsLoading,
  });

  function validatePartNo() {
    partRefetch();
  }

  //   qparts = qpartData?.data;
  let colors = colData?.data;
  function getColorName(colorId: number): string {
    let thisColor = colors?.find((x) => x.id == colorId);

    if (thisColor) {
      return thisColor.bl_name ? thisColor.bl_name : thisColor.tlg_name;
    }
    return "Unnamed Color";
  }

  return (
    <div>
      <div>
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
};

export default ImageUploader;
