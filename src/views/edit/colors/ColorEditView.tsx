import axios from "axios";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate, useParams } from "react-router";
import SimilarColorBanner from "../../../components/SimilarColorBanner";
import {
  IColorDTO,
  ISimilarColorDTO,
  IEditColor,
  IAPIResponse,
  colorWSimilar,
  ISimilarColor,
  iIdOnly,
} from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import { AppContext } from "../../../context/context";
import ColorTextField from "../../../components/ColorTextField";
import ColorLink from "../../../components/ColorLink";
import ConfirmPopup from "../../../components/ConfirmPopup";

export default function ColorEditView() {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);
  const { colorId } = useParams();
  const [similarColorToAdd, setSimilarColorToAdd] = useState<number>(0);
  const [resetColorComponent, setResetColorComponent] = useState(false);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [simColId, setSimColId] = useState<number>(0);
  const navigate = useNavigate();

  const {
    data: colData,

    error: colError,
    refetch,
  } = useQuery({
    queryKey: "color",
    queryFn: () =>
      axios.get<colorWSimilar>(`http://localhost:3000/color/id/${colorId}`),
    enabled: true,
    retry: false,
  });

  const colorMutation = useMutation({
    mutationFn: ({
      bl_name,
      tlg_name,
      bo_name,
      swatchId,
      hex,
      bl_id,
      bo_id,
      tlg_id,
      type,
      note,
    }: IColorDTO) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/color/edit/${color?.id}`,
        {
          bl_name,
          tlg_name,
          bo_name,
          hex,
          swatchId,
          bl_id,
          bo_id,
          tlg_id,
          type,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) showToast("Changes saved!", Mode.Success);
      else showToast("Changes were not saved, please check fields", Mode.Error);
    },
  });

  const similarColorMutation = useMutation({
    mutationFn: ({ color_one, color_two }: ISimilarColor) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/similarColor/add`,
        {
          color_one,
          color_two,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      console.log(e.data);

      if (e.data.code == 200) {
        showToast("Similar Color Pair added!", Mode.Success);
        refetch();
        handleResetComponent();
      } else if (e.data.code == 201) {
        showToast("Similar Color Pair restored!", Mode.Success);
        refetch();
        handleResetComponent();
      } else if (e.data.code == 202) {
        showToast("Similar Color Pair submitted!", Mode.Success);
        handleResetComponent();
      } else if (e.data.code == 501) {
        showToast(
          "Similar Color Relationship already exist between these colors, it may be pending approval",
          Mode.Warning
        );
      } else if (e.data.code == 502) {
        showToast(
          "Color does not exist, please make sure you are using the QID",
          Mode.Error
        );
      } else {
        showToast(
          "Failed to add Similar Color. Make sure you are using the QID",
          Mode.Error
        );
      }
    },
  });

  const similarColorDeletionMutation = useMutation({
    mutationFn: (data: iIdOnly) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/similarColor/deny`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Similar Color Pair removed!", Mode.Success);
        refetch();
        closePopup();
      } else {
        showToast("Failed to delete Similar Color.", Mode.Error);
      }
    },
  });

  const handleResetComponent = () => {
    setResetColorComponent(true);
    setTimeout(() => {
      setResetColorComponent(false);
    }, 0);
  };
  if (colError) {
    navigate("/404");
  }
  const color = colData?.data;
  const hex = "#" + color?.hex;

  const [colorEdits, setColorEdits] = useState<IEditColor>({
    bl_name: "unchanged",
    tlg_name: "unchanged",
    bo_name: "unchanged",
    hex: "unchanged",
    swatchId: -1,
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
    if (colorEdits.bo_id !== -1) {
      console.log("changed bo id");
      containsValidEdits = true;
    }
    if (colorEdits.swatchId !== -1) {
      console.log("changed swatch id");
      containsValidEdits = true;
    }

    console.log(containsErrors);
    console.log(colorEdits);

    if (containsValidEdits && !containsErrors) {
      console.log("saved changes");
      colorMutation.mutate({
        bl_name: colorEdits.bl_name,
        tlg_name: colorEdits.tlg_name,
        bo_name: colorEdits.bo_name,
        hex: colorEdits.hex,
        swatchId: colorEdits.swatchId,
        bl_id: colorEdits.bl_id,
        bo_id: colorEdits.bo_id,
        tlg_id: colorEdits.tlg_id,
        type: colorEdits.type,
        note: colorEdits.note,
        creatorId: payload.id,
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
  if (color) {
    const name = color?.bl_name.length == 0 ? color.tlg_name : color?.bl_name;

    return (
      <div className="mx-w">
        {showPopup && (
          <ConfirmPopup
            delayBtn={true}
            content="Are you sure you want to delete this Color Relationship?"
            fn={simColDelete}
            closePopup={closePopup}
          />
        )}
        <div className="colorTop">
          <div className="colorName">{name}</div>

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

        <SimilarColorBanner similarColors={color.similar} />

        <div className="color-container">
          <section>
            Similar Colors:
            {color.similar.map((col) => {
              return (
                <div
                  key={col.id}
                  className="clickable"
                  onClick={() => {
                    setSimColId(col.SimilarColor.id);
                    setShowPopup(true);
                  }}
                >
                  <ColorLink color={col} deleteMode={true} />
                </div>
              );
            })}
          </section>
          <section>
            <div className="edit-similarity">
              <ColorTextField
                setter={setSimilarColorToAdd}
                reset={resetColorComponent}
              />
              <button
                onClick={() => {
                  console.log(Number(colorId), similarColorToAdd);

                  if (
                    Number(colorId) != similarColorToAdd &&
                    payload.id &&
                    payload.id != -1
                  ) {
                    similarColorMutation.mutate({
                      color_one: Number(colorId),
                      color_two: similarColorToAdd,
                    });
                  } else {
                    showToast(
                      `Yes, I'm sure that ${name} is very similar to ${name}, but you need to use a different color.`,
                      Mode.Info
                    );
                  }
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
                    defaultValue={color?.bo_id}
                    type="number"
                    onChange={(e) =>
                      setColorEdits((colorEdits) => ({
                        ...colorEdits,
                        ...{ bo_id: e.target.valueAsNumber },
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
              <div
                className="w-90 d-flex jc-space-b"
                style={{ width: "90%", marginTop: "1em", marginBottom: "1em" }}
              >
                <label htmlFor="swatch">Swatch ID</label>
                <input
                  maxLength={10}
                  className="swatch-input"
                  defaultValue={color?.swatchId}
                  type="number"
                  onChange={(e) =>
                    setColorEdits((colorEdits) => ({
                      ...colorEdits,
                      ...{ swatchId: e.target.valueAsNumber },
                    }))
                  }
                />
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
                applyChanges();
              }}
            >
              Save Changes
            </button>
          </section>
        </div>
      </div>
    );
  } else return <p>Loading...</p>;

  function closePopup() {
    setShowPopup(false);
  }

  function simColDelete() {
    if (simColId > 0) similarColorDeletionMutation.mutate({ id: simColId });
    else showToast("Error deleting Similar Color!", Mode.Error);
  }
}
