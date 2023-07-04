import { createContext } from "react";
import socketio from "socket.io-client";

export const AdminContext = createContext();

const uri = import.meta.env.VITE_API_BASE_URL;

export const socket = socketio.connect(uri);
export const SocketContext = createContext();