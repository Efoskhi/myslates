import React, { useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdAttachFile } from "react-icons/md";
import userAvatar from "../../../assets/Avatar.png";
import botAvatar from "../../../assets/botAvatar.png";
import Header from "../../../components/Layout/Header";

const FeedbackBotResponse = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
const chatEndRef = useRef(null); 
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }  };


  const handleSendMessage = async () => {
    if (input.trim() || file) {
      const newMessage = {
        text: input,
        file: file,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInput("");
      setFile(null);
      setLoading(true);

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: input },
            ],
          }),
        });

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
    }
  };

  return (
<>   
 <Header />

    <div style={{height:"70vh"}} className="w-full mx-auto relative border rounded-lg bg-white p-4">
      {/* Chat Window */}
      
      <div style={{ overflowY: 'auto'}} ref={chatEndRef} className="min-h-[70vh] overflow-y-auto p-4 space-y-4 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <img
                src={botAvatar}
                alt="Bot"
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-[#035b7c] text-white"
                  : "bg-white shadow"
              }`}
            >
              {msg.text && <p>{msg.text}</p>}
              {msg.file && (
                <div className="mt-2 flex items-center space-x-2 bg-gray-200 p-2 rounded">
                  <MdAttachFile className="text-gray-600" />
                  <span className="text-sm">{msg.file.name}</span>
                </div>
              )}
            </div>
            {msg.sender === "user" && (
              <img
                src={userAvatar}
                alt="User"
                className="w-10 h-10 rounded-full ml-3"
              />
            )}
          </div>
        ))}
        {loading && (
          <p className="text-gray-500 text-sm text-center">Bot is typing...</p>
        )}
      </div>

      {/* Input Section */}
      <div className="flex items-center mt-4 border-t pt-3">
        <label className="cursor-pointer">
          <MdAttachFile className="text-gray-600 text-2xl mr-3" />
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Ask me anything..."
          value={input}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 bg-[#035b7c] text-white p-2 rounded-lg hover:bg-blue-600"
        >
          <FiSend className="text-xl" />
        </button>
      </div>
    </div>
    </>
  );
};

export default FeedbackBotResponse;
