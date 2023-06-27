import React, { useState } from "react";
import AllColors from "../../components/AllColors";
export default function AllColorsView() {

  return (
    <>
      <div className="main-container">
        <div className="right-col">
          <div className="lower-center">
            <div className="color">Colors</div>
            <div className="fake-hr"></div>
            <AllColors />
          </div>
        </div>
      </div>
    </>
  );
}
