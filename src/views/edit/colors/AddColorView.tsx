import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import AllColors from "../../../components/AllColors";
import { color, IColorDTO } from "../../../interfaces/general";

export default function AddColorView() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newColor, setNewColor] = useState<color>({
    id: 0,
    bl_name: "",
    tlg_name: "",
    bo_name: "",
    hex: "",
    bl_id: 0,
    tlg_id: 0,
    type: "solid",
    note: "",
    updatedAt: "",
    createdAt: "",
  });
  const colorMutation = useMutation({
    mutationFn: ({
      bl_name,
      tlg_name,
      bo_name,
      hex,
      bl_id,
      tlg_id,
      type,
      note,
    }: IColorDTO) =>
      axios.post<color>(`http://localhost:3000/color`, {
        bl_name,
        tlg_name,
        bo_name,
        hex,
        bl_id,
        tlg_id,
        type,
        note,
      }),
    onSuccess: () => {},
  });
  return (
    <>
      <div className="logincontainer">
        <h1>add new color</h1>
        <div className="loginRegForm">
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
              />
              <input
                className="formInput w-10"
                placeholder="ID"
                // onChange={(e) =>
                //   setNewColor((newColor) => ({
                //     ...newColor,
                //     ...{ bo_name: e.target.value },
                //   }))
                // }
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

                colorMutation.mutate({
                  bl_name: newColor.bl_name,
                  tlg_name: newColor.tlg_name,
                  bo_name: newColor.bo_name,
                  hex: newColor.hex,
                  bl_id: newColor.bl_id,
                  tlg_id: newColor.tlg_id,
                  type: newColor.type,
                  note: newColor.note,
                });
              }
            }}
          >
            Add Color
          </button>

          <div className="fake-hr"></div>
        </div>
      </div>
    </>
  );
}

// function addColor(newColor:color, mutation: UseMutationResult<AxiosResponse<color, any>, unknown, IColorDTO, unknown>) {}
