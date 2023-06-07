import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import AllColors from "../../../components/AllColors";
import { color, IColorDTO } from "../../../interfaces/general";

export default function AllColorsEditView() {
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
      <div className="main-container">
        <div className="right-col">
          <div className="lower-center">
            <div className="color">Edit Colors</div>
            <div>
              <h3>Add new color</h3>
              <div>
                <input
                  placeholder="Bricklink Name"
                  onChange={(e) =>
                    setNewColor((newColor) => ({
                      ...newColor,
                      ...{ bl_name: e.target.value },
                    }))
                  }
                />
                <input
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
              <div>
                <input
                  placeholder="LEGO Name"
                  onChange={(e) =>
                    setNewColor((newColor) => ({
                      ...newColor,
                      ...{ tlg_name: e.target.value },
                    }))
                  }
                />
                <input
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
              <div>
                <input
                  placeholder="Brickowl Name"
                  onChange={(e) =>
                    setNewColor((newColor) => ({
                      ...newColor,
                      ...{ bo_name: e.target.value },
                    }))
                  }
                />
                {/* <input
                  type="number"
                  placeholder="ID"
                  onChange={(e) =>
                    setNewColor((newColor) => ({
                      ...newColor,
                      ...{ bl_id: e.target.valueAsNumber },
                    }))
                  }
                /> */}
              </div>
              <input
                placeholder="HEX (6 characters)"
                onChange={(e) =>
                  setNewColor((newColor) => ({
                    ...newColor,
                    ...{ hex: e.target.value },
                  }))
                }
              />
              <select
                name="type"
                id="type"
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
              <div>
                <textarea
                  placeholder="note"
                  onChange={(e) =>
                    setNewColor((newColor) => ({
                      ...newColor,
                      ...{ note: e.target.value },
                    }))
                  }
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
            </div>
            <div className="fake-hr"></div>

            <div>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                className="bi bi-search zen-search-icon"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg> */}

              <input
                id="searchbar"
                name="searchbar"
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <AllColors search={searchQuery} />
          </div>
        </div>
      </div>
    </>
  );
}

// function addColor(newColor:color, mutation: UseMutationResult<AxiosResponse<color, any>, unknown, IColorDTO, unknown>) {}
