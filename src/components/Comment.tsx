import { ReactNode, useContext, useState } from "react";
import { ICommentDTO, IDeletionDTO } from "../interfaces/general";
import showToast, { Mode, formatDate, howLongAgo } from "../utils/utils";
import OnHoverX from "./OnHoverX";
import { useMutation } from "react-query";
import axios from "axios";
import { AppContext } from "../context/context";
import GenericPopup from "./GenericPopup";
import CommentEdit from "./Edit Components/CommentEdit";
import { Link } from "react-router-dom";

interface IProps {
  data: ICommentDTO;
  isAdmin?: boolean;
  viewerId: number;
  getter: string;
  setter: (val: string) => void;
  refetchFn: () => void;
}

export default function Comment({
  data,
  isAdmin,
  viewerId,
  getter,
  setter,
  refetchFn,
}: IProps) {
  const {
    state: {
      jwt: { token },
    },
  } = useContext(AppContext);
  const [isHovered, setHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [content, setContent] = useState<ReactNode>(<></>);
  const [commentEdits, setCommentEdits] = useState<string>(data.content);
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const commentDeletionMutation = useMutation({
    mutationFn: (removalDTO: IDeletionDTO) =>
      axios.post(`http://localhost:3000/comment/remove`, removalDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast(`Successfully removed comment!`, Mode.Success);
        refetchFn();
      } else {
        showToast(`Error removing part!`, Mode.Warning);
        console.log(e.data);
      }
    },
  });
  return (
    <div
      className="comment"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* {isHovered && showX() && <OnHoverX onClickFn={deleteComment} />} */}
      {showPopup && <GenericPopup closePopup={closePopup} content={content} />}
      <div className="d-flex flex-col w-100">
        <div className="d-flex w-100">
          <img className="comment-pic" src="/img/blank_profile.webp" />
          <div className="comment-content w-100">
            <div className="w-100 d-flex jc-space-b ai-base">
              <div className="comment-username">{data.creator.name}</div>
              <div className="smalldate fg-1">
                {howLongAgo(data.createdAt)}{" "}
                {data.edited ? (
                  <>
                    {"-"}
                    <span className="italic"> Edited</span>
                  </>
                ) : (
                  <></>
                )}
              </div>
              {isHovered && (
                <>
                  {showX() && (
                    <>
                      <div className="comment-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          className="clickable"
                          name="delete-icon"
                          fill="#808080"
                          onClick={() => {
                            setContent(
                              <div>
                                <div style={{ marginBottom: "2em" }}>
                                  Are you sure you wish to delete this comment?
                                </div>
                                <button onClick={() => deleteComment()}>
                                  Delete
                                </button>
                              </div>
                            );
                            setShowPopup(true);
                          }}
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                      </div>
                      <div className="comment-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          className="clickable"
                          onClick={() => {
                            setContent(
                              <CommentEdit
                                comment={data}
                                refetchFn={refetchFn}
                                closePopup={closePopup}
                              />
                            );
                            setShowPopup(true);
                          }}
                          name="edit-icon"
                          fill="#808080"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                        </svg>
                      </div>
                    </>
                  )}
                  <div className="comment-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      className="clickable"
                      name="reply-icon"
                      onClick={() => {
                        addMention();
                      }}
                      fill="#808080"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
                    </svg>
                  </div>
                </>
              )}
            </div>
            <div className="comment-body">{formatComment(data.content)}</div>
          </div>
        </div>
      </div>
    </div>
  );
  function formatComment(content: string) {
    let key = 0;
    const individualWords = content
      .split(/\s+/)
      .filter((word) => word.length > 0);

    let output: JSX.Element[] = [];
    let possibleMentions: string[] = [];

    for (let i = 0; i < individualWords.length; i++) {
      if (individualWords[i].charAt(0) == "@") {
        let chars: string[] = [];
        const regex = /[a-zA-Z0-9._]/;
        for (let l = 0; l < individualWords[i].length; l++) {
          let char = individualWords[i][l];
          if (l == 0) chars.push(char);
          else if (regex.test(char)) {
            chars.push(char);
          } else {
            break;
          }
        }
        let mention = chars.join("");
        // console.log(chars);

        if (mention.length > 2) possibleMentions.push(mention);
      }
    }

    interface obj {
      content: string;
      link: boolean;
    }
    let objs: obj[] = [];
    let condensedObjs: obj[] = [];
    // if (possibleMentions.length > 0) {
    const words = content.split(/(\s+)/).filter((word) => word.length > 0);

    for (const word of words) {
      objs.push({
        content: word,
        link: possibleMentions.includes(word),
      });
    }
    for (let i = 0; i < objs.length; i++) {
      if (
        i === 0 ||
        objs[i].link ||
        condensedObjs[condensedObjs.length - 1].link
      ) {
        condensedObjs.push(objs[i]);
      } else {
        condensedObjs[condensedObjs.length - 1].content +=
          " " + objs[i].content;
      }
    }
    for (let obj of condensedObjs) {
      if (obj.link) {
        output.push(
          <Link
            key={key}
            className="comment-link"
            to={`/profile/${obj.content.substring(1)}`}
          >
            {obj.content.substring(1)}
          </Link>
        );
      } else {
        output.push(<span key={key}>{obj.content}</span>);
      }
      key++;
    }
    // }

    return <div>{output}</div>;
  }

  function showX(): boolean {
    if (data.creator.id == viewerId || isAdmin) {
      return true;
    }
    return false;
  }

  function deleteComment() {
    commentDeletionMutation.mutate({
      itemToDeleteId: data.id,
      userId: viewerId,
    });
  }

  function addMention() {
    const mention = "@" + data.creator.name + " ";
    if (getter.includes(mention.trim())) return;
    if (getter.length == 0) {
      setter(mention);
    } else {
      const updatedContent =
        getter.charAt(getter.length - 1) === " "
          ? getter + mention
          : getter + " " + mention;
      setter(updatedContent);
    }
  }

  function closePopup() {
    setShowPopup(false);
    setContent(<></>);
    setCommentEdits(data.content);
  }
}
