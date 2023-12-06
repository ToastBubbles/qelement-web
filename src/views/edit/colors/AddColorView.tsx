import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import MyToolTip from "../../../components/MyToolTip";
import { IColorDTO } from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import { AppContext } from "../../../context/context";

export default function AddColorView() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);
  const baseValues: IColorDTO = {
    bl_name: "",
    tlg_name: "",
    bo_name: "",
    hex: "",
    swatchId: -1,
    bl_id: -1,
    tlg_id: -1,
    bo_id: -1,
    type: "solid",
    note: "",
    creatorId: -1,
  };
  // const [searchQuery, setSearchQuery] = useState<string>("");
  const [newColor, setNewColor] = useState<IColorDTO>(baseValues);
  const colorMutation = useMutation({
    mutationFn: (colorInfo: IColorDTO) =>
      axios.post<IColorDTO>(`http://localhost:3000/color`, colorInfo),
    onSuccess: () => {
      showToast("Color successfully submitted for approval!", Mode.Success);
    },
  });

  useEffect(() => {
    setNewColor((newColor) => ({
      ...newColor,
      ...{ creatorId: payload.id },
    }));
  }, [payload]);

  return (
    <>
      <div className="formcontainer">
        <h1>add new color</h1>
        <div className="mainform">
          <div className="w-100 d-flex jc-space-b">
            <label htmlFor="colorBl">Bricklink Name / ID</label>
            <div className="d-flex jc-end">
              <input
                maxLength={100}
                id="colorBl"
                className="formInput fg-1"
                placeholder="Optional"
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ bl_name: e.target.value },
                  }))
                }
                value={newColor.bl_name}
              />
              <input
                maxLength={6}
                className="formInput w-10"
                type="number"
                placeholder="ID"
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ bl_id: e.target.valueAsNumber },
                  }))
                }
                value={newColor.bl_id == -1 ? "" : newColor.bl_id}
              />
            </div>
          </div>
          <div className="w-100 d-flex jc-space-b">
            <label htmlFor="colorl">LEGO Name / ID</label>
            <div className="d-flex jc-end">
              <input
                maxLength={100}
                id="colorl"
                className="formInput fg-1"
                placeholder="Optional"
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ tlg_name: e.target.value },
                  }))
                }
                value={newColor.tlg_name}
              />
              <input
                maxLength={6}
                className="formInput w-10"
                type="number"
                placeholder="ID"
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ tlg_id: e.target.valueAsNumber },
                  }))
                }
                value={newColor.tlg_id == -1 ? "" : newColor.tlg_id}
              />
            </div>
          </div>
          <div className="w-100 d-flex jc-space-b">
            <label htmlFor="colorBo">Brickowl Name / ID</label>
            <div className="d-flex jc-end">
              <input
                maxLength={100}
                id="colorBo"
                className="formInput fg-1"
                placeholder="Optional"
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ bo_name: e.target.value },
                  }))
                }
                value={newColor.bo_name}
              />
              <input
                maxLength={6}
                type="number"
                className="formInput w-10"
                placeholder="ID"
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ bo_id: Number(e.target.value) },
                  }))
                }
                value={newColor.bo_id == -1 ? "" : newColor.bo_id}
              />
            </div>
          </div>
          <div className="w-100 d-flex jc-space-b">
            <div>
              <label htmlFor="colorhex">HEX Color Code (6 Characters)</label>
              <MyToolTip
                content={
                  <div style={{ maxWidth: "20em" }}>
                    <div style={{ marginBottom: "0.3ems" }}>
                      HEX Value is a 6 digit alphanumeric code that represents a
                      color. Characters should only be 0-9 and A-F, 0 is the
                      lowest value, and F is the highest value.
                    </div>
                    The 6 digits are broken up into three pairs of two to
                    represent RGB. #FF00A1 would represent a shade of Magenta,
                    FF means it has the max amount of red, 00 means it has no
                    green, and A1 means it has a medium-high level of blue.
                    #000000 is Black and #FFFFFF is white.
                  </div>
                }
                id="hex"
              />
            </div>
            <div className="d-flex jc-end">
              #
              <input
                className="formInput w-50 uppercase"
                placeholder="Optional"
                pattern="[0-9a-fA-F]+"
                maxLength={6}
                onKeyDown={(e) => {
                  // Get the pressed key
                  const key = e.key;

                  // Allow non-character keys like backspace and arrow keys
                  if (e.code.includes("Arrow") || key === "Backspace") {
                    return;
                  }

                  // Regular expression pattern to match hexadecimal characters
                  const hexPattern = /^[0-9a-fA-F]$/;

                  // Check if the pressed key is a valid hexadecimal character
                  if (!hexPattern.test(key)) {
                    e.preventDefault(); // Prevent the character from being entered
                  }
                  // else {
                  // }
                }}
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ hex: e.target.value.toUpperCase() },
                  }))
                }
                value={newColor.hex}
              />
              <div
                className={"showHEX " + newColor.type}
                style={{
                  backgroundColor:
                    newColor.hex.length == 6
                      ? `#${newColor.hex}`
                      : "transparent",
                }}
              ></div>
            </div>
          </div>
          <div className="w-100 d-flex jc-space-b">
            <div>
              <label htmlFor="swatch">Swatch ID</label>
              <MyToolTip
                content={
                  <div style={{ maxWidth: "20em" }}>
                    Swatch IDs are internal numerical values that are used to
                    organize colors by shade, you can find the most appropriate
                    Swatch ID by finding two colors that this new color should
                    go between, then simply use a number that is between each of
                    the color's swatch IDs. Example: if adding a new shade of
                    Red, find where it fits best on the color table, let's say
                    it fits between Dark Red (900) and Red (1000), we can use
                    950 as it's swatch ID because it's right in the middle, and
                    leaves plenty of room for future colors. If you are confused
                    by this, please leave this field blank.
                  </div>
                }
                id="swatch"
              />
            </div>
            <div className="d-flex jc-end">
              <input
                className="formInput w-50"
                placeholder="Optional"
                maxLength={10}
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ swatchId: Number(e.target.value) },
                  }))
                }
                value={newColor.swatchId == -1 ? "" : newColor.swatchId}
              />
            </div>
          </div>
          <div className="w-100 d-flex jc-space-b">
            <label htmlFor="type">Type</label>
            <select
              name="type"
              id="type"
              className="formInput"
              onChange={(e) =>
                setNewColor((newColor) => ({
                  ...newColor,
                  ...{ type: e.target.value },
                }))
              }
              value={newColor.type}
            >
              <option value="solid">solid</option>
              <option value="transparent">transparent</option>
              <option value="chrome">chrome</option>
              <option value="pearl">pearl</option>
              <option value="satin">satin</option>
              <option value="metallic">metallic</option>
              <option value="milky">milky</option>
              <option value="glitter">glitter</option>
              <option value="speckle">speckle</option>
              <option value="modulex">modulex</option>
              <option value="modulexFoil">modulex foil</option>
              <option value="functional">functional</option>
              <option value="unreleased">unreleased</option>
            </select>
          </div>
          <label htmlFor="colornote" style={{ marginRight: "auto" }}>
            Note
          </label>
          <div className="w-100 d-flex">
            <textarea
              id="colornote"
              className="fg-1 formInput"
              rows={5}
              placeholder="Optional"
              maxLength={255}
              onChange={(e) =>
                setNewColor((newColor) => ({
                  ...newColor,
                  ...{ note: e.target.value },
                }))
              }
              value={newColor.note}
            />
          </div>

          <button
            onClick={() => {
              if (newColor.hex.length == 0) newColor.hex = "UNKNWN";
              if (newColor.hex.length == 6 && newColor.creatorId != -1) {
                // showToast("Color Submitted for approval!", Mode.Success);

                colorMutation.mutate(newColor);
                setNewColor(baseValues);
              } else {
                showToast("Error adding color.", Mode.Error);
              }
            }}
          >
            Add Color
          </button>
        </div>
      </div>
    </>
  );
}
