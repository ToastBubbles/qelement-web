
import { ICommentDTO } from "../interfaces/general";
import { formatDate } from "../utils/utils";

interface IProps {
  data: ICommentDTO;
}

function Comment({ data }: IProps) {
  return (
    <div className="comment">
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
}

export default Comment;
