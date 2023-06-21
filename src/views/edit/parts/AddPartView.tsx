import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  iPartDTO,
  category,
  part,
  IPartWithMoldDTO,
} from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import MyToolTip from "../../../components/MyToolTip";

export default function AddPartView() {
  const [newPart, setNewPart] = useState<IPartWithMoldDTO>({
    id: -1,
    name: "",
    number: "",
    CatId: -1,
    partNote: "",
    moldNote: "",
  });
  const [partNo, setPartNo] = useState<number>(-1);
  const [newCategory, setNewCategory] = useState<string>();
  const [isNewPart, setIsNewPart] = useState<boolean>(false);
  const {
    data: catData,
    isLoading,
    error,
    isFetched,
    refetch,
  } = useQuery("allCats", () =>
    axios.get<category[]>("http://localhost:3000/categories")
  );

  const partMutation = useMutation({
    mutationFn: (part: IPartWithMoldDTO) =>
      axios.post<part>(`http://localhost:3000/parts`, part),
    onSuccess: () => {
      showToast("Part submitted for approval!", Mode.Success);
    },
  });
  const catMutation = useMutation({
    mutationFn: (name: string) =>
      axios
        .post<string>(`http://localhost:3000/categories`, { name })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetch();
      showToast("Category submitted for approval!", Mode.Success);
    },
  });
  const handleCheckbox = () => {
    setIsNewPart(!isNewPart);
  };
  if (isFetched && catData) {
    let selcat = catData.data.find((x) => x.id == newPart.CatId);
    return (
      <>
        <div className="formcontainer">
          <h1>add new part</h1>
          <div className="mainform">
            <div className="w-100 d-flex jc-space-b">
              <div>Add a new part number/mold to an existing part?</div>
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
                    ...{ CatId: Number(e.target.value) },
                  }))
                }
                value={newPart.CatId}
              >
                <option value="-1">--</option>
                {catData.data.map((cat) => (
                  <option value={`${cat.id}`}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="partname">Part Name</label>
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
                  disabled={newPart.CatId == -1}
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
              <label htmlFor="primary">Part Number</label>
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
                  if (newPart.CatId != -1) {
                    // if (isNewPart && partNo != -1) {
                    //   console.log("adding new partno");
                    // } else if (!isNewPart) {
                    console.log("adding...");
                    partMutation.mutate(newPart);
                    setNewPart({
                      id: -1,
                      name: "",
                      number: "",
                      CatId: -1,
                      partNote: "",
                      moldNote: "",
                    });
                  }
                }}
              >
                Submit Part
              </button>
            </div>
            <div className="w-100 d-flex flex-col flex-center">
              <div className="fake-hr-form"></div>
              <div style={{ marginBottom: "1em" }}>
                can't find the category? add a new one:
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
                      catMutation.mutate(newCategory);
                      setNewCategory("");
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
