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
} from "../../../interfaces/general";

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
      tlg_id,
      type,
      note,
    }: IColorDTO) =>
      axios.post<color>(`http://localhost:3000/color/id/${color?.id}`, {
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
    tlg_id: -1,
    type: "unchanged",
    note: "unchanged",
  });

  return (
    <>
      <div className="colorTop">
        <div className="colorName">
          {!colIsLoading && colData ? (
            color?.bl_name.length == 0 ? (
              color.tlg_name
            ) : (
              color?.bl_name
            )
          ) : (
            <p>loading...</p>
          )}
        </div>
        <div className="hexbar" style={{ backgroundColor: hex }}>
          #
          <input
            maxLength={6}
            className="edit-hex"
            defaultValue={color?.hex}
            onChange={(e) =>
              setColorEdits((colorEdits) => ({
                ...colorEdits,
                ...{ hex: e.target.value },
              }))
            }
          />
        </div>
      </div>
      <div className="fake-hr"></div>
      {!simIsLoading && simData ? (
        <SimilarColorBanner similarColors={simData.data} />
      ) : (
        <p>loading...</p>
      )}

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
              <span>Note</span>
            </div>
            {/* <div className="col-det-note">{color?.note}</div> */}
            <textarea
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
              applyChanges(color, colorEdits, colorMutation);
            }}
          >
            Save Changes
          </button>
        </section>
      </div>
    </>
  );
}

function applyChanges(
  thisColor: color | undefined,
  edits: IEditColor,
  mut: UseMutationResult<AxiosResponse<color, any>, unknown, IColorDTO, unknown>
) {
  if (thisColor == undefined) return;

  let containsValidEdits = false;
  let containsErrors = false;
  if (edits.bl_name !== "unchanged") {
    console.log("changed bl name");
    containsValidEdits = true;
  }
  if (edits.tlg_name !== "unchanged") {
    console.log("changed tlg name");
    containsValidEdits = true;
  }
  if (edits.bo_name !== "unchanged") {
    console.log("changed bo name");
    containsValidEdits = true;
  }
  if (edits.hex !== "unchanged") {
    if (edits.hex.length == 6) {
      console.log("changed hex");
      containsValidEdits = true;
    } else {
      containsErrors = true;
    }
  }
  if (edits.note !== "unchanged") {
    console.log("changed note");
    containsValidEdits = true;
  }
  if (edits.bl_id !== -1) {
    console.log("changed bl id");
    containsValidEdits = true;
  }
  if (edits.tlg_id !== -1) {
    console.log("changed tlg id");
    containsValidEdits = true;
  }

  console.log(containsErrors);

  if (containsValidEdits && !containsErrors) {
    console.log("saved changes");
    mut.mutate({
      bl_name: edits.bl_name,
      tlg_name: edits.tlg_name,
      bo_name: edits.bo_name,
      hex: edits.hex,
      bl_id: edits.bl_id,
      tlg_id: edits.tlg_id,
      type: edits.type,
      note: edits.note,
    });
  }
}
