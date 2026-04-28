import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Sparkles, Brain } from "lucide-react";
import ChatMarkdown from "@/components/ChatMarkdown";

export default function AIChatPage() {
  const { chatMessages, addChatMessage, profile } = useApp();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    addChatMessage({ role: "user", content: userMsg });

    // Call backend for AI response
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, profile, history: chatMessages }),
      });
      
      if (response.ok) {
        const data = await response.json();
        addChatMessage(data);
      } else {
        throw new Error("Backend response error");
      }
    } catch (e) {
      console.warn("Backend not available, using fallback", e);
      // Intelligent fallback when backend is down
      setTimeout(() => {
        const lowerMsg = userMsg.toLowerCase();
        let response = "";
        if (/^(hi|hello|hey)/i.test(lowerMsg)) {
          response = `Hello ${profile.name || 'there'}! 👋 I'm your AI Placement Mentor.\n\nI can help you with:\n• **DSA & Problem Solving** — Topic-wise guidance\n• **Interview Preparation** — Technical, HR, Behavioral\n• **Resume Tips** — ATS-friendly formatting\n• **Company Prep** — TCS, Google, Amazon, etc.\n\nWhat would you like to discuss?`;
        } else if (/resume|cv/i.test(lowerMsg)) {
          response = `**Resume Tips for ${profile.name || 'Freshers'}:**\n\n1. Keep it to **1 page**\n2. Use action verbs: Built, Developed, Optimized\n3. **Quantify results**: \"Reduced load time by 40%\"\n4. Include 2-3 strong projects with tech stack\n5. Make it ATS-friendly — no tables or images\n\n⚠️ *Backend is currently offline. Start the server for full AI capabilities.*`;
        } else if (/interview|prepare|placement/i.test(lowerMsg)) {
          response = `**Interview Prep Strategy:**\n\n1. **DSA** — Solve 150+ LeetCode problems\n2. **Projects** — Be ready to deep-dive\n3. **CS Fundamentals** — OS, DBMS, Networks\n4. **Communication** — Think out loud during coding rounds\n\n⚠️ *Backend is offline. Start the server for detailed, context-aware responses.*`;
        } else if (/dsa|algorithm|data structure|leetcode/i.test(lowerMsg)) {
          response = `**DSA Study Order:**\n\n1. Arrays & Strings\n2. Hashing\n3. Linked Lists\n4. Stacks & Queues\n5. Trees\n6. Graphs\n7. Dynamic Programming\n\nStart with the **Blind 75** or **NeetCode 150** lists on LeetCode!\n\n⚠️ *Backend is offline. Start the server for topic-specific deep dives.*`;
        } else {
          response = `Great question, ${profile.name || 'there'}! I'd love to help.\n\nI can discuss:\n• **DSA topics** — Arrays, Trees, DP, Graphs\n• **Interview prep** — Technical, HR, System Design\n• **Resume & Portfolio** tips\n• **Company-specific** guidance\n• **Learning roadmaps** for any role\n\n⚠️ *The backend server is currently offline. Please run \`npm run dev\` to start both frontend and backend for full AI capabilities.*`;
        }
        addChatMessage({ role: "assistant", content: response });
      }, 800);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen p-4 lg:p-8 animate-fade-in">
      <div className="glass-card flex flex-col h-full rounded-3xl overflow-hidden border-border/40">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-border/40 flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-glow-blue">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">AI Placement Mentor</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Online & Ready to Help</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Mentor
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 lg:p-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            {chatMessages.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground/40">
                  <Brain className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-xl">How can I help you today?</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Ask me about your skill gaps, interview prep, resumes, or learning paths.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {["Analyze my skill gap", "How to improve my resume?", "Top interview questions"].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => setInput(hint)}
                      className="px-4 py-2 rounded-xl border border-border/60 hover:border-brand-blue/40 hover:bg-brand-blue/5 text-xs font-medium transition-all"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className={`w-8 h-8 rounded-lg shadow-sm ${msg.role === "assistant" ? "bg-gradient-to-br from-blue-600 to-purple-600" : "bg-gradient-to-br from-brand-green to-teal-500"}`}>
                  <AvatarFallback className="bg-transparent text-primary-foreground text-[10px] font-bold">
                    {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : ""}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-primary-foreground rounded-tr-none"
                      : "bg-muted/50 dark:bg-white/5 border border-border/40 rounded-tl-none"
                  }`}>
                    {msg.role === "assistant" ? <ChatMarkdown content={msg.content} /> : msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1.5 px-1 font-medium italic opacity-70">
                    {msg.role === "assistant" ? "Mentor" : profile.name || "Student"} • Just now
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted/50 dark:bg-white/5 border border-border/40 p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 lg:p-6 border-t border-border/40 bg-muted/20 dark:bg-black/20">
          <form
            onSubmit={handleSend}
            className="max-w-3xl mx-auto relative flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 h-12 lg:h-14 rounded-2xl border-border/60 pl-4 pr-14 bg-background/50 backdrop-blur-sm focus-visible:ring-brand-blue/30"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 w-10 h-10 lg:w-11 lg:h-11 rounded-xl btn-gradient-primary p-0 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-3 font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-brand-blue" />
            Your AI mentor can provide guidance on your specific skill gap and target role.
          </p>
        </div>
      </div>
    </div>
  );
}
