import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  TextareaAutosize,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
} from "@mui/material";
import MessageList from "./messages";
import MessageInput from "./messageinput";
import UserList from "./users";
import User from "./user";
import { userService } from "../../services/userService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from "@mui/icons-material/Chat";
import { useSnackbar } from "notistack";

interface MessageProps {
  date: string;
  text: string;
  sender: string; // it must be me or another_user
}

interface UserProps {
  id: number;
  name: string;
  chat_id: number;
}

interface MessagesByUser {
  [userId: number]: MessageProps[];
}

const ChatPage = () => {
  const [activeUser, setActiveUser] = useState<UserProps | null>(null);
  const [messages, setMessages] = useState<MessagesByUser>({});
  const [users, setUsers] = useState<UserProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // Load chats on component mount and when state changes
  useEffect(() => {
    const loadChats = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await userService.fetchChats();
        // Transform the data to match our interface
        const transformedUsers = fetchedUsers.map((user) => ({
          id: user.user_id,
          name: user.username,
          chat_id: user.chat_id,
        }));
        setUsers(transformedUsers);

        // If navigated with state, set the active user
        if (state && state.username) {
          const user = transformedUsers.find((u) => u.name === state.username);
          if (user) {
            setActiveUser(user);
          }
        }
      } catch (error) {
        console.error("Failed to load chats:", error);
        enqueueSnackbar("Failed to load chats", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [state]);

  // Poll for new chats every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const fetchedUsers = await userService.fetchChats();
        const transformedUsers = fetchedUsers.map((user) => ({
          id: user.user_id,
          name: user.username,
          chat_id: user.chat_id,
        }));
        setUsers(transformedUsers);
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Poll for new messages when there's an active user
  useEffect(() => {
    if (!activeUser) return;

    const intervalId = setInterval(async () => {
      try {
        const fetchedMessages = await userService.fetchMessages(
          activeUser.chat_id
        );
        setMessages((prevMessages) => ({
          ...prevMessages,
          [activeUser.id]: fetchedMessages,
        }));
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }, 800);

    return () => clearInterval(intervalId);
  }, [activeUser]);

  const handleSendMessage = async (message: string) => {
    if (!activeUser || !message.trim()) return;

    try {
      // Optimistically update UI
      const newMessage = {
        text: message,
        sender: "me",
        date: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })
          .format(new Date())
          .replace(",", ""),
      };

      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeUser.id]: [...(prevMessages[activeUser.id] || []), newMessage],
      }));

      // Send message to server
      await userService.sendMessage(activeUser.chat_id, message);
    } catch (error) {
      console.error("Failed to send message:", error);
      enqueueSnackbar("Failed to send message", { variant: "error" });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const urlImageBackGround =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrGGiAHnT4o4DcXN2zGVsbW70MRPJk0fdeIg&s";

  return (
    <Grid
      container
      spacing={0}
      sx={{
        width: "99.9%",
        padding: 0,
        margin: 0,
        display: "flex",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Grid
        item
        sx={{
          width: "25%",
          padding: 0,
          margin: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "background.paper",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
          }}
        >
          <Tooltip title="Back">
            <IconButton
              onClick={handleBack}
              sx={{
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Messages
          </Typography>
        </Box>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 3,
            }}
          >
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 3,
              gap: 2,
              color: "text.secondary",
            }}
          >
            <ChatIcon sx={{ fontSize: 48, opacity: 0.5 }} />
            <Typography variant="body1" textAlign="center">
              No conversations yet.
              <br />
              Start a chat from a user's profile!
            </Typography>
          </Box>
        ) : (
          <UserList
            users={users}
            activeUser={activeUser}
            setActiveUser={setActiveUser}
          />
        )}
      </Grid>

      <Grid
        item
        sx={{
          backgroundImage: `url(${urlImageBackGround})`,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
          backgroundBlendMode: "overlay",
          overflowY: "auto",
          height: "100vh",
          width: "75%",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeUser ? (
          <>
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {activeUser.name}
              </Typography>
            </Box>
            <MessageList messages={messages[activeUser.id] || []} />
            <MessageInput handleSendMessage={handleSendMessage} />
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 3,
              gap: 2,
              color: "text.secondary",
            }}
          >
            <ChatIcon sx={{ fontSize: 64, opacity: 0.5 }} />
            <Typography variant="h6" textAlign="center">
              Select a conversation to start chatting
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatPage;
