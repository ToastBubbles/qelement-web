import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import {
  ICategory,
  IElementID,
  IIdAndNumber,
  IPartMoldDTO,
  iIdOnly,
  part,
} from "../../../interfaces/general";
import { AppContext } from "../../../context/context";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import showToast, { Mode } from "../../../utils/utils";

// interface IProps {
//   part: part;
//   closePopup: () => void;
//   refetchFn: () => void;
// }
interface IMoldEdits {
  id: number;
  number: string;
  parentPartId: number;
  note: string;
}

export default function MoldEditView() {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const defaultMoldValues: IMoldEdits = {
    id: -1,
    number: "",
    parentPartId: -1,
    note: "",
  };
  const { moldId } = useParams();
  const [readyToDelete, setReadyToDelete] = useState<boolean>(false);
  const [hasWarned, setHasWarned] = useState<boolean>(false);
  const [categoryID, setCategoryID] = useState<number>(-1);
  const [associatedQPartIDs, setAssociatedQPartIDs] = useState<number[]>([]);
  const [deleteButtonDisabled, setDeleteButtonDisabled] =
    useState<boolean>(false);

  const [newMoldValues, setNewMoldValues] =
    useState<IMoldEdits>(defaultMoldValues);
  const moldMutation = useMutation({
    mutationFn: (edits: IMoldEdits) =>
      axios.post(`http://localhost:3000/partMold/edit`, edits, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Mold changes saved!", Mode.Success);
        setNewMoldValues(defaultMoldValues);
        setNewMoldValues((newMoldValues) => ({
          ...newMoldValues,
          ...{ id: Number(moldId) },
        }));
        refetch();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  const { data: moldData, refetch } = useQuery({
    queryKey: `mold${moldId}`,
    queryFn: () => {
      return axios.get<IPartMoldDTO>(
        `http://localhost:3000/partMold/id/${moldId}`
      );
    },

    staleTime: 0,
    enabled: !!moldId && Number(moldId) > 0,
    // retry: false,
  });

  const moldDeletionMutation = useMutation({
    mutationFn: ({ id }: iIdOnly) =>
      axios.post(
        `http://localhost:3000/partMold/deny`,
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
        showToast("Mold Deleted!", Mode.Success);
        setNewMoldValues(defaultMoldValues);
      } else if (e.data.code == 400) {
        setAssociatedQPartIDs(e.data.ids);
        let idsString = e.data.ids.map((id: number) => `${id}`).join(", ");
        showToast(`${e.data.message} IDs: ${idsString}`, Mode.Error);
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
    if (Number(moldId) > 0)
      setNewMoldValues((newMoldValues) => ({
        ...newMoldValues,
        ...{ id: Number(moldId) },
      }));
  }, [moldId]);
  useEffect(() => {
    if (categoryID > 0) partsRefetch();
    else
      setNewMoldValues((newMoldValues) => ({
        ...newMoldValues,
        ...{ parentPartId: -1 },
      }));
  }, [categoryID]);

  if (
    moldData &&
    catData &&
    moldData.data != null &&
    typeof moldData.data != "string"
  ) {
    let myMold = moldData.data;
    let categories = catData.data;
    let myParts = partsData?.data;

    console.log("moldData:", moldData);

    return (
      <div className="formcontainer">
        <h1>Edit Mold</h1>
        <div className="mainform">
          <div className="info-box">
            <h3>Original Values</h3>
            <div className="d-flex jc-space-b">
              <div>Number:</div> <div>{myMold.number}</div>
            </div>
            <div className="d-flex jc-space-b">
              <div>Parent Part:</div> <div>{myMold.parentPart.name}</div>
            </div>
            <div className="d-flex jc-space-b">
              <div>Note:</div> <div>{myMold.note}</div>
            </div>
          </div>

          <div className="w-100" style={{ marginTop: "2em" }}>
            <div className="d-flex jc-space-b">
              <label htmlFor="number">New Part Number:</label>
              <input
                name="number"
                className="formInput w-33"
                type="text"
                placeholder={myMold.number}
                onChange={(e) =>
                  setNewMoldValues((newMoldValues) => ({
                    ...newMoldValues,
                    ...{ number: e.target.value },
                  }))
                }
                value={newMoldValues.number}
              />
            </div>
            <div className="d-flex jc-space-b">
              <label htmlFor="parentPart">New Parent Part:</label>
              <select
                value={categoryID}
                className={"formInput w-33"}
                onChange={(e) => {
                  //   setNewMoldValues((newMoldValues) => ({
                  //     ...newMoldValues,
                  //     ...{ catId: Number(e.target.value) },
                  //   }))
                  setCategoryID(Number(e.target.value));
                  setNewMoldValues((newMoldValues) => ({
                    ...newMoldValues,
                    ...{ parentPartId: -1 },
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
                value={newMoldValues.parentPartId}
                className={"formInput w-33"}
                onChange={(e) => {
                  setNewMoldValues((newMoldValues) => ({
                    ...newMoldValues,
                    ...{ parentPartId: Number(e.target.value) },
                  }));
                  if (!hasWarned) {
                    showToast(
                      "Changing this will affect all QParts using this mold!",
                      Mode.Warning
                    );
                    setHasWarned(true);
                  }
                }}
                disabled={categoryID == -1}
              >
                <option value={-1} className="grey-txt">
                  - Unchanged -
                </option>
                {myParts &&
                  myParts.map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.name} ({getMoldsAsString(part.molds)})
                    </option>
                  ))}
              </select>
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
                placeholder={myMold.note}
                onChange={(e) =>
                  setNewMoldValues((newMoldValues) => ({
                    ...newMoldValues,
                    ...{ note: e.target.value },
                  }))
                }
                value={newMoldValues.note}
              />
            </div>
            <div className="d-flex w-100 jc-center">
              <button onClick={() => submitNewMoldValues()}>
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
            <div style={{ padding: "2em 0" }}>Delete this mold</div>
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
                moldDeletionMutation.mutate({ id: newMoldValues.id });
              }}
            >
              Delete
            </button>
          </div>
          <div style={{ marginTop: "2em" }} className="d-flex flex-col">
            {associatedQPartIDs.length > 0 &&
              associatedQPartIDs.map((qpartID) => (
                <Link className="black-txt" to={`/edit/qpart/${qpartID}`}>
                  QPart with ID {qpartID}
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="formcontainer">
        <div className="mainform" style={{ marginTop: "5em" }}>
          Mold not found.
        </div>
      </div>
    );
  }

  function submitNewMoldValues() {
    if (
      newMoldValues.id > 0 &&
      (newMoldValues.number.length > 0 ||
        newMoldValues.note.length > 0 ||
        newMoldValues.parentPartId > 0)
    ) {
      // console.log("changes:", newMoldValues);

      moldMutation.mutate(newMoldValues);
    } else {
      showToast("No changes were made.", Mode.Warning);
      console.log(newMoldValues);
    }
  }

  function getMoldsAsString(molds: IPartMoldDTO[]): string {
    if (molds.length == 0) return "No molds";
    let output = "";

    for (let mold of molds) {
      output += mold.number + " ";
    }

    return output.trim();
  }
}
