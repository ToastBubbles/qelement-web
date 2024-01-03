import { useState } from "react";
import { ICommentDTO, IDeletionDTO } from "../interfaces/general";
import showToast, { Mode, formatDate } from "../utils/utils";
import OnHoverX from "./OnHoverX";
import { useMutation } from "react-query";
import axios from "axios";

interface IProps {
  data: ICommentDTO;
  isAdmin: boolean;
  userId: number;
  refetchFn: () => void;
}

export default function Comment({ data, isAdmin, userId, refetchFn }: IProps) {
  const [isHovered, setHovered] = useState(false);
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const commentDeletionMutation = useMutation({
    mutationFn: (removalDTO: IDeletionDTO) =>
      axios.post(`http://localhost:3000/comment/remove`, removalDTO),
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
      {isHovered && showX() && <OnHoverX onClickFn={deleteComment} />}
      <img className="comment-pic" src="/img/blank_profile.webp" />
      <div className="comment-content w-100">
        <div className="w-100 d-flex jc-space-b">
          <div className="comment-username">{data.creator.name}</div>
          <div className="smalldate">{formatDate(data.createdAt)}</div>
        </div>
        <div className="comment-body">{data.content}</div>
      </div>
    </div>
  );

  function showX(): boolean {
    if (data.creator.id == userId || isAdmin) {
      return true;
    }
    return false;
  }

  function deleteComment() {
    commentDeletionMutation.mutate({
      itemToDeleteId: data.id,
      userId,
    });
  }
}
