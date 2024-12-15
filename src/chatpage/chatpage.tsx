import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize , Typography} from '@mui/material';
import MessageList from './messages';
import MessageInput from './messageinput';

interface MessageProps 
{
    
    text : string , 
    sender : string // it must be me or another_user ,
}




const ChatPage = () =>
{
    const [messages , SetMessages] = useState<MessageProps[]> ([]);   

    const handleSendMessage = (message : string) =>
    {
        const newMessage = {
            text : message , 
            sender : "me" 
        }

        SetMessages((prev) => [...prev , newMessage]);
    }



    return (
        <>
            <MessageList
                messages = {messages}
            />


            <MessageInput 
                handleSendMessage = {handleSendMessage}
            />
        </>
    )
}


export default ChatPage ;