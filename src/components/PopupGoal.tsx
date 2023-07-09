import axios from "axios";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AppContext } from "../context/context";
import {
  IGoalDTO,
  IQPartDTOInclude,
  IWantedDTO,
  category,
} from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";
import ConditionSlider from "./ConditionSlider";
import MyToolTip from "./MyToolTip";
import Select from "react-select";

interface IProps {
  userId: number;
  closePopup: () => void;
}

export default function PopupGoal({ userId, closePopup }: IProps) {
  const initialValues: IGoalDTO = {
    userId,
    partId: -1,
    moldId: -1,
    name: "",
    solid: true,
    trans: true,
    other: true,
  };
  const [selectedCatId, setSelectedCatId] = useState<number>(-1);
  const [goal, setGoal] = useState<IGoalDTO>(initialValues);
  const goalMutation = useMutation({
    mutationFn: (goalDTO: IGoalDTO) =>
      axios.post(`http://localhost:3000/userGoal/add`, goalDTO),
    onSuccess: (e) => {
      if (e.data.code == 200) showToast(`Added new Goal!`, Mode.Success);
      else {
        showToast(`Failed to creat new goal.`, Mode.Warning);
      }
    },
  });
  const { data: catData } = useQuery("allCats", () =>
    axios.get<category[]>("http://localhost:3000/categories")
  );
  if (catData) {
    let selcat = catData.data.find((x) => x.id == selectedCatId);
    let selpart = selcat?.parts.find((x) => x.id == goal.partId);
    return (
      <div className="popup-container">
        <div style={{ minHeight: "35em" }} className="popup-body">
          <button className="popup-close" onClick={closePopup}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
          <h1 style={{ marginBottom: "0.5em" }}>Add new Goal</h1>
          <div style={{ color: "#999" }}>
            What is a goal?{" "}
            <MyToolTip
              content={
                <div
                  style={{ maxWidth: "20em" }}
                  className="d-flex flex-col jc-start"
                >
                  <div>
                    You can set custom goals to keep track of your collection
                    progress. If you'd like to collect every 2x4 brick including
                    3001 and 3556, you can set a goal for that! If you'd like to
                    only keep track of 3001 and you're only interested in Opaque
                    colors, you can set a goal for that too!
                  </div>
                </div>
              }
              id="goaltip"
            />
          </div>
          <div className="w-100 d-flex jc-space-b my-1">
            <label htmlFor="name">Name:</label>
            <input
              max={100}
              name="goalname"
              id="goalname"
              placeholder="Optional"
              className="w-50 formInput"
              onChange={(e) =>
                setGoal((goal) => ({
                  ...goal,
                  ...{ name: e.target.value },
                }))
              }
              value={goal.name}
            />
          </div>
          <div className="w-100 d-flex jc-space-b my-1">
            <label htmlFor="catDrop">Category:</label>
            <select
              name="cat"
              id="cat"
              className="w-50 formInput"
              onChange={(e) => {
                setSelectedCatId(Number(e.target.value));
                setGoal((goal) => ({
                  ...goal,
                  ...{ partId: -1, moldId: -1 },
                }));
              }}
              value={selectedCatId}
            >
              <option value="-1">--</option>
              {catData.data.map((cat) => (
                <option key={cat.id} value={`${cat.id}`}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-100 d-flex jc-space-b my-1">
            <label htmlFor="pt">Part:</label>
            <select
              name="pt"
              id="pt"
              className="w-50 formInput"
              onChange={(e) =>
                setGoal((goal) => ({
                  ...goal,
                  ...{ partId: Number(e.target.value), moldId: -1 },
                }))
              }
              value={goal.partId}
              disabled={selectedCatId == -1}
            >
              <option value="-1">--Select a Category First--</option>
              {selcat &&
                selcat.parts.map((part) => (
                  <option key={part.id} value={`${part.id}`}>
                    {part.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-100 d-flex jc-space-b my-1">
            <label htmlFor="moldDrop">Mold:</label>
            <select
              name="pname"
              id="pname"
              className="w-50 formInput"
              onChange={(e) =>
                setGoal((goal) => ({
                  ...goal,
                  ...{ moldId: Number(e.target.value) },
                }))
              }
              value={goal.moldId}
              disabled={goal.partId == -1}
            >
              <option value="-1">Include all mold variations</option>
              {selpart &&
                selpart.molds.map((mold) => (
                  <option key={mold.id} value={`${mold.id}`}>
                    {mold.number}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-100 d-flex jc-space-b my-2">
            <label htmlFor="colTypeDrop">Include Solid Colors:</label>
            <label className="switch" htmlFor="cbS">
              <input
                type="checkbox"
                id="cbS"
                checked={goal.solid}
                onChange={(e) =>
                  setGoal((goal) => ({
                    ...goal,
                    ...{ solid: e.target.checked },
                  }))
                }
              />
              <div className="slider round"></div>
            </label>
          </div>
          <div className="w-100 d-flex jc-space-b my-2">
            <label htmlFor="colTypeDrop">Include Transparent Colors:</label>
            <label className="switch" htmlFor="cbT">
              <input
                type="checkbox"
                id="cbT"
                checked={goal.trans}
                onChange={(e) =>
                  setGoal((goal) => ({
                    ...goal,
                    ...{ trans: e.target.checked },
                  }))
                }
              />
              <div className="slider round"></div>
            </label>
          </div>
          <div className="w-100 d-flex jc-space-b my-2">
            <label htmlFor="colTypeDrop">Include Other Colors:</label>
            <label className="switch" htmlFor="cbO">
              <input
                type="checkbox"
                id="cbO"
                checked={goal.other}
                onChange={(e) =>
                  setGoal((goal) => ({
                    ...goal,
                    ...{ other: e.target.checked },
                  }))
                }
              />
              <div className="slider round"></div>
            </label>
          </div>
          <button
            className="formInputNM"
            onClick={() => {
              if (goal.userId == -1) {
                goal.userId = userId;
              }
              if (goal.userId != -1 && goal.partId != -1) {
                console.log("adding...");
                goalMutation.mutate(goal);
              } else {
                showToast(`Error creating goal.`, Mode.Error);
              }
              // showToast(
              //   `u${goal.userId} p${goal.partId} m${goal.moldId} ${goal.solid} ${goal.trans} ${goal.other}`,
              //   Mode.Info
              // );
            }}
          >
            Add Goal
          </button>
        </div>
      </div>
    );
  }
}
