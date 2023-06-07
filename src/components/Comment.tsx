import React from "react";

function idLookup(id: number) {
  return {
    user: "jim",
    content: "text body",
  };
}

function Comment({ id = 0 }) {
  let commentObject = idLookup(id);
  return (
    <div className="comment">
      <img className="comment-pic" src="/img/blank_profile.webp" />
      <div className="comment-content">
        <div className="comment-username">{commentObject.user}</div>
        <div className="comment-body">{commentObject.content}</div>
      </div>
    </div>
  );
}

export default Comment;
