import React, { useState, KeyboardEvent } from "react";
import { Box, TextareaAutosize, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface MessageInputProps {
  handleSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ handleSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      handleSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        position: "sticky",
        bottom: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TextareaAutosize
        minRows={1}
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          resize: "none",
          fontFamily: "inherit",
          fontSize: "14px",
          backgroundColor: "#f5f5f5",
          outline: "none",
        }}
      />
      <IconButton
        onClick={handleSubmit}
        disabled={!message.trim()}
        color="primary"
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "white",
          "&:hover": {
            backgroundColor: (theme) => theme.palette.primary.dark,
          },
          "&.Mui-disabled": {
            backgroundColor: (theme) => theme.palette.action.disabledBackground,
            color: (theme) => theme.palette.action.disabled,
          },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
