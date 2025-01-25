import React from "react";
import { Box, Typography } from "@mui/material";

interface MessageProps {
  date: string;
  id: number;
  text: string;
  sender: string; // it must be me or another_user
}

const Message: React.FC<MessageProps> = ({ text, sender, date }) => {
  const isMe = sender === "me";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        maxWidth: "100%",
        position: "relative",
        mb: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: isMe ? "#2196F3" : "#f5f5f5",
          color: isMe ? "#fff" : "#333",
          p: 2,
          maxWidth: "70%",
          wordBreak: "break-word",
          borderRadius: "1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "12px",
            [isMe ? "right" : "left"]: "-8px",
            width: "0",
            height: "0",
            borderStyle: "solid",
            borderWidth: isMe ? "8px 0 8px 8px" : "8px 8px 8px 0",
            borderColor: isMe
              ? "transparent transparent transparent #2196F3"
              : "transparent #f5f5f5 transparent transparent",
            transform: isMe ? "none" : "none",
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            mb: 1,
            wordBreak: "break-word",
          }}
        >
          {text}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: isMe ? "rgba(255,255,255,0.7)" : "text.secondary",
            textAlign: "right",
            mt: 0.5,
            fontSize: "0.75rem",
          }}
        >
          {date}
        </Typography>
      </Box>
    </Box>
  );
};

export default Message;
