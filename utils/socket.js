import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  withCredentials: true, // This sends cookies
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Add connection error handling for debugging
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

export default socket;
