import axios from "axios";
import { useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { IGoalDTO, category } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";
import MyToolTip from "./MyToolTip";
import { AppContext } from "../context/context";

interface IProps {
  onClickFn: () => void;
}

export default function OnHoverX({ onClickFn }: IProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "2px",
        right: "2px",
        cursor: "pointer",
        zIndex: 20,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClickFn();
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="var(--lt-red)"
        className="bi bi-x"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
      </svg>
      <div className="white-fill"></div>
    </div>
  );
}
