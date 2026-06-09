import { useState } from "react";
import API from "../services/api";

function FitnessChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "coach",
      text: "Hello! I am your FitFlow AI Fitness Coach. Ask me anything about exercises, forms, muscle targets, nutrition schedules, or motivation hacks!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/chat/ask",
        { question: userMessage.text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const coachMessage = {
        sender: "coach",
        text: res.data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMessage]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "coach",
          text: "Sorry, I had trouble processing that request. Please try asking again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-12rem)] animate-[fadeIn_0.4s_ease-out]">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-indigo-600/10 border border-indigo-550/30 flex items-center justify-center text-2xl">
          🤖
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">AI Fitness Coach</h1>
          <p className="text-slate-500 text-sm mt-0.5">Your 24/7 personal training assistant.</p>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white border border-slate-850 rounded-3xl p-6 overflow-y-auto space-y-4 min-h-0 custom-scrollbar">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";
          return (
            <div key={index} className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                isUser
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-indigo-600 text-slate-900"
              }`}>
                {isUser ? "👤" : "🤖"}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm relative ${
                isUser
                  ? "bg-white text-slate-800 rounded-tr-none border border-slate-200"
                  : "bg-indigo-50 text-slate-800 rounded-tl-none border border-indigo-100"
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="text-[10px] text-slate-500 block mt-2 text-right">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-slate-900 flex items-center justify-center flex-shrink-0 text-sm">
              🤖
            </div>
            <div className="bg-[#151D30] text-slate-800 rounded-2xl rounded-tl-none p-4 border border-slate-850">
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Action Form */}
      <form onSubmit={askQuestion} className="flex gap-3 bg-white p-2.5 rounded-2xl border border-slate-200">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about workout forms, nutrition targets..."
          className="flex-1 bg-transparent text-slate-900 px-4 py-2.5 outline-none text-sm placeholder-slate-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default FitnessChat;