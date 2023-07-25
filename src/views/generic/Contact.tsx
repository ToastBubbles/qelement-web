export default function Contact() {
  return (
    <>
      <div className="page-content-wrapper">
        <div className="page-content-wide2 flex-col ai-center">
          <h1>Contact Us</h1>
          <div className="w-50 d-flex flex-col ai-center">
            <div style={{ textAlign: "left" }} className="w-100">
              subject
            </div>
            <input
              className="w-100"
              maxLength={255}
              // onChange={(e) =>
              //   setNewMessage((newMessage) => ({
              //     ...newMessage,
              //     ...{ subject: e.target.value },
              //   }))
              // }
            ></input>
            <div style={{ textAlign: "left" }} className="w-100">
              body (255 Characters)
            </div>
            <textarea
              className="w-100"
              maxLength={255}
              rows={20}
              // onChange={(e) =>
              //   setNewMessage((newMessage) => ({
              //     ...newMessage,
              //     ...{ body: e.target.value },
              //   }))
              // }
            ></textarea>
            <button
            // onClick={(e) => {
            //   sendMessage();
            // }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
