import axios from "axios";
import { useContext, useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import MyToolTip from "../../../components/MyToolTip";
import { IPartMoldDTO, color } from "../../../interfaces/general";

import { AppContext } from "../../../context/context";
import showToast, {
  Mode,
  filterString,
  getPrefColorIdString,
  getPrefColorName,
} from "../../../utils/utils";
import KnownPartRow from "../../../components/KnownPartRow";
export interface IRowVals {
  colorId: number;
  elementId: string;
}

export default function AddKnownView() {
  const {
    state: {
      jwt: { payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const defaultVals: IRowVals = {
    colorId: -1,
    elementId: "",
  };
  const [pn, setpn] = useState<string>("");
  const [moldId, setMoldId] = useState<number>(-1);
  const [rows, setRows] = useState<{ id: number; values: IRowVals }[]>([]);

  const addRow = () => {
    const newRow = { id: rows.length + 1, values: defaultVals };
    setRows([...rows, newRow]);
  };

  const updateRowValue = (id: number, newVals: IRowVals) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, values: newVals } : row))
    );
  };

  const removeRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const { data: colData } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );
  const { data: partData, refetch: partRefetch } = useQuery({
    queryKey: "part" + pn,
    queryFn: () =>
      axios.get<IPartMoldDTO>(`http://localhost:3000/partMold/number`, {
        params: {
          search: filterString(pn),
        },
      }),

    enabled: false,
    onSuccess(data) {
      setMoldId(data.data.id);
      setRows([{ id: 1, values: { colorId: -1, elementId: "" } }]);
    },
  });

  if (colData) {
    return (
      <>
        <div className="formcontainer">
          <h1>mass add known elements</h1>
          <div className="mainform">
            <div style={{ marginBottom: "5em", textAlign: "center" }}>
              This form can be used to easily add multiple known colors to a
              specified part, for example you could add all known/released
              colors for part 3001 like Red/White/Reddish Brown/etc. This page
              is not for adding q-elements or prototypes. Known parts can also
              be added on the <Link to={"/add/qpart"}>Add QElement</Link> page.
              If adding Element IDs, please only add one Element ID per element,
              if there are additional element IDs, please add them after
              submitting this form.
            </div>
            <h3>Part Number</h3>
            <div className="w-100 d-flex jc-center">
              <input
                className="formInput"
                onChange={(e) => {
                  setpn(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    if (pn.length > 0) {
                      partRefetch();
                    }
                  }
                }}
              ></input>

              <button
                className="formInput"
                onClick={() => {
                  if (pn.length > 0) {
                    partRefetch();
                  }
                }}
              >
                Validate
              </button>
            </div>
            <div
              className="w-100 d-flex jc-center"
              style={{ marginBottom: "2em" }}
            >
              {partData && partData.data
                ? `${partData.data.parentPart.name} (${partData.data.number})`
                : "Not a valid Part Number"}
            </div>
            <div
              className="w-100 d-flex jc-center"
              style={{ marginBottom: "2em" }}
            >
              <button onClick={addRow} disabled={!(partData && partData.data)}>
                Add Row
              </button>
            </div>
            <div
              className="w-100 d-flex jc-space-b"
              style={{ marginBottom: "1em" }}
            >
              <p></p>
              <p>Color</p>
              <p>Element ID</p>
              <p></p>
            </div>
            <div className="w-100 d-flex flex-col">
              {rows.map((row, index) => (
                <KnownPartRow
                  key={row.id}
                  id={row.id}
                  index={index}
                  values={row.values}
                  showElementID={true}
                  onChange={(newValues) => updateRowValue(row.id, newValues)}
                  onRemove={() => removeRow(row.id)}
                />
              ))}
            </div>

            {/* <div className="w-100 d-flex jc-space-b">
              <label htmlFor="par">Color</label>
              <select
                name="par"
                id="par"
                className="w-50 formInput"
                // onChange={(e) =>
                //   setNewQPart((newQPart) => ({
                //     ...newQPart,
                //     ...{ colorId: Number(e.target.value) },
                //   }))
                // }
                // value={newQPart.colorId}
              >
                <option value="-1">--</option>
                {colData?.data.map((col) => (
                  <option
                    key={col.id}
                    className="even-nums"
                    value={`${col.id}`}
                  >
                    {getPrefColorIdString(col, prefPayload.prefId).padStart(
                      4,
                      String.fromCharCode(160)
                    ) + String.fromCharCode(160)}
                    | {getPrefColorName(col, prefPayload.prefName)}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-100 d-flex jc-space-b">
              <label htmlFor="eid">
                Element ID
                <MyToolTip
                  content={
                    <div style={{ maxWidth: "20em" }}>
                      Please only add one element ID for now, you can add more
                      once the q-element is approved.
                    </div>
                  }
                  id="eId"
                />
              </label>

              <input
                maxLength={10}
                type="number"
                id="eid"
                className="formInput w-50"
                placeholder="Optional"
                // onChange={(e) => setElementId(Number(e.target.value))}
                // value={elementId == -1 ? "" : elementId}
              />
            </div> */}
            <div className="fake-hr-form"></div>
            <div>
              <button
                className="formInputNM"
                onClick={() => {
                  console.log(rows);
                }}
              >
                Add Elements
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
