import io from "socket.io-client";
import { API_BASE_URL } from "./api";

export const connectSocket = () => io(API_BASE_URL);
