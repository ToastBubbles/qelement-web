import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  part,
  IPartWithMoldDTO,
  IAPIResponse,
  ICategory,
  ICategoryWParts,
} from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import MyToolTip from "../../../components/MyToolTip";
import { AppContext } from "../../../context/context";
interface ICatDTO {
  name: string;
  creatorId: number;
}
export default function AddPartView() {
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);
  const defaultValue: IPartWithMoldDTO = {
    id: -1,
    name: "",
    number: "",
    catId: -1,
    partNote: "",
    moldNote: "",
    blURL: "",
    creatorId: -1,
  };
  const [newPart, setNewPart] = useState<IPartWithMoldDTO>(defaultValue);
  // const [partNo, setPartNo] = useState<number>(-1);
  const [newCategory, setNewCategory] = useState<string>("");
  const [isNewPart, setIsNewPart] = useState<boolean>(false);
  const {
    data: catData,
    isFetched,
    refetch,
  } = useQuery("allCats", () =>
    axios.get<ICategoryWParts[]>("http://localhost:3000/categories")
  );
  useEffect(() => {
    setNewPart((newPart) => ({
      ...newPart,
      ...{ creatorId: payload.id },
    }));
  }, [payload]);

  const partMutation = useMutation({
    mutationFn: (part: IPartWithMoldDTO) =>
      axios.post<part>(`http://localhost:3000/parts/add`, part, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      showToast("Part submitted for approval!", Mode.Success);
      setNewPart((prevPart) => ({
        ...defaultValue,
        creatorId: prevPart.creatorId,
      }));
    },
  });

  const catMutation = useMutation({
    mutationFn: (data: ICatDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/categories/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

    onSuccess: (e) => {
      console.log("e", e.data);
      if (e.data.code == 200) {
        setNewCategory("");
        refetch();
        showToast("Category added!", Mode.Success);
      } else if (e.data.code == 201) {
        setNewCategory("");
        showToast("Category submitted for approval!", Mode.Success);
      } else if (e.data.code == 505) {
        showToast("Category already pending approval", Mode.Warning);
      } else if (e.data.code == 506) {
        showToast("Category already exists", Mode.Warning);
      } else {
        showToast("Error adding category", Mode.Error);
      }
    },
  });
  const handleCheckbox = () => {
    setIsNewPart(!isNewPart);
  };
  if (isFetched && catData) {
    const selcat = catData.data.find((x) => x.id == newPart.catId);
    return (
      <>
        <div className="formcontainer">
          <h1>add new part</h1>
          <div className="mainform">
            <div className="w-100 d-flex jc-space-b">
              <div>
                Add a new part number/mold to an existing part?
                <MyToolTip
                  content={
                    <div style={{ maxWidth: "25em" }}>
                      Use this checkbox if the part already exists and you would
                      like to add a new part number/mold variation. Example: You
                      would check this box if you were adding part number 3556
                      to the already existing Brick 2 x 4 (3001).
                    </div>
                  }
                  id={"existing"}
                />
              </div>
              <input
                type="checkbox"
                className="formInput"
                style={{
                  width: "1.4em",
                  height: "1.4em",
                }}
                checked={isNewPart}
                onChange={handleCheckbox}
              />
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="cat">Category</label>
              <select
                name="cat"
                id="cat"
                className="w-50 formInput"
                onChange={(e) =>
                  setNewPart((newPart) => ({
                    ...newPart,
                    ...{ catId: Number(e.target.value) },
                  }))
                }
                value={newPart.catId}
              >
                <option value="-1">--</option>
                {catData.data.map((cat) => (
                  <option key={cat.id} value={`${cat.id}`}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="partname">
                Part Name
                <MyToolTip
                  content={
                    <div style={{ maxWidth: "25em" }}>
                      We like to follow Bricklink Naming conventions for
                      consistency, please use the name from Bricklink if
                      applicable. Example: Brick 2 x 4
                    </div>
                  }
                  id={"pName"}
                />
              </label>
              {!isNewPart ? (
                <input
                  maxLength={100}
                  id="partname"
                  className="formInput fg-1"
                  placeholder="Required"
                  onChange={(e) =>
                    setNewPart((newPart) => ({
                      ...newPart,
                      ...{ name: e.target.value },
                    }))
                  }
                  value={newPart.name}
                />
              ) : (
                <select
                  name="pname"
                  id="pname"
                  className="w-50 formInput"
                  onChange={(e) =>
                    setNewPart((newPart) => ({
                      ...newPart,
                      ...{ id: Number(e.target.value) },
                    }))
                  }
                  value={newPart.id}
                  disabled={newPart.catId == -1}
                >
                  <option value="-1">--Select a Category First--</option>
                  {selcat &&
                    selcat.parts.map((part) => (
                      <option value={`${part.id}`}>{part.name}</option>
                    ))}
                </select>
              )}
            </div>

            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="primary">
                Part Number
                <MyToolTip
                  content={
                    <div style={{ maxWidth: "25em" }}>
                      If there is more than one part number, just put one, you
                      can add more after it is approved. Example: 3001
                    </div>
                  }
                  id={"pNo"}
                />
              </label>
              <input
                maxLength={20}
                id="primary"
                className="formInput w-50"
                placeholder="Required"
                onChange={(e) =>
                  setNewPart((newPart) => ({
                    ...newPart,
                    ...{ number: e.target.value },
                  }))
                }
                value={newPart.number}
              />
            </div>
            {!isNewPart && (
              <>
                <div className="w-100 d-flex jc-space-b">
                  <label htmlFor="blURL">
                    Bricklink URL Parameter:
                    <MyToolTip
                      content={
                        <div style={{ maxWidth: "35em" }}>
                          <div>
                            Just include the part number that is used in the
                            Bricklink URL, Example:
                            <div style={{ padding: "1em 0" }}>
                              <span style={{ color: "lightblue" }}>
                                www.bricklink.com/v2/catalog/catalogitem.page?P=
                              </span>
                              <span
                                style={{
                                  color: "red",
                                  textDecoration: "underline",
                                }}
                              >
                                3001
                              </span>
                            </div>
                          </div>
                          <div>
                            Some parts, like the 2x4 Brick, have multiple part
                            numbers, but only one Bricklink page, this lets us
                            know which URL parameter to use to help our users
                            navigate easily.
                          </div>
                        </div>
                      }
                      id={"blURL"}
                    />
                  </label>
                  <input
                    maxLength={20}
                    id="blURL"
                    className="formInput w-50"
                    placeholder="Optional"
                    onChange={(e) =>
                      setNewPart((newPart) => ({
                        ...newPart,
                        ...{ blURL: e.target.value },
                      }))
                    }
                    value={newPart.blURL}
                  />
                </div>
                <label htmlFor="partnote2" style={{ marginRight: "auto" }}>
                  Note for part ({newPart.name})
                  <MyToolTip
                    content={
                      <div style={{ maxWidth: "15em" }}>
                        The part is a parent entity that can have many children
                        part numbers/mold varitations, in order to keep things
                        clean, this note will be attached only to the parent
                        entity.
                      </div>
                    }
                    id={"partnote"}
                  />
                </label>
                <div className="w-100 d-flex">
                  <textarea
                    maxLength={255}
                    id="partnote2"
                    className="fg-1 formInput"
                    rows={5}
                    placeholder="Optional"
                    onChange={(e) =>
                      setNewPart((newPart) => ({
                        ...newPart,
                        ...{ partNote: e.target.value },
                      }))
                    }
                    value={newPart.partNote}
                  />
                </div>
              </>
            )}

            <label htmlFor="partnote3" style={{ marginRight: "auto" }}>
              Note for part mold/number ({newPart.number})
              <MyToolTip
                content={
                  <div style={{ maxWidth: "15em" }}>
                    The part is a parent entity that can have many children part
                    numbers/mold varitations, in order to keep things clean,
                    this note will be attached only to the child entity under
                    the submitted part number.
                  </div>
                }
                id={"moldnote"}
              />
            </label>

            <div className="w-100 d-flex">
              <textarea
                maxLength={255}
                id="partnote3"
                className="fg-1 formInput"
                rows={5}
                placeholder="Optional"
                onChange={(e) =>
                  setNewPart((newPart) => ({
                    ...newPart,
                    ...{ moldNote: e.target.value },
                  }))
                }
                value={newPart.moldNote}
              />
            </div>
            <div>
              <button
                className="formInputNM"
                onClick={() => {
                  if (newPart.catId != -1) {
                    // if (isNewPart && partNo != -1) {
                    //   console.log("adding new partno");
                    // } else if (!isNewPart) {
                    console.log("adding...");
                    partMutation.mutate(newPart);
                  }
                }}
              >
                Submit Part
              </button>
            </div>
            <div className="w-100 d-flex flex-col flex-center">
              <div className="fake-hr-form"></div>
              <div style={{ marginBottom: "1em" }}>
                Can't find the category? Add a new one:
                <MyToolTip
                  content={
                    <div style={{ maxWidth: "25em" }}>
                      We like to follow Bricklink Naming conventions for
                      consistency, please use the name from Bricklink if
                      applicable. Example: Brick, Modified
                    </div>
                  }
                  id={"catNote"}
                />
              </div>
              <div>
                <input
                  maxLength={50}
                  className="formInput"
                  placeholder="Category Name"
                  onChange={(e) => setNewCategory(e.target.value)}
                  value={newCategory}
                />
                <button
                  className="formInputNM"
                  onClick={() => {
                    if (newCategory) {
                      console.log("adding...");
                      catMutation.mutate({
                        name: newCategory,
                        creatorId: payload.id,
                      });
                    }
                  }}
                >
                  Submit Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
