import React, { ReactNode, useEffect } from "react";
import { INodeWithID, INodeWithIDAndCSS } from "../interfaces/general";
import { useState, CSSProperties } from "react";

interface IProps {
  setter: (value: number | null) => void;
  options: (INodeWithID | INodeWithIDAndCSS)[];
  selectedId?: number | null;
  customStyles?: CSSProperties;
}

export default function CustomSelect({
  setter,
  options,
  selectedId = -1,
  customStyles,
}: IProps) {
  const [selectedOption, setSelectedOption] = useState<ReactNode | null>(null);
  const [dropdownEnabled, setDropdownEnabled] = useState<boolean>(false);
  const [selectedCSSClasses, setSelectedCSSClasses] = useState<string>("");

  useEffect(() => {
    if (selectedId && selectedId > 0) {
      let selectedOption = options.find((x) => x.id == selectedId);
      if (selectedOption) {
        setSelectedOption(selectedOption.node);
        const classNames =
          "cssClasses" in selectedOption ? selectedOption.cssClasses : "";

        setSelectedCSSClasses(classNames);
      }
    }
  }, [selectedId]);

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
              setSelectedCSSClasses("");
              setDropdownEnabled(false);
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
