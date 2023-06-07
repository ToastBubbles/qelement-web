import axios from "axios";
import { useState, useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { AppContext } from "../../../context/context";
import { IExtendedMessageDTO } from "../../../interfaces/general";


export default function SingleMessageView() {
  const navigate = useNavigate();
  const { messageId } = useParams();

  // const [userId, setUserId] = useState<number>(-1);
  const [hasMarkedRead, setHasMarkedRead] = useState<boolean>(false);
  // const [message, setMessage] = useState<IExtendedMessageDTO>();

  const {
    state: {
      jwt: { token, payload },
    },
    dispatch,
  } = useContext(AppContext);

  const {
    data: msgData,
    isLoading: msgIsLoading,
    error: msgError,
  } = useQuery({
    queryKey: "individualMessage",
    queryFn: () => {
      console.log("sending message with id of", messageId);
      return axios.get<IExtendedMessageDTO>(
        `http://localhost:3000/message/${messageId}`
      );
    },
    enabled: true,
    retry: true,
  });

  // const msgMutation = useMutation({
  //   mutationFn: () =>
  //     axios.post<null>(`http://localhost:3000/message/${message?.id}`),
  //   onSuccess: () => {},
  // });

  if (msgError) {
    navigate("/404");
  }
  // if (!msgIsLoading) {
  //   setMessage(msgData?.data);
  // }

  /// return me
  // if (!!msgData?.data && !!payload.id) {
  //   if (
  //     !msgData?.data.read &&
  //     msgData?.data.recipientId == payload.id &&
  //     !hasMarkedRead
  //   ) {
  //     msgMutation.mutate();
  //     setHasMarkedRead(true);
  //   }
  // }

  // useEffect(() => {
  //   console.log("setting message");
  //   console.log("message:", msgData?.data, typeof msgData?.data);

  //   setMessage(msgData?.data);
  // }, [!!msgData?.data]);

  return msgIsLoading ? (
    <p>loading...</p>
  ) : (
    <>
      <div className="page-wrapper">
        <div>
          <div>subject: {msgData?.data?.subject}</div>
          <div>sent: {formatDate(msgData?.data?.createdAt as string)}</div>
          <div>from: {msgData?.data?.senderName}</div>
          <div>to: {msgData?.data?.recipientName}</div>
        </div>
        <div>{msgData?.data?.body}</div>
      </div>
    </>
  );
}

function formatDate(dateStr: string) {
  var date = new Date(dateStr);

  var now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  );

  let thisdate = new Date(now_utc);
  return (
    thisdate.toDateString() +
    " @ " +
    thisdate.toLocaleTimeString().replace(":00 ", " ")
  );
}
