import axios from "axios";
import { CSSProperties, useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import MyToolTip from "../../../components/MyToolTip";
import { AppContext } from "../../../context/context";
import showToast, { Mode } from "../../../utils/utils";
import { IAPIResponse, ICreateSculptureDTO } from "../../../interfaces/general";

export default function AddSculptureView() {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const baseValues: ICreateSculptureDTO = {
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
    useState<ICreateSculptureDTO>(baseValues);
  const [keywordArray, setKeywordArray] = useState<string[]>([]);
  const [lowercaseKeywordArray, setLowercaseKeywordArray] = useState<string[]>(
    []
  );
  const [currentKeyword, setCurrentKeyword] = useState<string>("");
  useEffect(() => {
    setNewSculpture((newSculpture) => ({
      ...newSculpture,
      ...{ creatorId: payload.id },
    }));
  }, [payload]);

  const sculptureMutation = useMutation({
    mutationFn: (sculptureDTO: ICreateSculptureDTO) =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/sculpture/add`,
        sculptureDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (data) => {
      console.log(data);

      if (data.data?.code == 200) {
        showToast("Sculpture submitted for approval!", Mode.Success);
        // setNewSculpture(baseValues);
        setNewSculpture((prevVals) => ({
          ...baseValues,
          ...{ creatorId: prevVals.creatorId },
        }));
        setKeywordArray([]);
        setCurrentKeyword("");
      } else if (data.data?.code == 201) {
        showToast("Sculpture added!", Mode.Success);
        setNewSculpture(baseValues);
        setNewSculpture((newSculpture) => ({
          ...newSculpture,
          ...{ creatorId: payload.id },
        }));
        setKeywordArray([]);
        setCurrentKeyword("");
      } else {
        showToast("Something went wrong", Mode.Error);
      }
    },
  });

  useEffect(() => {
    const keywordString = keywordArray.join(";");
    if (keywordString.length <= 255) {
      if (keywordArray.length > 0) {
        setNewSculpture((newSculpture) => ({
          ...newSculpture,
          ...{ keywords: keywordString },
        }));

        const lowercaseKeywordsArr = keywordArray.map((kw) => kw.toLowerCase());
        setLowercaseKeywordArray(lowercaseKeywordsArr);
      } else {
        setNewSculpture((newSculpture) => ({
          ...newSculpture,
          ...{ keywords: "" },
        }));
      }
    }
  }, [keywordArray]);

  function handleRemoveKeyword(keywordToRemove: string) {
    setKeywordArray((prevKeywords) =>
      prevKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  }
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
              placeholder="Required"
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
              <label htmlFor="keywords">Keywords</label>
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
                    <div style={{ color: "var(--lt-red)" }}>
                      Type one at at time and click "Add" to add it to the list
                      of keywords
                    </div>
                  </div>
                }
                id="kw"
              />
            </div>
            <div className="w-50">
              <input
                maxLength={12}
                name="keywords"
                className="formInput"
                style={{ width: "85%" }}
                type="text"
                placeholder="Optional"
                onChange={(e) => {
                  const inputValue = e.target.value
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "");

                  setCurrentKeyword(inputValue);
                }}
                value={currentKeyword}
              />
              <button
                className="formInput"
                style={{ width: "15%" }}
                onClick={() => {
                  if (
                    currentKeyword.length > 0 &&
                    !lowercaseKeywordArray.includes(
                      currentKeyword.toLowerCase()
                    )
                  ) {
                    if (
                      keywordArray.join(";").length + currentKeyword.length >
                      255
                    ) {
                      showToast("Maximum keywords reached!", Mode.Error);
                    } else {
                      setKeywordArray((prevKeywords) => [
                        ...prevKeywords,
                        currentKeyword,
                      ]);
                      setCurrentKeyword("");
                    }
                  } else {
                    if (currentKeyword.length == 0) {
                      showToast("Please enter a keyword first", Mode.Warning);
                    } else {
                      showToast(
                        "This keyword is already set to be added.",
                        Mode.Warning
                      );
                    }
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
          <div
            style={{ minHeight: "3em", maxHeight: "10em" }}
            className="w-100"
          >
            Keywords to add (Click to remove):
            {keywordArray.length > 0 ? (
              <div className="d-flex flex-wrap">
                {keywordArray.map((keyword) => (
                  <div
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="new-keyword flex-wrap clickable"
                    key={keyword}
                  >
                    {keyword}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grey-txt">None</div>
            )}
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

                // showToast(newSculpture.keywords, Mode.Info);
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
    if (newSculpture.keywords.length > 0) {
      const pattern = /^[a-zA-Z0-9;]+$/;

      if (!pattern.test(newSculpture.keywords)) {
        isGood = false;
        showToast(
          "Invalid keyword! Must only contain a-z and 0-9.",
          Mode.Error
        );
      }
    }



    return isGood;
  }
  //   } else {
  //     return <p>Loading...</p>;
  //   }
}
