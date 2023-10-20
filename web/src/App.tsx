import "./App.css";

import { useEffect, useState } from "react";

import { Loader } from "./Loader";
import { Message } from "./types";
import api from "./utils/api";
import { v4 as uuid } from 'uuid';

function App(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    getMessages()
  }, [])

  const send = async () => {
    setMessages((prev) => [createMessage(message, false), ...prev]);
    const params = {
      content: message,
      conversation_id: "k8mep2X7NbMy",
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
      conversation_id: "k8mep2X7NbMy",
      machine: machine,
      failed_responding: false,
      flagged: false,
      created_at: 42,
    } as Message);

  const getMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `messages?conversation_id=k8mep2X7NbMy`
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

  return (
    <div>
      <div className="messages">
        {(messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                className={msg.machine ? "machine message" : "user message"}
                key={index}
              >
                <span>{msg.content}</span>
              </div>
            ))
          ) : (
            <h1 className="no-message">No message(s) yet.</h1>
          ))}
      </div>
      <div className="footer">
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
  );
}

export default App;
