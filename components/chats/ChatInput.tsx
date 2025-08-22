import { useState } from "react";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [isKeyboard, setIsKeyboard] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <div className="bg-blue-50 px-4 py-4 border-t border-gray-200 w-[375px]">
      {isKeyboard ? (
        // ✅ 키보드 모드 UI
        <div className="flex items-center bg-white rounded-full px-3 flex-1">
          <input
            className="flex-1 outline-none px-2 py-2 text-sm"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="text-blue-500 font-semibold">
            Send
          </button>
        </div>
      ) : (
        // ✅ 기본 모드 UI (마이크 + 입력창 + 화살표 버튼)
        <div className="flex items-center gap-3">
          {/* 마이크 버튼 */}
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
              <path d="M19 11a7 7 0 01-14 0M12 19v4m-4-4h8" />
            </svg>
          </button>

          {/* 입력창 */}
          <div className="flex items-center bg-blue-50 rounded-full border border-blue-400 flex-1 px-4 py-2">
            <input
              className="flex-1 bg-blue-50 outline-none text-sm placeholder-gray-400"
              placeholder="Reply here"
              value={message}
              readOnly
              onClick={() => setIsKeyboard(true)} // 👈 클릭 시 키보드 모드 전환
            />
            <button
              onClick={sendMessage}
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
