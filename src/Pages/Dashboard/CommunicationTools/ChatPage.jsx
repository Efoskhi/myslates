import React from "react";
import { FaSearch, FaEllipsisH, FaPaperPlane, FaComments } from "react-icons/fa";
import MessageWindow from "../../../components/CommunicationTools/MessageWindow";
import useChats from "../../../Hooks/useChat";
import { format } from "date-fns";
import Loading from "../../../components/Layout/Loading";

const ChatPage = () => {
  const [ chatDetails, setChatDetails ] = React.useState();

  const { chats, loading, loadingMore, loadMore } = useChats();

  const handleOpenChatMessage = (chat) => {
    setChatDetails(chat);
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-300 p-4 bg-[#f8fafc]">
        <h2 className="text-xl font-bold mb-4">Inbox</h2>
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
        {loading && <Loading/>}
        <div>
        {chats.map((item, index) => {
          const name = item.student?.display_name || "Unknown";
          const photoUrl = item.student?.photo_url;
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          // handle Firestore Timestamp or seconds object
          const ts = item.latestMessage?.timestamp;
          const dateObj = ts?.toDate
            ? ts.toDate()
            : ts
            ? new Date(ts.seconds * 1000)
            : new Date();
          const timeStr = format(dateObj, "hh:mm a");
          const dateStr = format(dateObj, "MMM d");

          return (
            <div
              onClick={() => handleOpenChatMessage({ id: item.id, photoUrl, initials, name })}
              key={item.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-[#eef2ff] text-[#0598ce] flex items-center justify-center rounded-full overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold">{initials}</span>
                )}
              </div>

              {/* Name + Message */}
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-sm">{name}</h3>
                <p
                  className="text-sm text-gray-500 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.latestMessage?.message}
                </p>
              </div>

              {/* Date & Time */}
              <div className="flex flex-col items-end text-xs text-gray-500 whitespace-nowrap">
                <span>{dateStr}</span>
                <span>{timeStr}</span>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        

        {/* Chat Messages */}
        {!chatDetails && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <FaComments className="text-4xl mb-2 text-blue-400" />
            <p className="text-lg font-medium">Select a chat to view messages</p>
            <span className="text-sm text-gray-400">Start a conversation or continue an existing one.</span>
          </div>
        )}
        {chatDetails && (
          <>
            <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-[#f1f5f9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#eef2ff] text-[#0598ce] flex items-center justify-center rounded-full overflow-hidden">
                  {chatDetails.photoUrl ? (
                    <img src={chatDetails.photoUrl} alt={chatDetails.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold">{chatDetails.initials}</span>
                  )}
                </div>
                <h2 className="text-lg font-bold">{ chatDetails.name }</h2>
              </div>
              <FaEllipsisH className="text-gray-500 cursor-pointer" />
            </div>
            <MessageWindow chatId={chatDetails.id}/>
          </>
        )}

        {/* <div className="flex-1 p-4 bg-white overflow-y-auto">
          <div className="text-center text-gray-500 text-sm mb-4">25 April</div>
          <div className="flex flex-col gap-3">
            <div className="self-start bg-white p-3 rounded-lg shadow-md max-w-xs">
              Hello Wunmi
            </div>
            <div className="self-start bg-white p-3 rounded-lg shadow-md max-w-xs">
              Hello Wunmi. Have you seen the latest holographic display
              technology?
            </div>
            <div className="self-end bg-[#047aa5] text-white p-3 rounded-lg shadow-md max-w-xs">
              Hi Mr Bello, How are you doing? I have a few questions please
            </div>
          </div>
        </div> */}

        {/* Message Input */}
        {/* <div className="p-4 border-t border-gray-300 bg-white flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-md p-2"
          />
          <button className="ml-3 bg-[#047aa5] text-white p-2 rounded-md">
            <FaPaperPlane />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ChatPage;
