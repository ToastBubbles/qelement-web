import React from "react";
import axios from "axios";
import { CustomStyles, color } from "../interfaces/general";
import { getPrefColorIdString, getPrefColorName } from "../utils/utils";
import { useQuery } from "react-query";
import { useState, useContext, CSSProperties } from "react";
import { AppContext } from "../context/context";

interface IProps {
  setter: (colorId: number) => void;
  customStyles?: CSSProperties;
}

function ColorTextField({ setter, customStyles }: IProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const { data: colorData } = useQuery("allColors", () =>
    axios.get<color[]>("http://localhost:3000/color")
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [hex, setHex] = useState<string>("FFFFFF00");
  const [type, setType] = useState<string>("");
  const [suggestions, setSuggestions] = useState<color[] | undefined>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter suggestions based on input value
    const filteredSuggestions = colorData?.data.filter(
      (suggestion) =>
        suggestion.type !== "modulexFoil" &&
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

  const handleClear = () => {
    setInputValue("");
    setter(-1);
    setHex("FFFFFF00");
    setType("");
    setSuggestions([]);
  };
  const handleSuggestionClick = (suggestion: color) => {
    setInputValue(getPrefColorName(suggestion, prefPayload.prefName));

    setter(suggestion.id);
    setHex(suggestion.hex);
    setType(suggestion.type);
    setSuggestions([]); // Clear suggestions after selection
  };
  const baseStyles: CSSProperties = {
    position: "relative",
  };

  const mergedStyles: CSSProperties = {
    ...baseStyles,
    ...customStyles,
  };

  return (
    <div style={mergedStyles}>
      <div className="d-flex" style={{ height: "1.5em" }}>
        <div
          className={"square h100 b flex-text-center " + type}
          style={{
            backgroundColor: "#" + hex,
            border: "1px solid #888",
            borderRight: "None",
          }}
        ></div>
        <input
          className="w-100 color-text-field"
          value={inputValue}
          onChange={handleInputChange}
        ></input>
        {inputValue && (
          <span
            style={{
              cursor: "pointer",
              marginLeft: "5px",
              color: "#888",
            }}
            onClick={handleClear}
          >
            X
          </span>
        )}
      </div>
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
                {prefPayload.prefName === "tlg" && suggestion.type === "modulex"
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
