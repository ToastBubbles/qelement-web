import axios from "axios";
import { useMutation } from "react-query";
import { ISculptureDTO, ISculptureInventory } from "../../interfaces/general";
import showToast, { Mode } from "../../utils/utils";
import { useEffect, useState } from "react";
import ConfirmPopup from "../ConfirmPopup";
import RecentSculpture from "../RecentSculpture";
import RecentQPart from "../RecentQPart";
import { Checkbox } from "@mui/material";
import SculptureInventoryRow from "./SculptureInventoryRow";

interface IProps {
  sculpture: ISculptureDTO;
  refetchFn: () => void;
  addFn: (sculptureId: number, qpartId: number, type: string) => void;
  removeFn: (sculptureId: number, qpartId: number, type: string) => void;
}

export default function SculptureInventoryDetails({
  sculpture,
  refetchFn,
  addFn,
  removeFn,
}: IProps) {
  if (sculpture) {
    return (
      <div className="coldeet">
        <RecentSculpture sculpture={sculpture} />
        <div style={{ justifyContent: "end", paddingRight: "2em" }}>
          <div>Appr. Deny</div>
        </div>
        <fieldset
          style={{
            marginBottom: "1em",
            maxHeight: "30em",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <legend>Parts Requested</legend>
          {sculpture.inventory.length > 0 ? (
            sculpture.inventory.map((part) => (
              <SculptureInventoryRow
                key={part.id}
                sculptureId={sculpture.id}
                qpart={part}
                addFn={addFn}
                removeFn={removeFn}
              />
            ))
          ) : (
            <div>No Parts...</div>
          )}
        </fieldset>

        {/* <div>
          <div>Requestor:</div>
          <div>
            {sculptureInv.creator.name} ({sculpture.creator.email})
          </div>
        </div> */}
        {/* <div style={{ justifyContent: "end" }}> */}
        {/* <button onClick={() => sculptureMutation.mutate(sculpture.id)}>
            Approve
          </button> */}
        {/* <div style={{ width: "1em", textAlign: "center" }}>|</div>
          <button onClick={() => setShowPopup(true)}>Deny</button> */}
        {/* </div> */}
      </div>
    );
  } else return <p>Loading</p>;
}
