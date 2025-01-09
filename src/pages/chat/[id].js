import { IoIosArrowBack } from "react-icons/io";

import { io } from "socket.io-client";
import apiClient from "@/utils/jwtInterceptor";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import LeftSidebar from "@/components/matches/LeftSidebar";
import MessageSection from "@/components/chat/MessageSection";
import TypingBar from "@/components/chat/TypingBar";
import ImageModal from "@/components/chat/ImageModal";

export default function Chat() {
  const router = useRouter();

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);
  const [imageFiles, setImageFiles] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const { state, isAuthenticated } = useAuth();
  const { id: chatRoomId } = router.query;

  // Authentication
  useEffect(() => {
    if (state.loading) return;

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, state.loading, router]);

  // Initialize WebSocket
  useEffect(() => {
    if (!userId) return;

    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
      path: "/socket.io",
    });

    socketIo.on("connect", () => {
      console.log("Connected to WebSocket:", socketIo.id);
      socketIo.emit("registerUser", userId);
    });

    socketIo.on("receiveMessage", (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [userId]);

  // Join room
  useEffect(() => {
    if (chatRoomId && socket) {
      console.log(`User: ${userId} Joining room: ${chatRoomId}`);
      socket.emit("joinRoom", chatRoomId);
    }
  }, [chatRoomId, socket]);

  // Fetch chat room id and old messages
  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        if (!chatRoomId || state.loading || !isAuthenticated) return;

        // Set userId for ui check
        setUserId(state.user?.id);

        // Fetch other user data and old messages
        const messagesResponse = await apiClient.get(
          `/api/chat/chatHistory?chatRoomId=${chatRoomId}&userId=${state.user?.id}`,
        );

        if (messagesResponse.data?.messages) {
          setMessages(messagesResponse.data.messages);
          setOtherUserData(messagesResponse.data.otherUserData);
        }

        console.log("other_user:", messagesResponse.data.otherUserData);
      } catch (error) {
        console.error("Failed to fetch user or chat room details:", error);
      }
    };

    fetchChatRoom();
  }, [chatRoomId]);

  if (state.loading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <main
        className={`items flex h-screen flex-col bg-utility-bg ${selectedImage && "blur-sm"}`}
      >
        <NavBar />

        <div className="flex min-h-0 flex-grow">
          <LeftSidebar />

          <section className="flex w-full min-w-0 flex-col">
            {/* Back button */}
            <div className="flex min-h-14 w-full items-center gap-3 bg-utility-primary px-4 lg:hidden">
              <button
                type="button"
                onClick={() => {
                  router.push("/");
                }}
              >
                <IoIosArrowBack className="size-6 text-fourth-700 transition-colors duration-300 hover:text-fourth-600" />
              </button>
              <p className="text-lg font-semibold text-fourth-900">
                {otherUserData?.name}
              </p>
            </div>

            {/* Message section */}
            <MessageSection
              messages={messages}
              userId={userId}
              otherUserData={otherUserData}
              imageFiles={imageFiles}
              setSelectedImage={setSelectedImage}
            />

            {/* Typing bar */}
            <TypingBar
              socket={socket}
              chatRoomId={chatRoomId}
              userId={userId}
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              setSelectedImage={setSelectedImage}
            />
          </section>
        </div>
      </main>

      {/* Image modal */}
      {selectedImage && (
        <ImageModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  );
}
