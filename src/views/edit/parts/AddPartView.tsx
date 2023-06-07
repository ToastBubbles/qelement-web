import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { iPartDTO, category, part } from "../../../interfaces/general";

export default function AddPartView() {
  const [newPart, setNewPart] = useState<iPartDTO>({
    name: "",
    number: "",
    CatId: -1,
  });
  const [newCategory, setNewCategory] = useState<string>();

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
  const catMutation = useMutation({
    mutationFn: (name: string) =>
      axios
        .post<string>(`http://localhost:3000/categories`, { name })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
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
            {/* <option value="solid">solid</option>
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
          <option value="unreleased">unreleased</option> */}
          </select>

          <button
            onClick={() => {
              // if (newColor.hex.length == 0) newColor.hex = "UNKNWN";
              // if (newColor.hex.length == 6) {
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
