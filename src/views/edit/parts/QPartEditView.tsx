import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import {
  ICategory,
  IElementID,
  IIdAndNumber,
  IPartMoldDTO,
  IQPartDTOInclude,
  color,
  iIdOnly,
  part,
} from "../../../interfaces/general";
import { AppContext } from "../../../context/context";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import showToast, { Mode } from "../../../utils/utils";
import ColorDetails from "../../../components/Approval Componenents/ColorDetails";
import ColorLink from "../../../components/ColorLink";
import ColorTextField from "../../../components/ColorTextField";

interface IQPartEdits {
  id: number;
  type: string;
  moldId: number;
  colorId: number;
  isMoldUnknown: number; //three state boolean -1 = false, 1 = true, 0 = unchanged
  note: string;
}

export default function QPartEditView() {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const defaultQPartValues: IQPartEdits = {
    id: -1,
    type: "",
    moldId: -1,
    colorId: -1,
    isMoldUnknown: 0,
    note: "",
  };
  const { qpartId } = useParams();
  const [readyToDelete, setReadyToDelete] = useState<boolean>(false);
  //   const [hasWarned, setHasWarned] = useState<boolean>(false);
  const [categoryID, setCategoryID] = useState<number>(-1);
  const [partID, setPartID] = useState<number>(-1);
  //   const [associatedQPartIDs, setAssociatedQPartIDs] = useState<number[]>([]);
  const [deleteButtonDisabled, setDeleteButtonDisabled] =
    useState<boolean>(false);
  const [molds, setMolds] = useState<IPartMoldDTO[]>();
  const [newQPartValues, setNewQPartValues] =
    useState<IQPartEdits>(defaultQPartValues);
  const [resetColorComponent, setResetColorComponent] = useState(false);

  const handleResetComponent = () => {
    setResetColorComponent(true);
    setTimeout(() => {
      setResetColorComponent(false);
    }, 0);
  };
  const qpartMutation = useMutation({
    mutationFn: (edits: IQPartEdits) =>
      axios.post(`http://localhost:3000/qPart/edit`, edits, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("QPart changes saved!", Mode.Success);
        setNewQPartValues(defaultQPartValues);
        setNewQPartValues((newQPartValues) => ({
          ...newQPartValues,
          ...{ id: Number(qpartId) },
        }));
        handleResetComponent();
        refetch();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  const { data: colData } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  const { data: qpartData, refetch } = useQuery({
    queryKey: `qpart${qpartId}`,
    queryFn: () => {
      return axios.get<IQPartDTOInclude>(
        `http://localhost:3000/qPart/id/${qpartId}`
      );
    },

    staleTime: 0,
    enabled: !!qpartId && Number(qpartId) > 0,
    // retry: false,
  });

  const qpartDeletionMutation = useMutation({
    mutationFn: ({ id }: iIdOnly) =>
      axios.post(
        `http://localhost:3000/qPart/deny`,
        {
          id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("QPart Deleted!", Mode.Success);
        setNewQPartValues(defaultQPartValues);
      } else if (e.data.code == 400) {
        // setAssociatedQPartIDs(e.data.ids);
        // let idsString = e.data.ids.map((id: number) => `${id}`).join(", ");
        // showToast(`${e.data.message} IDs: ${idsString}`, Mode.Error);
      } else {
        showToast("error", Mode.Error);
      }
      setReadyToDelete(false);
      setDeleteButtonDisabled(true);
    },
  });
  const { data: catData } = useQuery("allCats", () =>
    axios.get<ICategory[]>("http://localhost:3000/categories")
  );

  const { data: partsData, refetch: partsRefetch } = useQuery({
    queryKey: `partsWithCat${categoryID}`,
    queryFn: () =>
      axios.get<part[]>(`http://localhost:3000/parts/byCatId/${categoryID}`),
    enabled: false,
  });

  useEffect(() => {
    if (Number(qpartId) > 0)
      setNewQPartValues((newQPartValues) => ({
        ...newQPartValues,
        ...{ id: Number(qpartId) },
      }));
  }, [qpartId]);

  useEffect(() => {
    if (partsData) {
      const thesemolds = partsData.data.find((x) => x.id == partID);
      if (thesemolds) setMolds(thesemolds.molds);
    }
  }, [partID, partsData]);

  useEffect(() => {
    if (categoryID > 0) partsRefetch();
    else setPartID(-1);
  }, [categoryID]);

  if (
    colData &&
    qpartData &&
    catData &&
    qpartData.data != null &&
    typeof qpartData.data != "string"
  ) {
    let colors = colData.data;
    let myQPart = qpartData.data;
    let categories = catData.data;
    let myParts = partsData?.data;

    console.log("qpartData:", qpartData);

    return (
      <div className="formcontainer">
        <h1>Edit QPart</h1>
        <div className="mainform">
          <div className="info-box">
            <h3>Original Values</h3>
            <div className="d-flex jc-space-b">
              <div>Type:</div> <div>{myQPart.type}</div>
            </div>
            <div className="d-flex jc-space-b">
              <div>Mold:</div>{" "}
              <div>
                {myQPart.mold.number} ({myQPart.mold.parentPart.name})
              </div>
            </div>
            <div className="d-flex jc-space-b">
              <div>Is Mold Unknown?</div>{" "}
              <div>{myQPart.isMoldUnknown.toString()}</div>
            </div>
            <div className="d-flex jc-space-b">
              <div>Color:</div>{" "}
              <div>
                <ColorLink color={myQPart.color} />
              </div>
            </div>
            <div className="d-flex jc-space-b">
              <div>Note:</div> <div>{myQPart.note}</div>
            </div>
          </div>

          <div className="w-100" style={{ marginTop: "2em" }}>
            <div className="d-flex jc-space-b">
              <label htmlFor="number">Change Type:</label>
              <select
                value={newQPartValues.type}
                className={"formInput w-33"}
                onChange={(e) =>
                  setNewQPartValues((newQPartValues) => ({
                    ...newQPartValues,
                    ...{ type: e.target.value },
                  }))
                }
              >
                <option value={-1} className="grey-txt">
                  - Unchanged -
                </option>
                <option value={"unknown"}>Unknown</option>
                <option value={"qelement"}>Q-Element</option>
                <option value={"prototype"}>Prototype</option>
                <option value={"test"}>Test part</option>
                <option value={"employee"}>Employee Gift</option>
                <option value={"nightshift"}>Nightshift</option>
                <option value={"other"}>Other</option>
              </select>
            </div>
            <div className="d-flex jc-space-b">
              <label htmlFor="parentPart">Change Mold:</label>
              <select
                value={categoryID}
                className={"formInput w-33"}
                onChange={(e) => {
                  //   setNewQPartValues((newQPartValues) => ({
                  //     ...newQPartValues,
                  //     ...{ catId: Number(e.target.value) },
                  //   }))
                  setCategoryID(Number(e.target.value));
                  setNewQPartValues((newQPartValues) => ({
                    ...newQPartValues,
                    ...{ moldId: -1 },
                  }));
                }}
              >
                <option value={-1} className="grey-txt">
                  - Category -
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex jc-end">
              <select
                name="parentPart"
                value={partID}
                className={"formInput w-33"}
                onChange={(e) => {
                  setPartID(Number(e.target.value));
                  setNewQPartValues((newQPartValues) => ({
                    ...newQPartValues,
                    ...{ moldId: -1 },
                  }));
                  //   if (!hasWarned) {
                  //     showToast(
                  //       "Changing this will affect all QParts using this QPart!",
                  //       Mode.Warning
                  //     );
                  //     setHasWarned(true);
                  //   }
                }}
                disabled={categoryID == -1}
              >
                <option value={-1} className="grey-txt">
                  - Part -
                </option>
                {myParts &&
                  myParts.map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="d-flex jc-end">
              <select
                name="partmold"
                id="partmold"
                className="w-33 formInput"
                style={{ marginBottom: "1em" }}
                onChange={(e) =>
                  setNewQPartValues((newQPartValues) => ({
                    ...newQPartValues,
                    ...{ moldId: Number(e.target.value) },
                  }))
                }
                disabled={partID == -1}
                value={newQPartValues.moldId}
              >
                <option value="-1">- Unchanged -</option>
                {molds?.map((mold) => (
                  <option key={mold.id} value={`${mold.id}`}>
                    {mold.number}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex jc-space-b">
              <label htmlFor="unknown">Change Mold is Unknown?</label>
              <select
                name="unknown"
                value={newQPartValues.isMoldUnknown}
                className={"formInput w-33"}
                onChange={(e) => {
                  setNewQPartValues((newQPartValues) => ({
                    ...newQPartValues,
                    ...{ isMoldUnknown: Number(e.target.value) },
                  }));
                }}
              >
                <option value={0} className="grey-txt">
                  - Unchanged -
                </option>
                <option value={-1}>False</option>
                <option value={1}>True</option>
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="par">Color</label>
              <ColorTextField
                setter={(newColorId) =>
                  setNewQPartValues((newQPartValues) => ({
                    ...newQPartValues,
                    ...{ colorId: newColorId },
                  }))
                }
                reset={resetColorComponent}
                // customStyles={colorInputSyles}
              />
            </div>
            <div className="d-flex jc-space-b">
              <label htmlFor="note" className="fg-1">
                New Note:
              </label>
            </div>
            <div className="w-100">
              <textarea
                maxLength={255}
                id="satusnote"
                name="note"
                className="w-100 formInput"
                rows={5}
                placeholder={myQPart.note}
                onChange={(e) =>
                  setNewQPartValues((newQPartValues) => ({
                    ...newQPartValues,
                    ...{ note: e.target.value },
                  }))
                }
                value={newQPartValues.note}
              />
            </div>
            <div className="d-flex w-100 jc-center">
              <button onClick={() => submitNewQPartValues()}>
                Submit Changes
              </button>
            </div>
          </div>

          <div className="fake-hr"></div>

          <div
            className={
              "d-flex flex-col ai-center" + (readyToDelete ? " hidden" : "")
            }
          >
            <div style={{ padding: "2em 0" }}>Delete this QPart</div>
            <button
              onClick={() => {
                setReadyToDelete(true);
                setDeleteButtonDisabled(true);
                setTimeout(() => {
                  setDeleteButtonDisabled(false);
                }, 1500);
              }}
            >
              Delete...
            </button>
          </div>

          <div
            className={
              "d-flex flex-col ai-center" + (readyToDelete ? "" : " hidden")
            }
          >
            <div style={{ padding: "2em 0" }}>Are you sure?</div>
            <button
              disabled={deleteButtonDisabled}
              onClick={() => {
                qpartDeletionMutation.mutate({ id: newQPartValues.id });
              }}
            >
              Delete
            </button>
          </div>
          {/* <div style={{ marginTop: "2em" }} className="d-flex flex-col">
            {associatedQPartIDs.length > 0 &&
              associatedQPartIDs.map((qpartID) => (
                <Link className="black-txt" to={`/edit/qpart/${qpartID}`}>
                  QPart with ID {qpartID}
                </Link>
              ))}
          </div> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="formcontainer">
        <div className="mainform" style={{ marginTop: "5em" }}>
          QPart not found.
        </div>
      </div>
    );
  }

  function submitNewQPartValues() {
    if (
      newQPartValues.id > 0 &&
      (newQPartValues.type.length > 0 ||
        newQPartValues.note.length > 0 ||
        newQPartValues.moldId > 0 ||
        newQPartValues.colorId > 0 ||
        newQPartValues.isMoldUnknown != 0)
    ) {
      // console.log("changes:", newQPartValues);

      qpartMutation.mutate(newQPartValues);
    } else {
      showToast("No changes were made.", Mode.Warning);
      console.log(newQPartValues);
    }
  }

  //   function getQPartsAsString(qparts: IPartQPartDTO[]): string {
  //     if (qparts.length == 0) return "No molds";
  //     let output = "";

  //     for (let mold of molds) {
  //       output += mold.number + " ";
  //     }

  //     return output.trim();
  //   }
}
