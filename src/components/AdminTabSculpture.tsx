import { ReactNode, useContext, useState } from "react";
import {
  IIdStringBool,
  IQPartDTOInclude,
  ISculptureDTO,
} from "../interfaces/general";
import GenericPopup from "./GenericPopup";
import ElementIDEdit from "./Edit Components/ElementIDEdit";
import showToast, { Mode, imagePath } from "../utils/utils";
import ImageEdit from "./Edit Components/ImageEdit";
import RecentQPart from "./RecentQPart";
import SculptureInventoryAdmin from "./Edit Components/SculptureInventoryAdmin";
import { useMutation } from "react-query";
import axios from "axios";
import { AppContext } from "../context/context";
import KeywordAdd from "./Edit Components/KeywordAdd";

interface IProps {
  sculpture: ISculptureDTO;
  refetchFn: () => void;
}

export default function AdminTabSculpture({ sculpture, refetchFn }: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const [popupContent, setPopupContent] = useState<ReactNode>();

  const [popupOpen, setPopupOpen] = useState<boolean>();

  const keywordMutation = useMutation({
    mutationFn: (dto: IIdStringBool) =>
      axios.post(`http://localhost:3000/sculpture/keyword`, dto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e, dto) => {
      if (e.data.code == 200) {
        showToast(
          `${dto.string} has been successfully ${
            dto.bool ? "added" : "removed"
          }!`,
          Mode.Success
        );

        refetchFn();
        closePopUp();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  return (
    <>
      {popupOpen && (
        <GenericPopup content={popupContent} closePopup={closePopUp} />
      )}
      <div>
        <div>Element IDs:</div>
      </div>
      <div>Note:</div>
      <div>
        {sculpture.note ? (
          <div>{sculpture.note}</div>
        ) : (
          <div className="grey-txt">None</div>
        )}
      </div>
      <div>
        <div>Keywords (Click to remove):</div>
        <div className="clickable" onClick={handleClickAddKeyword}>
          Add Keyword
        </div>
      </div>
      <div
        className="d-flex flex-wrap overflow-y-auto"
        style={{ justifyContent: "start" }}
      >
        {sculpture.keywords.split(";").map((keyword) => (
          <div
            onClick={() => keywordAddOrRemove(keyword, "remove")}
            className="new-keyword clickable"
          >
            {keyword}
          </div>
        ))}
      </div>
      <div>Images</div>
      <div className="admin-image-container">
        {sculpture.images.map((image) => {
          return (
            <div
              key={image.id}
              className={"admin-image-card clickable"}
              onClick={() => {
                setPopupContent(
                  <ImageEdit
                    image={image}
                    disableTypeMutation={true}
                    closePopup={closePopUp}
                    refetchFn={refetchFn}
                  />
                );
                setPopupOpen(true);
              }}
            >
              <div
                className={image.approvalDate == null ? " not-approved" : ""}
              >
                <div className="admin-image-div">
                  <img src={imagePath + image.fileName} alt="brick" />
                </div>
                <div className="d-flex flex-col ai-start">
                  <div className={"status-tag img-" + image.type}>
                    {image.type}
                  </div>

                  <div>
                    {image.isPrimary && (
                      <div className="primary-image-tag status-tag">
                        Primary
                      </div>
                    )}
                    {image.approvalDate == null && (
                      <div style={{ fontSize: "0.55em" }}>Not Approved</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="d-flex w-100 flex-col">
        <div>Parts</div>
        <div className="rib-container">
          {sculpture.inventory.map((qpart) => (
            <SculptureInventoryAdmin
              qpart={qpart}
              sculptureId={sculpture.id}
              key={qpart.id}
              refetchFn={refetchFn}
            />
          ))}
        </div>
      </div>
    </>
  );

  function handleClickAddKeyword() {
    setPopupContent(
      <KeywordAdd
        keywords={sculpture.keywords.split(";")}
        fn={keywordAddOrRemove}
      />
    );

    setPopupOpen(true);
  }

  function keywordAddOrRemove(kw: string, addOrRemove: string) {
    let bool: boolean;
    if (addOrRemove == "remove") {
      bool = false;
      setPopupContent(
        <div>
          <div>Are you sure you want to remove the following keyword?</div>
          <div style={{ margin: "1em 0", fontWeight: "bold" }}>{kw}</div>
          <button
            onClick={() => {
              keywordMutation.mutate({ id: sculpture.id, string: kw, bool });
            }}
          >
            Delete
          </button>
        </div>
      );
      setPopupOpen(true);
    } else if (addOrRemove == "add") {
      bool = true;
      keywordMutation.mutate({ id: sculpture.id, string: kw, bool });
    } else {
      showToast("Improper condition!", Mode.Error);
      return;
    }
  }

  function closePopUp() {
    setPopupOpen(false);
  }
}
