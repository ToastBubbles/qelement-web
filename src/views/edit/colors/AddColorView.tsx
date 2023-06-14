import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import AllColors from "../../../components/AllColors";
import { color, IColorDTO } from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";

export default function AddColorView() {
  const baseValues: IColorDTO = {
    bl_name: "",
    tlg_name: "",
    bo_name: "",
    hex: "",
    bl_id: -1,
    tlg_id: -1,
    bo_id: -1,
    type: "solid",
    note: "",
  };
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newColor, setNewColor] = useState<IColorDTO>(baseValues);
  const colorMutation = useMutation({
    mutationFn: (colorInfo: IColorDTO) =>
      axios.post<IColorDTO>(`http://localhost:3000/color`, colorInfo),
    onSuccess: () => {
      showToast("Color successfully added!", Mode.Success);
    },
  });
  return (
    <>
      <div className="formcontainer">
        <h1>add new color</h1>
        <div className="mainform">
          <div className="w-100 d-flex jc-space-b">
            <label htmlFor="colorBl">Bricklink Name / ID</label>
            <div className="d-flex jc-end">
              <input
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
            <label htmlFor="colorhex">HEX Color Code (6 Characters)</label>
            <div className="d-flex jc-end">
              #
              <input
                className="formInput w-35"
                placeholder="Optional"
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ hex: e.target.value },
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
              if (newColor.hex.length == 6) {
                console.log("adding...");

                colorMutation.mutate(newColor);
                setNewColor(baseValues);
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
