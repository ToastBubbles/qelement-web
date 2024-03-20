import React, { useEffect } from "react";
import axios from "axios";
import {
  CustomStyles,
  IColorWSimColId,
  color,
  colorWSimilar,
} from "../interfaces/general";
import { getPrefColorIdString, getPrefColorName } from "../utils/utils";
import { useQuery } from "react-query";
import { useState, useContext, CSSProperties } from "react";
import { AppContext } from "../context/context";
import ColorLink from "./ColorLink";

interface IProps {
  setter?: (colorId: number) => void;
  setterObj?: (color: color | null) => void;
  placeholder?: string;
  customStyles?: CSSProperties;
  reset?: boolean;
}

function ColorTextField({
  setter,
  setterObj,
  placeholder = "",
  customStyles,
  reset = false,
}: IProps) {
  const {
    state: {
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);
  const { data: colorData } = useQuery("allColors", () =>
    axios.get<colorWSimilar[]>("http://localhost:3000/color")
  );
  const [onHover, setOnHover] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [hex, setHex] = useState<string>("FFFFFF00");
  const [type, setType] = useState<string>("");
  const [suggestions, setSuggestions] = useState<colorWSimilar[] | undefined>(
    []
  );
  const [timerId, setTimerId] = useState<number | null>(null);
  const [similarColors, setSimilarColors] = useState<
    IColorWSimColId[] | undefined
  >([]);

  function isIDMatch(color: color, str: string): boolean {
    if (str.length > 0 && !isNaN(parseInt(str)) && isFinite(parseInt(str))) {
      let bl = color.bl_id ? color.bl_id.toString() : "";
      let bo = color.bo_id ? color.bo_id.toString() : "";
      let tlg = color.tlg_id ? color.tlg_id.toString() : "";
      if (
        bl.includes(str) ||
        bo.includes(str) ||
        tlg.includes(str) ||
        color.id.toString().includes(str)
      ) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (reset) {
      setInputValue("");
      setHex("FFFFFF00");
      setType("");
      setSuggestions([]);
    }
  }, [reset]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter suggestions based on input value
    const filteredSuggestions = colorData?.data.filter(
      (suggestion) =>
        suggestion.type !== "modulexFoil" &&
        (suggestion.bl_name.toLowerCase().includes(value.toLowerCase()) ||
          suggestion.tlg_name.toLowerCase().includes(value.toLowerCase()) ||
          suggestion.bo_name.toLowerCase().includes(value.toLowerCase()) ||
          isIDMatch(suggestion, value.trim()))
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
    setter && setter(-1);
    setterObj && setterObj(null);
    setHex("FFFFFF00");
    setType("");
    setSuggestions([]);
    setSimilarColors([]);
  };
  const handleSuggestionClick = (suggestion: colorWSimilar) => {
    setInputValue(getPrefColorName(suggestion, prefPayload.prefName));
    setter && setter(suggestion.id);
    setterObj && setterObj(suggestion);
    setHex(suggestion.hex);
    setType(suggestion.type);
    setSuggestions([]); // Clear suggestions after selection
    setSimilarColors(suggestion.similar);
  };

  useEffect(() => {
    if (onHover) {
      setOnHover(false);
    }
  }, [similarColors]);

  const baseStyles: CSSProperties = {
    position: "relative",
  };

  const mergedStyles: CSSProperties = {
    ...baseStyles,
    ...customStyles,
  };

  const handleMouseEnter = () => {
    console.log("entered");

    setOnHover(true);
    if (timerId) {
      clearTimeout(timerId); // Clear previous timeout if any
      setTimerId(null);
    }
  };

  const handleMouseLeave = () => {
    console.log("leaving");
    if (onHover) {
      setTimerId(
        setTimeout(() => {
          setOnHover(false);
          setTimerId(null);
        }, 500)
      );
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the timer when the component unmounts
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);
  if (true) {
    // console.log(colorData?.data);

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
          <div className="color-text-field-container">
            <input
              className="w-100 color-text-field"
              value={inputValue}
              placeholder={placeholder}
              onChange={handleInputChange}
            ></input>
            {similarColors && similarColors.length > 0 && (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="color-text-field-warn"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                </svg>

                {onHover && (
                  <div className="color-text-field-hint">
                    This color is similar to the following colors:
                    <div
                      className="fake-hr"
                      style={{ margin: "0.25em 0" }}
                    ></div>
                    <div
                      className="d-flex flex-col"
                      style={{ maxHeight: "10em", overflowY: "auto" }}
                    >
                      {similarColors.map((col) => (
                        <ColorLink key={col.id} color={col} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
                <div>
                  {getPrefColorIdString(suggestion, prefPayload.prefId)}
                </div>
                <div
                  className={
                    "square h100 b flex-text-center " + suggestion.type
                  }
                  style={{
                    backgroundColor: "#" + suggestion.hex,
                  }}
                ></div>

                <div>
                  {getPrefColorName(suggestion, prefPayload.prefName)}
                  {prefPayload.prefName === "tlg" &&
                  suggestion.type === "modulex"
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
}

export default ColorTextField;
