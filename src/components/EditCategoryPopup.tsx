import { useMutation, useQuery } from "react-query";
import { IAPIResponse, ICategory } from "../interfaces/general";

import axios from "axios";
import { useContext, useState } from "react";
import showToast, { Mode, getPrefColorName } from "../utils/utils";
import { AppContext } from "../context/context";

interface IProps {
  closePopup: () => void;
}
interface ICatEditDTO {
  id: number;
  newName: string;
  creatorId: number;
}
export default function EditCategoryPopup({ closePopup }: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const [newCatName, setNewCatName] = useState<string>("");
  const [catId, setCatId] = useState<number>(-1);
  const { data: catData, refetch } = useQuery("allCats", () =>
    axios.get<ICategory[]>("http://localhost:3000/categories")
  );
  const catMutation = useMutation({
    mutationFn: (data: ICatEditDTO) =>
      axios.post<IAPIResponse>(`http://localhost:3000/categories/edit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

    onSuccess: (e) => {
      console.log("e", e.data);
      if (e.data.code == 200) {
        setNewCatName("");
        setCatId(-1);
        refetch();
        showToast("Category name changed!", Mode.Success);
      } else {
        showToast("Error changing category name", Mode.Error);
      }
    },
  });
  if (catData && payload)
    return (
      <div className="popup-container">
        <div className="popup-body">
          <button className="popup-close" onClick={closePopup}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
          <h1>Edit Category</h1>
          <div className="popup-inner-body-top">
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="cat">Category</label>
              <select
                name="cat"
                id="cat"
                className="w-50 formInput"
                onChange={(e) => setCatId(Number(e.target.value))}
                value={catId}
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
              <label htmlFor="catName">New Category Name</label>
              <input
                type="text"
                className="formInput w-50"
                placeholder="Required"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              ></input>
            </div>
            <div>
              <button
                disabled={newCatName.trim().length == 0}
                className="formInputNM"
                onClick={() => {
                  catMutation.mutate({
                    id: catId,
                    newName: newCatName,
                    creatorId: payload.id,
                  });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
