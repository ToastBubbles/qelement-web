import axios from "axios";
import { CSSProperties, useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import MyToolTip from "../../../components/MyToolTip";
import { AppContext } from "../../../context/context";
import showToast, { Mode } from "../../../utils/utils";
import { IAPIResponse, ICreateScupltureDTO } from "../../../interfaces/general";

export default function AddSculptureView() {
  const {
    state: {
      jwt: { payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const baseValues: ICreateScupltureDTO = {
    name: "",
    brickSystem: "system",
    location: "",
    note: "",
    yearMade: -1,
    yearRetired: -1,
    keywords: "",
    creatorId: -1,
  };
  const [newSculpture, setNewSculpture] =
    useState<ICreateScupltureDTO>(baseValues);

  useEffect(() => {
    setNewSculpture((newSculpture) => ({
      ...newSculpture,
      ...{ creatorId: payload.id },
    }));
  }, [payload]);

  const sculptureMutation = useMutation({
    mutationFn: (sculptureDTO: ICreateScupltureDTO) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/sculpture/add`,
        sculptureDTO
      ),
    onSuccess: (data) => {
      console.log(data);

      if (data.data?.code == 200) {
        showToast("Sculpture submitted for approval!", Mode.Success);
        setNewSculpture(baseValues);
        setNewSculpture((newSculpture) => ({
          ...newSculpture,
          ...{ creatorId: payload.id },
        }));
      } else if (data.data?.code == 201) {
        showToast("Sculpture added!", Mode.Success);
        setNewSculpture(baseValues);
        setNewSculpture((newSculpture) => ({
          ...newSculpture,
          ...{ creatorId: payload.id },
        }));
      } else {
        showToast("Something went wrong", Mode.Error);
      }
    },
  });

  return (
    <>
      <div className="formcontainer">
        <h1>add new sculpture</h1>
        <div className="mainform">
          <div className="w-100 d-flex jc-space-b">
            <label htmlFor="sculpname">
              Name
              <MyToolTip
                content={
                  <div style={{ maxWidth: "20em" }}>
                    Descriptive name like "Minifigure holding balloon riding
                    elephant"
                  </div>
                }
                id="sculpname"
              />
            </label>

            <input
              maxLength={255}
              type="text"
              className="formInput w-50"
              onChange={(e) =>
                setNewSculpture((newSculpture) => ({
                  ...newSculpture,
                  ...{ name: e.target.value },
                }))
              }
              value={newSculpture.name}
            />
          </div>
          <div className="w-100 d-flex jc-space-b">
            <label htmlFor="sculpname">
              Building System
              <MyToolTip
                content={
                  <div style={{ maxWidth: "20em" }}>
                    <ul>
                      <li>System: Regular LEGO</li>
                      <li>Technic: Technic</li>
                      <li>DUPLO: DUPLO</li>
                      <li>Hybrid: Contains multiple systems</li>
                      <li>Other</li>
                    </ul>
                  </div>
                }
                id="sculptype"
              />
            </label>

            <select
              className="formInput w-50"
              onChange={(e) =>
                setNewSculpture((newSculpture) => ({
                  ...newSculpture,
                  ...{ brickSystem: e.target.value },
                }))
              }
              value={newSculpture.brickSystem}
            >
              <option value={"system"}>System</option>
              <option value={"technic"}>Technic</option>
              <option value={"duplo"}>DUPLO</option>
              <option value={"hybrid"}>Hybrid</option>
              <option value={"other"}>Other</option>
            </select>
          </div>
          <div className="w-100 d-flex jc-space-b">
            <div>
              <label htmlFor="yearmade">Year Made</label>
              <MyToolTip
                content={
                  <div style={{ maxWidth: "20em" }}>
                    The Year this model was made or first displayed. (Optional)
                  </div>
                }
                id="yearmade"
              />
            </div>
            <input
              maxLength={4}
              pattern="[0-9]"
              className="formInput w-50"
              type="text"
              placeholder="Optional"
              onKeyDown={(e) => {
                // Get the pressed key
                const key = e.key;
                // Allow non-character keys like backspace and arrow keys
                if (e.code.includes("Arrow") || key === "Backspace") {
                  return;
                }
                // Regular expression pattern to match hexadecimal characters
                const yearPattern = /^[0-9]$/;
                // Check if the pressed key is a valid hexadecimal character
                if (!yearPattern.test(key)) {
                  e.preventDefault(); // Prevent the character from being entered
                }
              }}
              onChange={(e) =>
                setNewSculpture((newSculpture) => ({
                  ...newSculpture,
                  ...{ yearMade: Number(e.target.value) },
                }))
              }
              value={newSculpture.yearMade <= 0 ? "" : newSculpture.yearMade}
            />
          </div>
          <div className="w-100 d-flex jc-space-b">
            <div>
              <label htmlFor="yearret">Year Retired</label>
              <MyToolTip
                content={
                  <div style={{ maxWidth: "20em" }}>
                    The Year this model was retired or taken off display. Leave
                    blank if still active or unknown.
                  </div>
                }
                id="yearret"
              />
            </div>
            <input
              maxLength={4}
              pattern="[0-9]"
              className="formInput w-50"
              type="text"
              placeholder="Optional"
              onKeyDown={(e) => {
                // Get the pressed key
                const key = e.key;
                // Allow non-character keys like backspace and arrow keys
                if (e.code.includes("Arrow") || key === "Backspace") {
                  return;
                }
                // Regular expression pattern to match hexadecimal characters
                const yearPattern = /^[0-9]$/;
                // Check if the pressed key is a valid hexadecimal character
                if (!yearPattern.test(key)) {
                  e.preventDefault(); // Prevent the character from being entered
                }
              }}
              onChange={(e) =>
                setNewSculpture((newSculpture) => ({
                  ...newSculpture,
                  ...{ yearRetired: Number(e.target.value) },
                }))
              }
              value={
                newSculpture.yearRetired <= 0 ? "" : newSculpture.yearRetired
              }
            />
          </div>
          <div className="w-100 d-flex jc-space-b">
            <div>
              <label htmlFor="location">Location</label>
              <MyToolTip
                content={
                  <ul className="tt-list">
                    Location that this sculpture was seen, or is known to exist,
                    examples:
                    <li>LEGOLAND Discovery Center, New York, USA</li>
                    <li>LEGOLAND, Florida, USA, Pick-a-Brick Wall</li>
                    <li>Germany</li>
                    <li>Europe</li>
                  </ul>
                }
                id="location"
              />
            </div>
            <input
              maxLength={50}
              id="location"
              className="formInput w-50"
              placeholder="Optional"
              onChange={(e) =>
                setNewSculpture((newSculpture) => ({
                  ...newSculpture,
                  ...{ location: e.target.value },
                }))
              }
              value={newSculpture.location}
            />
          </div>
          <div className="w-100 d-flex jc-space-b">
            <div>
              <label htmlFor="yearret">Keywords</label>
              <MyToolTip
                content={
                  <div style={{ maxWidth: "20em" }}>
                    Keywords to help make this sculpture easier to search for.
                    If the word is already in the name, it is not necessary to
                    add it as a keyword.
                    <div>
                      Example: If the name of a sculpture was "Minifigure
                      holding balloon riding elephant" some good keywords would
                      be "animal", "child" (if minifigure is a child), etc
                    </div>
                    Type one at at time and click "Add" to add it to the list of
                    keywords
                  </div>
                }
                id="kw"
              />
            </div>
            <input
              maxLength={12}
              className="formInput w-50"
              type="text"
              placeholder="Optional"
            />
          </div>
          <label htmlFor="sculnote" style={{ marginRight: "auto" }}>
            Note for sculpture
          </label>
          <div className="w-100 d-flex">
            <textarea
              maxLength={255}
              id="sculnote"
              className="fg-1 formInput"
              rows={5}
              placeholder="Optional"
              onChange={(e) =>
                setNewSculpture((newSculpture) => ({
                  ...newSculpture,
                  ...{ note: e.target.value },
                }))
              }
              value={newSculpture.note}
            />
          </div>
          <div>
            <button
              className="formInputNM"
              onClick={() => {
                if (validateDTO()) {
                  sculptureMutation.mutate(newSculpture);
                }
              }}
            >
              Add Sculpture
            </button>
          </div>
        </div>
      </div>
    </>
  );

  function validateDTO(): boolean {
    let isGood = true;
    if (newSculpture.name.length <= 2) {
      isGood = false;
      showToast("Name is too short.", Mode.Error);
    } else if (newSculpture.name.length > 255) {
      showToast("Name is too long.", Mode.Error);
      isGood = false;
    }
    if (newSculpture.yearMade != -1) {
      if (newSculpture.yearMade < 1932) {
        showToast(
          "How was this sculpture made before LEGO was invented?!",
          Mode.Error
        );
        isGood = false;
      } else if (newSculpture.yearMade > new Date().getFullYear() + 5) {
        showToast(
          "We appriciate you coming from the future with this info, be we only need existing sculptures",
          Mode.Error
        );
        isGood = false;
      }
    }
    if (newSculpture.yearRetired != -1) {
      if (newSculpture.yearRetired < 1932) {
        showToast(
          "How was this sculpture retired before LEGO was invented?!",
          Mode.Error
        );
        isGood = false;
      } else if (newSculpture.yearRetired > new Date().getFullYear() + 25) {
        showToast(
          "Just leave Year Retired Blank if the planned retirement date is that far away.",
          Mode.Error
        );
        isGood = false;
      }
    }
    return isGood;
  }
  //   } else {
  //     return <p>Loading...</p>;
  //   }
}