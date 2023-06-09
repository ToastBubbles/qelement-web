import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  iPartDTO,
  category,
  part,
  iQPartDTO,
  color,
  IQPartDTO,
} from "../../../interfaces/general";
import { Link } from "react-router-dom";

export default function AddQPartView() {
  const defaultValues: iQPartDTO = {
    partId: -1,
    colorId: -1,
    elementId: "",
    secondaryElementId: "",
    creatorId: -1,
    note: "",
  };
  const [newQPart, setNewQPart] = useState<iQPartDTO>(defaultValues);
  const [category, setCategory] = useState<number>(-1);

  const {
    data: colData,
    isLoading: colIsLoading,
    error: colError,
  } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );

  const {
    data: partsData,
    error: partsError,
    refetch: partsRefetch,
  } = useQuery({
    queryKey: "singleCatPartsAdd",
    queryFn: () =>
      axios.get<part[]>(`http://localhost:3000/parts/byCatId/${category}`),
    enabled: category != -1,
  });
  useEffect(() => {
    partsRefetch();
    setNewQPart((newQPart) => ({
      ...newQPart,
      ...{ partId: -1 },
    }));
  }, [category]);

  const {
    data: catData,
    isLoading: catIsLoading,
    error: catError,
    isFetched: catIsFetched,
  } = useQuery("todos", () =>
    axios.get<category[]>("http://localhost:3000/categories")
  );

  const partMutation = useMutation({
    mutationFn: (qpart: iQPartDTO) =>
      axios.post<iQPartDTO>(`http://localhost:3000/qpart`, qpart),
    onSuccess: () => {},
  });

  if (catIsFetched && catData && colData) {
    return (
      <>
        <div className="logincontainer">
          <h1>add new qelement</h1>
          <div className="loginRegForm">
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="cat">Category</label>
              <select
                name="cat"
                id="cat"
                className="w-50 formInput"
                onChange={(e) => setCategory(Number(e.target.value))}
                value={category}
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
              <label htmlFor="par">Part</label>
              <select
                name="par"
                id="par"
                className="w-50 formInput"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ partId: Number(e.target.value) },
                  }))
                }
                value={newQPart.partId}
              >
                <option value="-1">--</option>
                {partsData?.data.map((part) => (
                  <option key={part.id} value={`${part.id}`}>
                    {part.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="par">Color</label>
              <select
                name="par"
                id="par"
                className="w-50 formInput"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ colorId: Number(e.target.value) },
                  }))
                }
                value={newQPart.colorId}
              >
                <option value="-1">--</option>
                {colData?.data.map((col) => (
                  <option
                    key={col.id}
                    className="even-nums"
                    value={`${col.id}`}
                  >
                    {col.tlg_id
                      ? col.tlg_id
                          .toString()
                          .padStart(4, String.fromCharCode(160)) +
                        String.fromCharCode(160)
                      : "".padEnd(5, String.fromCharCode(160))}
                    | {col.bl_name ? col.bl_name : col.tlg_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="eid">Element ID</label>
              <input
                id="eid"
                className="formInput w-50"
                placeholder="Optional"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ elementId: e.target.value },
                  }))
                }
                value={newQPart.elementId}
              />
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="seid">Secondary Element ID</label>
              <input
                id="seid"
                className="formInput w-50"
                placeholder="Optional"
                onChange={(e) =>
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ secondaryElementId: e.target.value },
                  }))
                }
                value={newQPart.secondaryElementId}
              />
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
                  setNewQPart((newQPart) => ({
                    ...newQPart,
                    ...{ note: e.target.value },
                  }))
                }
                value={newQPart.note}
              />
            </div>
            <div>
              <button
                className="formInputNM"
                onClick={() => {
                  // {
                  //   partId: -1,
                  //   colorId: -1,
                  //   elementId: "",
                  //   secondaryElementId: "",
                  //   creatorId: -1,
                  //   note: "",
                  // }
                  if (newQPart.partId != -1 && newQPart.colorId != -1) {
                    console.log("adding...");
                    partMutation.mutate(newQPart);
                    setNewQPart(defaultValues);
                  }
                }}
              >
                Add QElement
              </button>
            </div>
            <div className="w-100 d-flex flex-col flex-center">
              <div className="fake-hr-form"></div>
              <div style={{ marginBottom: "1em" }}>
                can't find the category or part? add it here:
              </div>
              <Link to={"/add/part"}>Add Parts</Link>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
