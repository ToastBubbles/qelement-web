import React, { ReactNode } from "react";
import axios from "axios";
import {
  CustomStyles,
  INodeWithID,
  INodeWithIDAndCSS,
  color,
} from "../interfaces/general";
import { getPrefColorIdString, getPrefColorName } from "../utils/utils";
import { useQuery } from "react-query";
import { useState, useContext, CSSProperties } from "react";
import { AppContext } from "../context/context";

interface IProps {
  setter: (value: number | null) => void;
  options: (INodeWithID | INodeWithIDAndCSS)[];
  customStyles?: CSSProperties;
}

export default function CustomSelect({
  setter,
  options,
  customStyles,
}: IProps) {
  const [selectedOption, setSelectedOption] = useState<ReactNode | null>(null);
  const [dropdownEnabled, setDropdownEnabled] = useState<boolean>(false);
  const [selectedCSSClasses, setSelectedCSSClasses] = useState<string>("");
  return (
    <div className="p-rel" style={{ ...customStyles }}>
      <div
        className="custom-select"
        onClick={() => setDropdownEnabled(!dropdownEnabled)}
      >
        {selectedOption ? selectedOption : "--"}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          style={{
            position: "absolute",
            top: "50%",
            right: "5px",
            transform: "translateY(-50%)",
          }}
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {dropdownEnabled && (
        <div className={"custom-select-dropdown " + selectedCSSClasses}>
          <div
            onClick={() => {
              setSelectedOption(<>--</>);
              setter(-1);
              setDropdownEnabled(false);
              setSelectedCSSClasses("");
            }}
          >
            --
          </div>
          {options.map((option) => (
            <div
              key={option.id}
              className="clickable"
              onClick={() => {
                setSelectedOption(option.node);
                setter(option.id);
                setDropdownEnabled(false);
                const classNames =
                  "cssClasses" in option ? option.cssClasses : "";

                setSelectedCSSClasses(classNames);
              }}
            >
              {option.node}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
