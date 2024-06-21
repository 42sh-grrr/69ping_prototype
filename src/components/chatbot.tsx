import * as classes from "./chatbot.module.scss";
import chatbot from "../assets/chatbot.png";
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Message = {
  sender: "me" | "bot",
  content: string,
};

function Chat(props: { show: boolean }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<readonly Message[]>([]);
  const [mess, setMess] = useState("");

  const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mess === "")
      return;
    setMessages([...messages, {
      content: mess,
      sender: "me",
    }, {
      content: mess.split("").reverse().join(""),
      sender: "bot",
    }]);
    setMess("");
  }, [mess]);

  useEffect(() => {
    if (!innerRef.current)
      return;
    innerRef.current.scrollTo({
      behavior: "instant",
      top: innerRef.current.scrollHeight,
    });
  }, [messages]);

  const inputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMess(e.target.value);
  }, []);

  return <div className={`${classes.chat} ${props.show ? classes.chat_shown : classes.chat_hidden}`}>
    <div className={`${classes.feed}`}>
      <div className={`${classes.feed_inner}`} ref={innerRef}>
        {messages.map(m => (
          <div className={`${classes.message}`}>
            <span className={`${classes.mess_sender}`}>
              {m.sender === "me" ? "You" : "ChatGPT"}
            </span>
            <span className={`${classes.mess_content}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>
    </div>
    <form className={`${classes.input}`} onSubmit={submit}>
      <input className={`${classes.edit}`} value={mess} onChange={inputChange} placeholder="Your message here" />
    </form>
  </div>;
}

export function ChatBot() {
  const [active, setActive] = useState(false);

  return (
    <>
      <button className={classes.icon} onClick={() => setActive(!active)}>
        <img src={chatbot} />
      </button>
      <Chat show={active} />
    </>
  );
}
