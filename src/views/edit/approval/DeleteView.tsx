import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { INotApporvedCounts } from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import { useState } from "react";

export default function DeleteView() {
  const [colorToDeleteID, setColorToDeleteID] = useState<number>(-1);
  const colMutation = useMutation({
    mutationFn: (id: number) =>
      axios
        .post<number>(`http://localhost:3000/color/delete`, { id })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err)),
    onSuccess: () => {
      showToast("Color deleted!", Mode.Success);
    },
  });
  return (
    <>
      <div className="formcontainer">
        <h1>Deletion Overview</h1>
        <div>
          <h3>Delete Color</h3>
          <label htmlFor="colorDel">QID</label>
          <input
            type="number"
            onChange={(e) => setColorToDeleteID(Number(e.target.value))}
            value={colorToDeleteID == -1 ? "" : colorToDeleteID}
          ></input>
          <button
            onClick={() => {
              colMutation.mutate(colorToDeleteID);
              setColorToDeleteID(-1);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
