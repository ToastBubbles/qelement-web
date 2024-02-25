import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import {
  ICategory,
  IElementID,
  IIdAndNumber,
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
interface IPartEdits {
  id: number;
  name: string;
  catId: number;
  blURL: string;
}

export default function PartEditView() {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const defaultPartValues: IPartEdits = {
    id: -1,
    name: "",
    catId: -1,
    blURL: "",
  };

  const [readyToDelete, setReadyToDelete] = useState<boolean>(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] =
    useState<boolean>(false);
  const { partId } = useParams();
  const [newPartValues, setNewPartValues] =
    useState<IPartEdits>(defaultPartValues);
  const partMutation = useMutation({
    mutationFn: (edits: IPartEdits) =>
      axios.post(`http://localhost:3000/parts/edit`, edits, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Part changes saved!", Mode.Success);
        setNewPartValues(defaultPartValues);
        refetch();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  const { data: partData, refetch } = useQuery({
    queryKey: `part${partId}`,
    queryFn: () => {
      return axios.get<part>(`http://localhost:3000/parts/id/${partId}`);
    },

    staleTime: 0,
    enabled: !!partId && Number(partId) > 0,
    // retry: false,
  });

  const partDeletionMutation = useMutation({
    mutationFn: ({ id }: iIdOnly) =>
      axios.post(
        `http://localhost:3000/parts/deny`,
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
        showToast("Part Deleted!", Mode.Success);
        setNewPartValues(defaultPartValues);
      } else if (e.data.code == 509) {
        showToast(
          "Part has children that need to be deleted first!",
          Mode.Error
        );
      } else {
        showToast("error", Mode.Error);
      }
    },
  });
  const { data: catData } = useQuery("allCats", () =>
    axios.get<ICategory[]>("http://localhost:3000/categories")
  );

  useEffect(() => {
    if (Number(partId) > 0)
      setNewPartValues((newPartValues) => ({
        ...newPartValues,
        ...{ id: Number(partId) },
      }));
  }, [partId]);
  if (partData && catData) {
    let categories = catData.data;
    let thisPart = partData.data;
    return (
      <div className="formcontainer">
        <h1>Edit Part</h1>
        <div className="mainform">
          <div className="info-box">
            <h3>Original Values</h3>
            <div className="d-flex jc-space-b">
              <div>Name:</div> <div>{thisPart.name}</div>
            </div>
            <div className="d-flex jc-space-b">
              <div>Category:</div> <div>{thisPart.category.name}</div>
            </div>
            <div className="d-flex jc-space-b">
              <div>Bricklink URL Param:</div> <div>{thisPart.blURL}</div>
            </div>
            <div className="d-flex jc-center">
              <a
                href={`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${
                  newPartValues.blURL.length > 0
                    ? newPartValues.blURL
                    : thisPart.blURL
                }`}
                className="link"
                target="_blank"
                style={{ paddingTop: "1em", textDecoration: "underline" }}
              >
                Test Bricklink param in new tab (using{" "}
                {newPartValues.blURL.length > 0
                  ? newPartValues.blURL
                  : thisPart.blURL}
                )
              </a>
            </div>
          </div>

          <div className="w-100" style={{ marginTop: "2em" }}>
            <div className="d-flex jc-space-b">
              <label htmlFor="name">New Part Name</label>
              <input
                name="name"
                className="formInput w-33"
                type="text"
                placeholder={thisPart.name}
                onChange={(e) =>
                  setNewPartValues((newPartValues) => ({
                    ...newPartValues,
                    ...{ name: e.target.value },
                  }))
                }
                value={newPartValues.name}
              />
            </div>
            <div className="d-flex jc-space-b">
              <div>New Category:</div>
              <select
                value={newPartValues.catId}
                className={"formInput w-33"}
                onChange={(e) =>
                  setNewPartValues((newPartValues) => ({
                    ...newPartValues,
                    ...{ catId: Number(e.target.value) },
                  }))
                }
              >
                <option value={-1} className="grey-txt">
                  - Unchanged -
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex jc-space-b">
              <label htmlFor="blurl">New Bricklink URL Parameter</label>
              <input
                name="blurl"
                className="formInput w-33"
                type="text"
                placeholder={thisPart.blURL}
                onChange={(e) =>
                  setNewPartValues((newPartValues) => ({
                    ...newPartValues,
                    ...{ blURL: e.target.value },
                  }))
                }
                value={newPartValues.blURL}
              />
            </div>
            <div className="d-flex w-100 jc-center">
              <button onClick={() => submitNewPartValues(thisPart)}>
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
            <div style={{ padding: "2em 0" }}>Delete this part</div>
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
                partDeletionMutation.mutate({ id: newPartValues.id });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  function submitNewPartValues(part: part) {
    if (
      newPartValues.id > 0 &&
      (newPartValues.name.length > 0 ||
        newPartValues.blURL.length > 0 ||
        newPartValues.catId > 0)
    ) {
      // console.log("changes:", newPartValues);

      partMutation.mutate(newPartValues);
    } else {
      showToast("No changes were made.", Mode.Warning);
      console.log(newPartValues);
    }
  }
}
