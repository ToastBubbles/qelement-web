import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Message from "../../../components/Message";
import { AppContext } from "../../../context/context";
import {
  IAPIResponse,
  IExtendedMessageDTO,
  IMailbox,
  IMessageDTO,
  user,
} from "../../../interfaces/general";
import showToast, { Mode } from "../../../utils/utils";
import { IQelementError } from "../../../interfaces/error";

export default function AllMessagesView() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [newMessage, setNewMessage] = useState<IMessageDTO>({
    recipientId: -1,
    senderId: -1,
    subject: "",
    body: "",
  });
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientIDGetter, setRecipientIDGetter] = useState<boolean>(false);
  const [getMyMail, setGetMyMail] = useState<boolean>(false);
  const [isBadRecipient, setIsBadRecipient] = useState<boolean>(false);
  const [myMessages, setMyMessages] = useState<IExtendedMessageDTO[]>();
  const [mySentMessages, setMySentMessages] = useState<IExtendedMessageDTO[]>();
  const {
    state: {
      jwt: { token, payload },
    },
  } = useContext(AppContext);

  // const {
  //   data: recipID,
  //   isLoading,
  //   error,
  //   isFetched,
  //   refetch,
  // } = useQuery(
  //   "getID",
  //   () => {
  //     try {
  //       if (recipientName.length > 1) {
  //         console.log("calling api with", recipientName);
  //         axios
  //           .get<user | IAPIResponse>(
  //             `http://localhost:3000/user/username/${recipientName.trim()}`
  //           )
  //           .then((res) => {
  //             if ("code" in res.data && res.data?.code == 404) {
  //               showToast("Recipient does not exist", Mode.Error);
  //               setIsBadRecipient(true);
  //             } else if ("id" in res.data) {
  //               let data = res.data as user;
  //               console.log(res.data);
  //               setNewMessage((newMessage) => ({
  //                 ...newMessage,
  //                 ...{ recipientId: data.id },
  //               }));
  //               setIsBadRecipient(false);
  //             }
  //           });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   {
  //     enabled: recipientIDGetter,
  //   }
  // );

  useQuery(
    "getMsgs",
    () => {
      try {
        console.log("getting messages");
        axios
          .get<IMailbox>(
            `http://localhost:3000/message/getAllByUserId/${newMessage.senderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log("data:", res.data);
            setMyMessages(res.data.inbox);
            setMySentMessages(res.data.outbox);
          });
      } catch (error) {
        console.log(error);
      }
    },
    {
      enabled: getMyMail,
    }
  );

  useEffect(() => {
    // console.log(payload);
    if (payload && payload.username)
      if (
        recipientName.trim().toLowerCase() == payload.username.toLowerCase()
      ) {
        showToast("You can't send messages to yourself", Mode.Warning);
        setIsBadRecipient(true);
      } else {
        // refetch();
      }
  }, [recipientIDGetter, payload, recipientName]);

  useEffect(() => {
    if (newMessage.senderId != -1) setGetMyMail(true);
  }, [newMessage.senderId]);

  const messageMutation = useMutation({
    mutationFn: (message: IMessageDTO) =>
      axios.post<IMessageDTO>(`http://localhost:3000/message/send`, message, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    // onSuccess: () => {},
  });
  function sendMessage() {
    console.log("attempting send");
    console.log(newMessage);

    if (
      newMessage.body.length > 0 &&
      newMessage.subject.length > 0 &&
      newMessage.recipientId != -1 &&
      newMessage.senderId != -1 &&
      !isBadRecipient
    ) {
      messageMutation.mutate(newMessage);
      showToast(`Message sent to ${recipientName}`, Mode.Success);
    } else {
      showToast(`Error`, Mode.Error);
    }
  }
  // if (!isLoading && data) return data.data.id;
  if (newMessage.senderId != payload.id && !!payload.id) {
    setNewMessage((newMessage) => ({
      ...newMessage,
      ...{ senderId: payload.id },
    }));
  }

  return (
    <>
      <div className="mx-w">
        <h1>messages</h1>
        <div className="msg-tab-container">
          <div
            className={
              "clickable msg-tab" + (activeTab == 0 ? " msg-tab-active" : "")
            }
            onClick={() => setActiveTab(0)}
          >
            Inbox
          </div>
          <div
            className={
              "clickable msg-tab" + (activeTab == 1 ? " msg-tab-active" : "")
            }
            onClick={() => setActiveTab(1)}
          >
            Outbox
          </div>
          <div
            className={
              "clickable msg-tab" + (activeTab == 2 ? " msg-tab-active" : "")
            }
            onClick={() => setActiveTab(2)}
          >
            Send New Message
          </div>
        </div>
        <div className="message-container">
          {activeTab == 0 &&
            (myMessages?.length != 0 ? (
              myMessages?.map((msg: IExtendedMessageDTO) => (
                <Message msg={msg} sent={false} />
              ))
            ) : (
              <p>no messages</p>
            ))}
          {activeTab == 1 &&
            (mySentMessages?.length != 0 ? (
              mySentMessages?.map((msg: IExtendedMessageDTO) => (
                <Message msg={msg} sent />
              ))
            ) : (
              <p>no messages</p>
            ))}
          {activeTab == 2 && (
            <div className="msg-send-new">
              <div>recipient</div>
              <input
                className={"" + (isBadRecipient ? " bad-recipient" : "")}
                onChange={(e) => setRecipientName(e.target.value)}
                onBlur={(e) => {
                  // getRecipientId(e.target.value)
                  e.target.value.length > 1 &&
                    setRecipientIDGetter(!recipientIDGetter);
                }}
              ></input>
              <div>subject</div>
              <input
                maxLength={255}
                onChange={(e) =>
                  setNewMessage((newMessage) => ({
                    ...newMessage,
                    ...{ subject: e.target.value },
                  }))
                }
              ></input>
              <div>body (255 Characters)</div>
              <textarea
                maxLength={255}
                rows={20}
                onChange={(e) =>
                  setNewMessage((newMessage) => ({
                    ...newMessage,
                    ...{ body: e.target.value },
                  }))
                }
              ></textarea>
              <button
                onClick={() => {
                  sendMessage();
                }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
