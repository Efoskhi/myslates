import React, { useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import botAvatar from "../../../assets/botAvatar.png";
import userAvatar from "../../../assets/Avatar.png";
import Header from "../../../components/Layout/Header";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Explain the concept of...",
    "How do I manage the classroom when...",
    "How can I engage my students in...",
  ];
  const chatEndRef = useRef(null); 
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }  };
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const newMessage = {
      text,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);
    setShowIntro(false);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: text },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response from GPT-4");
      }

      const data = await response.json();
      const botMessage = data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        {
          text: botMessage,
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Error fetching GPT-4 response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom()
    }
  };

  return (<>
  
  <Header/>
    <div style={{height: "90vh"}} className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-100">
    
      {showIntro ? (
        <>
          <div className="text-center mb-4">
            <img
              src={botAvatar}
              alt="Bot"
              className="w-16 h-16 mx-auto rounded-full"
            />
            <h2 className="text-xl font-semibold mt-2">Hi, I'm Weezer</h2>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              I'm your AI-powered assistant designed to make your teaching
              experience smoother and more efficient. Here are some ideas to get
              you started:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 max-w-lg justify-center">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full hover:bg-blue-300"
                onClick={() => setInput(question)}
              >
                + {question}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div ref={chatEndRef} className="w-full mt-6 bg-transparent rounded-lg p-4 overflow-y-auto h-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-center mb-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <img
                  src={botAvatar}
                  alt="Bot"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-[#035b7c] text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <img
                  src={userAvatar}
                  alt="User"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div
          style={{
            textAlign: "center",
            width: "100%",
            color: "dimgray",
            marginTop: 10,
          }}
        >
          Reasoning...
        </div>
      )}

      <div
        className={`w-[80%] flex items-center mt-4 border-t ${
          showIntro ? "pt-[40vh]" : "pt-4"
        }`}
      >
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(input);
            }
          }}
          disabled={loading}
        />
        <button
          onClick={() => handleSendMessage(input)}
          className="ml-3 bg-[#035b7c] text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          <FiSend className="text-xl" />
        </button>
      </div>
    </div>
  </>

  );
};

export default Chatbot;
