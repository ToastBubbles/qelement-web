import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import {
  ICommentDTO,
  IElementID,
  IIdAndNumber,
  IIdAndString,
  iIdOnly,
} from "../../interfaces/general";
import { AppContext } from "../../context/context";
import { useMutation } from "react-query";
import axios from "axios";
import showToast, { Mode } from "../../utils/utils";

interface IProps {
  comment: ICommentDTO;
  closePopup: () => void;
  refetchFn: () => void;
}

export default function CommentEdit({
  comment,
  closePopup,
  refetchFn,
}: IProps) {
  const {
    state: {
      jwt: { token, payload },
      userPreferences: { payload: prefPayload },
    },
  } = useContext(AppContext);

  const defaultValues: IIdAndString = { id: -1, string: "" };

  const [commentChanges, setCommentChanges] =
    useState<IIdAndString>(defaultValues);

  const commentEditMutation = useMutation({
    mutationFn: ({ id, string }: IIdAndString) =>
      axios.post(
        `http://localhost:3000/comment/edit`,
        {
          id,
          string,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: (e) => {
      if (e.data.code == 200) {
        showToast("Comment edits saved!", Mode.Success);
        refetchFn();
        closePopup();
      } else {
        showToast("error", Mode.Error);
      }
    },
  });

  useEffect(() => {
    setCommentChanges({
      id: comment.id,
      string: comment.content,
    });
  }, [comment]);

  return (
    <div>
      <h2 style={{ marginBottom: "2em" }}>Edit comment</h2>
      <textarea
        className="comment-edit"
        value={commentChanges.string}
        onChange={(e) =>
          setCommentChanges((commentChanges) => ({
            ...commentChanges,
            ...{ string: e.target.value },
          }))
        }
      ></textarea>
      <button onClick={() => submitComment()}>Save</button>
    </div>
  );

  function submitComment() {
    if (
      commentChanges.string.length > 0 &&
      commentChanges.string.length < 1000 &&
      commentChanges.string != comment.content &&
      commentChanges.id > 0
    ) {
      commentEditMutation.mutate(commentChanges);
    } else {
      showToast("Error saving changes", Mode.Error);
    }
  }
}
