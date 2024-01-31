import ImageAdjuster from "../../../components/ImageAdjuster";
import ImageUploader from "../../../components/ImageUploader";
import MyToolTip from "../../../components/MyToolTip";
import { FormEvent, useContext, useState } from "react";
export default function ImageComparisonTool() {
  return (
    <>
      <div className="formcontainer">
        <h1>image comparison tool</h1>
        <div className="mainform" id="imageAdjustForm">
          <div>
            <div className="ui-space-out">
              <div>
                <div>
                  How to use
                  <MyToolTip
                    content={
                      <div
                        style={{ maxWidth: "20em" }}
                        className="d-flex flex-col jc-start"
                      >
                        <div>
                          This tool helps to compare colors side-by side with
                          parameter sliders
                        </div>
                      </div>
                    }
                    id="img-type"
                  />
                </div>
              </div>
            </div>
            <div className="image-adj-container">
              <ImageAdjuster />
              <ImageAdjuster />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
