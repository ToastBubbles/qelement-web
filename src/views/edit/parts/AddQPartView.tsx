import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { iPartDTO, category, part } from "../../../interfaces/general";

export default function AddQPartView() {
  const [newPart, setNewPart] = useState<iPartDTO>({
    name: "",
    number: "",
    CatId: -1,
  });

  const {
    data: catData,
    isLoading,
    error,
    isFetched,
  } = useQuery("todos", () =>
    axios.get<category[]>("http://localhost:3000/categories")
  );

  const partMutation = useMutation({
    mutationFn: ({ name, number, CatId }: iPartDTO) =>
      axios.post<part>(`http://localhost:3000/parts`, {
        name,
        number,
        CatId,
      }),
    onSuccess: () => {},
  });

  if (isFetched && catData) {
    return (
      <>
        <div>
          <h3>Add new part</h3>
          <div>
            <div>
              <input
                placeholder="Add New Category..."
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                onClick={() => {
                  if (newCategory) {
                    console.log("adding...");
                    catMutation.mutate(newCategory);
                  }
                }}
              >
                Add Category
              </button>
            </div>
            <br></br>
            <div>
              <input
                placeholder="Part Name"
                onChange={(e) =>
                  setNewPart((newPart) => ({
                    ...newPart,
                    ...{ name: e.target.value },
                  }))
                }
              />
            </div>
            <input
              placeholder="Part Number"
              onChange={(e) =>
                setNewPart((newPart) => ({
                  ...newPart,
                  ...{ number: e.target.value },
                }))
              }
            />
          </div>

          <select
            name="cat"
            id="cat"
            onChange={(e) =>
              setNewPart((newPart) => ({
                ...newPart,
                ...{ CatId: Number(e.target.value) },
              }))
            }
          >
            <option value="-1">--</option>
            {catData.data.map((cat) => (
              <option value={`${cat.id}`}>{cat.name}</option>
            ))}
            
          </select>

          <button
            onClick={() => {

              if (newPart.CatId != -1) {
                console.log("adding...");
                partMutation.mutate({
                  name: newPart.name,
                  number: newPart.number,
                  CatId: newPart.CatId,
                });
              }
            }}
          >
            Add Part
          </button>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
