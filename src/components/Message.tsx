import { Link } from "react-router-dom";
import { IExtendedMessageDTO, IMessageDTO } from "../interfaces/general";
import axios from "axios";
import { useMutation } from "react-query";
import showToast, { Mode, formatDate } from "../utils/utils";
import { useState } from "react";

interface IMessageProps {
  msg: IExtendedMessageDTO;
  sent: boolean;
}



function Message({ msg, sent }: IMessageProps) {
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  let displayname: string;
  sent ? (displayname = msg.recipientName) : (displayname = msg.senderName);
  const messageDeletionMutation = useMutation({
    mutationFn: (messageId: number) =>
      axios.post<IMessageDTO>(
        `http://localhost:3000/message/delete/${messageId}`
      ),
    onSuccess: () => {
      showToast("Message deleted", Mode.Info);
      setIsDeleted(true);
    },
  });
  if (!isDeleted)
    return (
      <div className="msg">
        <Link
          className={"fg-1" + (!msg.read ? " msg-unread" : "")}
          to={`/profile/messages/${msg.id}`}
        >
          {msg.subject}
        </Link>
        <div className="clickable">
          {displayname == undefined ? "loading" : displayname}
        </div>
        <div>{formatDate(msg.createdAt)}</div>
        <div
          className="clickable"
          onClick={() => messageDeletionMutation.mutate(msg.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="18"
            fill="currentColor"
            className="lt-red"
            viewBox="0 0 16 16"
          >
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
          </svg>
        </div>
      </div>
    );
}

export default Message;
