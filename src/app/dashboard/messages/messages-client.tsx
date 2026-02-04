"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { sendMessage, getConversation } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Loader2,
  ArrowLeft,
  ChefHat,
} from "lucide-react";
import { toast } from "sonner";

type Conversation = {
  partner: {
    id: string;
    name: string | null;
    avatar: string | null;
    role: string;
  } | null;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    read: boolean;
  } | null;
  unreadCount: number;
};

type Message = {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  read: boolean;
  sender: { id: string; name: string | null; avatar: string | null };
};

export function MessagesClient({
  conversations,
  currentUserId,
}: {
  conversations: Conversation[];
  currentUserId: string;
}) {
  const [activePartner, setActivePartner] = useState<Conversation["partner"]>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  async function openConversation(partner: Conversation["partner"]) {
    if (!partner) return;
    setActivePartner(partner);
    setLoadingMessages(true);
    try {
      const msgs = await getConversation(partner.id);
      setMessages(msgs);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  }

  if (activePartner) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActivePartner(null)}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to conversations
        </button>
        <ConversationView
          partner={activePartner}
          messages={messages}
          currentUserId={currentUserId}
          loading={loadingMessages}
          onNewMessage={(msg) => setMessages((prev) => [...prev, msg])}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Messages</h1>
        <p className="text-stone-500 text-sm mt-1">
          Your conversations with cooks and customers
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <MessageCircle className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400">No conversations yet</p>
          <p className="text-xs text-stone-300 mt-1">
            Messages will appear here when you start chatting
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-50">
          {conversations.map((conv) => (
            <button
              key={conv.partner?.id}
              onClick={() => openConversation(conv.partner)}
              className="w-full flex items-center gap-3 p-4 hover:bg-stone-50/50 transition-colors text-left"
            >
              {conv.partner?.avatar ? (
                <img
                  src={conv.partner.avatar}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500 flex-shrink-0">
                  {conv.partner?.name?.[0] || "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-900 text-sm truncate">
                      {conv.partner?.name}
                    </p>
                    {conv.partner?.role === "COOK" && (
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1 py-0 bg-warm-50 text-warm-700"
                      >
                        Cook
                      </Badge>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <span className="text-[10px] text-stone-400 flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-stone-400 truncate">
                    {conv.lastMessage?.senderId === currentUserId && (
                      <span className="text-stone-300">You: </span>
                    )}
                    {conv.lastMessage?.content || "No messages"}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-warm-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ml-2">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConversationView({
  partner,
  messages,
  currentUserId,
  loading,
  onNewMessage,
}: {
  partner: NonNullable<Conversation["partner"]>;
  messages: Message[];
  currentUserId: string;
  loading: boolean;
  onNewMessage: (msg: Message) => void;
}) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    const content = text.trim();
    setText("");

    startTransition(async () => {
      const result = await sendMessage({
        receiverId: partner.id,
        content,
      });

      if (result.error) {
        toast.error(result.error);
        setText(content);
      } else {
        onNewMessage({
          id: result.messageId!,
          content,
          createdAt: new Date(),
          senderId: currentUserId,
          receiverId: partner.id,
          read: false,
          sender: { id: currentUserId, name: "You", avatar: null },
        });
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col h-[calc(100vh-14rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-stone-100">
        {partner.avatar ? (
          <img
            src={partner.avatar}
            alt=""
            className="w-9 h-9 rounded-xl object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500">
            {partner.name?.[0] || "?"}
          </div>
        )}
        <div>
          <p className="font-medium text-stone-900 text-sm">{partner.name}</p>
          <p className="text-xs text-stone-400 capitalize">
            {partner.role.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="w-10 h-10 text-stone-200 mx-auto mb-2" />
            <p className="text-sm text-stone-400">
              Start the conversation with {partner.name?.split(" ")[0]}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    isMine
                      ? "bg-warm-700 text-white rounded-br-md"
                      : "bg-stone-100 text-stone-800 rounded-bl-md"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMine ? "text-warm-200" : "text-stone-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3 border-t border-stone-100"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="border-stone-200 rounded-full"
          disabled={isPending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isPending || !text.trim()}
          className="bg-warm-700 hover:bg-warm-800 text-white rounded-full flex-shrink-0"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
