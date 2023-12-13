import axios from "axios";
import { ICommentDTO, color } from "../interfaces/general";
import {
  formatDate,
  getPrefColorIdString,
  getPrefColorName,
} from "../utils/utils";
import { useQuery } from "react-query";
import { useState, useContext } from "react";
import { AppContext } from "../context/context";

interface IProps {
  data: string;
}

function ColorTextField({ data }: IProps) {
  const {
    state: {
      jwt: { payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const { data: colorData, isFetched } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<color[] | undefined>([]);

  const [colorId, setColorId] = useState<number>();

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter suggestions based on input value
    const filteredSuggestions = colorData?.data.filter(
      (suggestion) =>
        suggestion.type != "modulexFoil" &&
        (suggestion.bl_name.toLowerCase().includes(value.toLowerCase()) ||
          suggestion.tlg_name.toLowerCase().includes(value.toLowerCase()) ||
          suggestion.bo_name.toLowerCase().includes(value.toLowerCase()))
    );
    if (filteredSuggestions) {
      const sortedArray = filteredSuggestions.sort(
        (a, b) =>
          getPrefColorName(a, prefPayload.prefName).length -
          getPrefColorName(b, prefPayload.prefName).length
      );

      setSuggestions(sortedArray);
    }
  };
  const handleSuggestionClick = (suggestion: color) => {
    setInputValue(suggestion.bl_name);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div style={{ position: "relative" }}>
      <input value={inputValue} onChange={handleInputChange}></input>
      {suggestions && suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              <div>{getPrefColorIdString(suggestion, prefPayload.prefId)}</div>
              <div
                className={"square h100 b flex-text-center " + suggestion.type}
                style={{
                  backgroundColor: "#" + suggestion.hex,
                }}
              ></div>

              <div>
                {getPrefColorName(suggestion, prefPayload.prefName)}
                {prefPayload.prefName == "tlg" && suggestion.type == "modulex"
                  ? " (Mx)"
                  : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ColorTextField;
