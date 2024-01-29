import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { IAPIResponse, IExtendedMessageDTO } from "../../../interfaces/general";
import { formatDate } from "../../../utils/utils";
import { useContext } from "react";
import { AppContext } from "../../../context/context";

export default function SingleMessageView() {
  const {
    state: {
      jwt: { token },
    },
  } = useContext(AppContext);
  const navigate = useNavigate();
  const { messageId } = useParams();

  const {
    data: msgData,
    isLoading: msgIsLoading,
    error: msgError,
  } = useQuery({
    queryKey: "individualMessage",
    queryFn: () => {
      console.log("sending message with id of", messageId);
      return axios.get<IExtendedMessageDTO>(
        `http://localhost:3000/message/getOneById/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    enabled: true,
    retry: true,
  });

  if (msgError) {
    navigate("/404");
  }

  const messageReadMutation = useMutation({
    mutationFn: () =>
      axios.post<IAPIResponse>(
        `http://localhost:3000/message/read/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    // onSuccess: () => {},
  });

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
  if (!msgIsLoading) {
    messageReadMutation.mutate();
    return (
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
  } else {
    return <p>loading...</p>;
  }
}
