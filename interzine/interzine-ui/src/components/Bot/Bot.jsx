import "./Bot.css";
import React from "react";
import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = import.meta.env.VITE_SINEE_PAL_KEY;

function Bot() {
  const [messages, setMessages] = useState([
    {
      message: "Hi, I'm Sínee pal!🧑‍🍳",
      // sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setIsTyping(true);

    try {
      await processMessageToChatGPT(newMessages);
      setIsTyping(false);
    } catch (error) {
      console.error("Error processing the API response:", error);
      // Handle the error here, show an error message, or provide a default message
      setMessages([
        ...newMessages,
        {
          message: "Oops! Sínee pal is down at the moment",
          sender: "ChatGPT",
        },
      ]);
      // setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content:
        "responde like i'm your close friend while providing one food recommendation in one very short sentence and if no ethnicity is given ask the user what ethnic cuisines they are looking for in a straightforward enthusiastic sentence",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="chatbox-container">
      <div className="Bot">
        <div style={{ position: "relative", height: "400px", width: "300px" }}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                className="message-list" // Apply the CSS class for the message list
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="Sínee pal is cooking" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  return (
                    <Message
                      key={i}
                      model={message}
                      className={
                        message.sender === "ChatGPT" ? "system" : "user"
                      } // Apply the CSS class for the message content
                    />
                  );
                })}
              </MessageList>
              <MessageInput
                className="message-input" // Apply the CSS class for the message input
                placeholder="Type message here"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
}

export default Bot;
