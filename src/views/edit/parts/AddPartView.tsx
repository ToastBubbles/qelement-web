import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { iPartDTO, category, part } from "../../../interfaces/general";

export default function AddPartView() {
  const [newPart, setNewPart] = useState<iPartDTO>({
    name: "",
    number: "",
    secondaryNumber: "",
    CatId: -1,
    note: "",
  });
  const [newCategory, setNewCategory] = useState<string>();

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
    mutationFn: (part: iPartDTO) =>
      axios.post<part>(`http://localhost:3000/parts`, part),
    onSuccess: () => {},
  });
  const catMutation = useMutation({
    mutationFn: (name: string) =>
      axios
        .post<string>(`http://localhost:3000/categories`, { name })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      refetch();
    },
  });
  if (isFetched && catData) {
    return (
      <>
        <div className="formcontainer">
          <h1>add new part</h1>
          <div className="mainform">
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="partname">Part Name</label>
              <input
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
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="primary">Part Number</label>
              <input
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
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="secondary">Secondary Part Number</label>
              <input
                className="formInput w-50"
                placeholder="Optional"
                id="secondary"
                onChange={(e) =>
                  setNewPart((newPart) => ({
                    ...newPart,
                    ...{ secondaryNumber: e.target.value },
                  }))
                }
                value={newPart.secondaryNumber}
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
            <label htmlFor="partnote" style={{ marginRight: "auto" }}>
              Note
            </label>
            <div className="w-100 d-flex">
              <textarea
                id="partnote"
                className="fg-1 formInput"
                rows={5}
                placeholder="Optional"
                onChange={(e) =>
                  setNewPart((newPart) => ({
                    ...newPart,
                    ...{ note: e.target.value },
                  }))
                }
                value={newPart.note}
              />
            </div>
            <div>
              <button
                className="formInputNM"
                onClick={() => {
                  if (newPart.CatId != -1) {
                    console.log("adding...");
                    partMutation.mutate(newPart);
                    setNewPart({
                      name: "",
                      number: "",
                      secondaryNumber: "",
                      CatId: -1,
                      note: "",
                    });
                  }
                }}
              >
                Add Part
              </button>
            </div>
            <div className="w-100 d-flex flex-col flex-center">
              <div className="fake-hr-form"></div>
              <div style={{ marginBottom: "1em" }}>
                can't find the category? add a new one:
              </div>
              <div>
                <input
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
                  Add Category
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
