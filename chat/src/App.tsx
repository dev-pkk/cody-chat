import "./App.css";

import { Bot, Conversation, Message } from "./types";
import { useEffect, useState } from "react";

import { Loader } from "./Loader";
import api from "./utils/api";
import { v4 as uuid } from 'uuid';

let cnvs: Conversation[] = [];

function App(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);

  // const send = async () => {
  //   setMessages((prev) => [
  //     {
  //       id: uuid(),
  //       content: message,
  //       conversation_id: selectedConversation?.id,
  //       machine: false,
  //       failed_responding: false,
  //       flagged: false,
  //       created_at: 42,
  //     } as Message,
  //     ...prev,
  //   ]);
  //   const params = {
  //     content: message,
  //     conversation_id: selectedConversation?.id,
  //   };
  //   setMessage("");
  //   setLoading(true);
  //   try {
  //     const response = await api.post("messages", params);
  //     if (response.data.data != undefined) {
  //       setMessages((prev) => [response.data.data as Message, ...prev]);
  //     } else {
  //       alert(response.data.message as string);
  //     }
  //   } catch (error) {
  //     console.log("Error in get answer", error);
  //   }
  //   setLoading(false);
  // };

  const send = async () => {
    setMessages((prev) => [createMessage(message, false), ...prev]);
    const params = {
      content: message,
      conversation_id: selectedConversation?.id,
      redirect: false,
    };
    setMessage("");
    try {
      const response = await api.post("messages/stream", params);
      if (response.data.data?.stream_url != undefined) {
        setMessages(prev => {
          const msgs = [...prev];
          msgs.unshift(createMessage("Fetching...", true));
          return msgs;
        });
        readStream(response.data.data.stream_url);
        // setMessages((prev) => [response.data.data as Message, ...prev]);
      } else {
        alert(response.data.message as string);
      }
    } catch (error) {
      console.log("Error in get answer", error);
    }
  };

  const readStream = (link: string) => {
    let msg = "";
    const evtSource = new EventSource(link);
    evtSource.onmessage = (event) => {
      const data = event.data;
      if (data === "[END]") {
        evtSource.close();
      } else if (data !== "[START]") {
        msg += JSON.parse(data).chunk;
        setMessages(prev => {
          const msgs = [...prev];
          msgs[0] = createMessage(msg, true);
          return msgs;
        });
      }
    };
  };

  const createMessage = (msg: string, machine: boolean): Message =>
    ({
      id: uuid(),
      content: msg,
      conversation_id: selectedConversation?.id,
      machine: machine,
      failed_responding: false,
      flagged: false,
      created_at: 42,
    } as Message);

  const getBots = async () => {
    try {
      const response = await api.get("bots");
      if (response.data?.data?.length ?? 0 > 0) {
        setBots(response.data.data as Bot[]);
      } else {
        alert("No bots fount.");
      }
    } catch (error) {
      console.log("Error in get bots", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const response = await api.get("conversations");
        if (response.data?.data?.length ?? 0 > 0) {
          cnvs = response.data.data as Conversation[];
          getBots();
        } else {
          alert("No conversations fount.");
        }
      } catch (error) {
        console.log("Error in get bots", error);
      }
    };
    getConversations();
  }, []);

  const getMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `messages?conversation_id=${selectedConversation?.id}`
      );
      if (response.data?.data?.length ?? 0 > 0) {
        setMessages(response.data.data as Message[]);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.log("Error in get bots", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedBot != null) {
      const cnv = cnvs.filter((item) => item.bot_id == selectedBot.id);
      if (cnv.length > 0) {
        setConversations(cnv);
        setSelectedConversation(cnv[0]);
      } else {
        alert("Selected bot don't have any conversation.");
      }
    }
  }, [selectedBot]);

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  return (
    <>
      <div>
        <header className="main-header">
          <h1 className="header">Cody AI</h1>
        <div className="bots">
          <div className="fetch-bots">
            <h1>Cody Bots</h1>{" "}
            {/* <button className="get-bot-button" onClick={getBots}>
              GET BOTS
            </button> */}
          </div>
          {bots.length > 0 ? (
            <div className="bots-list">
              {bots.map((value, index) => (
                <div key={index}>
                  <span>
                    {value.name}
                    {selectedBot?.id === value.id ? (
                      <span className="selected">✔</span>
                    ) : (
                      <a
                        className="select-btn"
                        onClick={() => setSelectedBot(value)}
                      >
                        SET
                      </a>
                    )}
                  </span>
                  <p
                    className={
                      index === bots.length - 1 ? "last-child" : undefined
                    }
                  >
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Fetching bots...</p>
          )}
        </div>
        </header>
        <div className="messages">
          {selectedConversation &&
            (messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  className={msg.machine ? "machine message" : "user message"}
                  key={index}
                >
                  <span>{msg.content}</span>
                </div>
              ))
            ) : (
              <h1 className="no-message">No message(s) found.</h1>
            ))}
        </div>
        <div className="footer">
          <div>
          {conversations.length > 0 &&
            conversations.map((value, index) => (
              <span
                className="conversation"
                onClick={() => setSelectedConversation(value)}
                key={index}
              >
                {value.name}
                {selectedConversation?.id === value.id && (
                  <span className="selected">✔</span>
                )}
              </span>
            ))}
        </div>
        <div className="form">
          <input
            type="text"
            placeholder="Send a message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button onClick={send}>SEND</button>
        </div>
        </div>
        {loading && <Loader />}
      </div>
    </>
  );
}

export default App;
