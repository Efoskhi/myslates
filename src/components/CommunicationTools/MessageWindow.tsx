import React, { useRef, useEffect, useCallback, useState } from "react";
import { format } from "date-fns";
import useChatMessages from "../../Hooks/useChatMessages";
import AvatarPlaceholder from "../../assets/Avatar.png";
import { FaPaperPlane } from "react-icons/fa";
import Loading from "../Layout/Loading";

type ChatWindowProps = {
  chatId: string;
};

const MessageWindow = ({ chatId }: ChatWindowProps) => {
  const {
    messages,
    loading,
    loadingMore,
    containerRef,
    loadMore,
    sendMessage,
  } = useChatMessages(chatId);

  const [inputValue, setInputValue] = useState("");

  // Scroll to bottom whenever new messages arrive
  // useEffect(() => {
  //   containerRef.current?.scrollTo({
  //     top: containerRef.current.scrollHeight,
  //     behavior: "smooth",
  //   });
  // }, [messages.length]);

  // Handler for infinite scroll (load older on scroll to top)
  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (e.currentTarget.scrollTop === 0 && !loadingMore) {
        loadMore();
      }
    },
    [loadMore, loadingMore]
  );

  // Group messages by date string
  const grouped = React.useMemo(() => {
    const groups: Record<string, typeof messages> = {};
    messages.forEach((msg) => {
      const d = new Date(
        // handle Firestore Timestamp or plain {seconds}
        msg.timestamp?.toDate
          ? msg.timestamp.toDate()
          : msg.timestamp.seconds * 1000
      );
      const dateStr = format(d, "MMMM d, yyyy");
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(msg);
    });
    // return as array of { date, messages } sorted by date
    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }));
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await sendMessage(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded">
      {/* Messages Container */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {loading && <Loading/>}
        {loadingMore && (
          <p className="text-center text-sm text-gray-500">Loading more…</p>
        )}
        {!loading &&
          grouped.map((group) => (
            <div key={group.date}>
              <div className="text-center text-gray-500 text-sm my-2">
                {group.date}
              </div>
              {group.messages.map((msg: any) => {
                const isTeacher = msg.sender?.role === "teacher";
                const avatarUrl =
                  msg.sender?.photo_url || AvatarPlaceholder;
                const d = msg.timestamp?.toDate
                  ? msg.timestamp.toDate()
                  : new Date(msg.timestamp.seconds * 1000);
                const time = format(d, "hh:mm a");
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end ${
                      isTeacher ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* avatar on left for student, right for teacher */}
                    {!isTeacher && (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-white mt-2 ${
                        isTeacher ? "bg-[#047aa5]" : "bg-gray-600"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <div className="text-right text-xs text-gray-200 mt-1">
                        {time}
                      </div>
                    </div>
                    {isTeacher && (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full ml-2"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t p-3 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        <button type="submit" className="ml-3 bg-[#047aa5] text-white p-2 rounded-md">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default MessageWindow;