import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { useQuery, useMutation, UseMutationResult } from "react-query";
import { useNavigate, useParams } from "react-router";
import SimilarColorBanner from "../../../components/SimilarColorBanner";
import {
  similarColor,
  IColorDTO,
  ISimilarColorDTO,
  IEditColor,
  color,
  IAPIResponse,
} from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";

export default function ColorEditView() {
  const { colorId } = useParams();
  const [similarColorToAdd, setSimilarColorToAdd] = useState<number>(0);
  const navigate = useNavigate();

  const {
    data: colData,
    isLoading: colIsLoading,
    error: colError,
  } = useQuery({
    queryKey: "color",
    queryFn: () =>
      axios.get<color>(`http://localhost:3000/color/id/${colorId}`),
    enabled: true,
    retry: false,
  });
  const {
    data: simData,
    isLoading: simIsLoading,
    error: simError,
  } = useQuery({
    queryKey: "similarColors",
    queryFn: () =>
      axios.get<similarColor[]>(
        `http://localhost:3000/similarColor/${colorId}`
      ),
    enabled: true,
    retry: false,
  });
  const colorMutation = useMutation({
    mutationFn: ({
      bl_name,
      tlg_name,
      bo_name,
      hex,
      bl_id,
      bo_id,
      tlg_id,
      type,
      note,
    }: IColorDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/color/id/${color?.id}`, {
        bl_name,
        tlg_name,
        bo_name,
        hex,
        bl_id,
        bo_id,
        tlg_id,
        type,
        note,
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) showToast("Changes saved!", Mode.Success);
      else showToast("Changes were not saved, please check fields", Mode.Error);
    },
  });

  const similarColorMutation = useMutation({
    mutationFn: ({ color_one, color_two }: ISimilarColorDTO) =>
      axios.post<color>(`http://localhost:3000/similarColor`, {
        color_one,
        color_two,
      }),
    onSuccess: () => {},
  });

  if (colError || simError) {
    navigate("/404");
  }
  let color = colData?.data;
  let hex = "#" + color?.hex;

  const [colorEdits, setColorEdits] = useState<IEditColor>({
    bl_name: "unchanged",
    tlg_name: "unchanged",
    bo_name: "unchanged",
    hex: "unchanged",
    bl_id: -1,
    bo_id: -1,
    tlg_id: -1,
    type: "unchanged",
    note: "unchanged",
  });

  function applyChanges() {
    if (color == undefined) return;

    let containsValidEdits = false;
    let containsErrors = false;
    if (colorEdits.bl_name !== "unchanged") {
      console.log("changed bl name");
      containsValidEdits = true;
    }
    if (colorEdits.tlg_name !== "unchanged") {
      console.log("changed tlg name");
      containsValidEdits = true;
    }
    if (colorEdits.bo_name !== "unchanged") {
      console.log("changed bo name");
      containsValidEdits = true;
    }
    if (colorEdits.hex !== "unchanged") {
      if (colorEdits.hex.length == 6) {
        console.log("changed hex");
        containsValidEdits = true;
      } else {
        containsErrors = true;
      }
    }
    if (colorEdits.note !== "unchanged") {
      console.log("changed note");
      containsValidEdits = true;
    }
    if (colorEdits.bl_id !== -1) {
      console.log("changed bl id");
      containsValidEdits = true;
    }
    if (colorEdits.tlg_id !== -1) {
      console.log("changed tlg id");
      containsValidEdits = true;
    }

    console.log(containsErrors);

    if (containsValidEdits && !containsErrors) {
      console.log("saved changes");
      colorMutation.mutate({
        bl_name: colorEdits.bl_name,
        tlg_name: colorEdits.tlg_name,
        bo_name: colorEdits.bo_name,
        hex: colorEdits.hex,
        bl_id: colorEdits.bl_id,
        bo_id: colorEdits.bo_id,
        tlg_id: colorEdits.tlg_id,
        type: colorEdits.type,
        note: colorEdits.note,
      });
    } else {
      if (colorEdits.hex.length != 6)
        showToast(
          "HEX Code is not 6 characters long. No changes were saved",
          Mode.Warning
        );
      else showToast("No changes were saved", Mode.Warning);
    }
  }
  if (color && simData)
    return (
      <>
        <div className="colorTop">
          <div className="colorName">
            {color?.bl_name.length == 0 ? color.tlg_name : color?.bl_name}
          </div>

          <div className="hexbar" style={{ backgroundColor: hex }}>
            #
            <input
              maxLength={6}
              pattern="[0-9a-fA-F]+"
              className="edit-hex"
              defaultValue={color?.hex}
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
                } else {
                }
              }}
              onChange={(e) => {
                setColorEdits((colorEdits) => ({
                  ...colorEdits,
                  ...{ hex: e.target.value.toUpperCase() },
                }));
              }}
            />
          </div>
        </div>
        <div className="fake-hr"></div>

        <SimilarColorBanner similarColors={simData.data} />

        <div className="color-container">
          <section></section>
          <section>
            <div className="edit-similarity">
              <input
                maxLength={6}
                onChange={(e) => setSimilarColorToAdd(Number(e.target.value))}
                type="number"
                id="similarId"
                name="similarId"
                placeholder="color QID"
              />
              <button
                onClick={() => {
                  similarColorMutation.mutate({
                    color_one: Number(colorId),
                    color_two: similarColorToAdd,
                  });
                }}
              >
                Add similarity
              </button>
            </div>
            <div className="color-details-container">
              <div className="color-details-banner">color details</div>

              <div className="color-detail-header">
                <span>ID</span>
              </div>
              <div className="color-subdetails-id">
                <div>
                  {/* <div className="color-id">{color?.bl_id}</div> */}
                  <input
                    maxLength={6}
                    className="edit-id-input"
                    defaultValue={color?.bl_id}
                    type="number"
                    onChange={(e) =>
                      setColorEdits((colorEdits) => ({
                        ...colorEdits,
                        ...{ bl_id: e.target.valueAsNumber },
                      }))
                    }
                  />
                  <div>Bricklink</div>
                </div>
                <div>
                  {/* <div className="color-id">{color?.tlg_id}</div> */}
                  <input
                    maxLength={6}
                    className="edit-id-input"
                    defaultValue={color?.tlg_id}
                    type="number"
                    onChange={(e) =>
                      setColorEdits((colorEdits) => ({
                        ...colorEdits,
                        ...{ tlg_id: e.target.valueAsNumber },
                      }))
                    }
                  />
                  <div>LEGO</div>
                </div>
                <div>
                  {/* <div className="color-id">{color?.bl_id}</div> */}
                  <input
                    maxLength={6}
                    className="edit-id-input"
                    defaultValue={color?.bl_id}
                    type="number"
                    onChange={(e) =>
                      setColorEdits((colorEdits) => ({
                        ...colorEdits,
                        ...{ bl_id: e.target.valueAsNumber },
                      }))
                    }
                  />
                  <div>Brickowl</div>
                </div>
                <div>
                  <div className="color-id">{color?.id}</div>
                  <div>QID</div>
                </div>
              </div>
              <div className="color-detail-header">
                <span>Name</span>
              </div>
              <div style={{ width: "90%" }}>
                <div className="d-flex align-center">
                  <div className="col-det-name ">Bricklink</div>
                  {/* <div className=" col-det-colname">{color?.bl_name}</div> */}
                  <input
                    maxLength={100}
                    defaultValue={color?.bl_name}
                    onChange={(e) =>
                      setColorEdits((colorEdits) => ({
                        ...colorEdits,
                        ...{ bl_name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="d-flex align-center">
                  <div className="col-det-name ">LEGO</div>
                  {/* <div className=" col-det-colname">{color?.tlg_name}</div> */}
                  <input
                    maxLength={100}
                    defaultValue={color?.tlg_name}
                    onChange={(e) =>
                      setColorEdits((colorEdits) => ({
                        ...colorEdits,
                        ...{ tlg_name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="d-flex align-center">
                  <div className="col-det-name ">Brickowl</div>
                  {/* <div className=" col-det-colname">{color?.bo_name}</div> */}
                  <input
                    maxLength={100}
                    defaultValue={color?.bo_name}
                    onChange={(e) =>
                      setColorEdits((colorEdits) => ({
                        ...colorEdits,
                        ...{ bo_name: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="color-detail-header">
                <span>Other Details</span>
              </div>
              <div
                className="w-90 d-flex jc-space-b"
                style={{ width: "90%", marginTop: "1em" }}
              >
                <label htmlFor="type">Type</label>
                <select
                  name="type"
                  id="type"
                  className="formInput"
                  onChange={(e) =>
                    setColorEdits((colorEdits) => ({
                      ...colorEdits,
                      ...{ type: e.target.value },
                    }))
                  }
                  defaultValue={color?.type}
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
              <div className="color-detail-header">
                <span>Note</span>
              </div>
              {/* <div className="col-det-note">{color?.note}</div> */}
              <textarea
                style={{ marginTop: "1em" }}
                maxLength={255}
                className="edit-note"
                defaultValue={color?.note}
                onChange={(e) =>
                  setColorEdits((colorEdits) => ({
                    ...colorEdits,
                    ...{ note: e.target.value },
                  }))
                }
              />
            </div>
            <button
              id="save-edits"
              onClick={() => {
                // similarColorMutation.mutate({
                //   color_one: Number(colorId),
                //   color_two: similarColorToAdd,
                // });
                applyChanges();
              }}
            >
              Save Changes
            </button>
          </section>
        </div>
      </>
    );
  else return <p>Loading...</p>;
}
