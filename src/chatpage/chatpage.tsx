import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize , Typography} from '@mui/material';
import MessageList from './messages';
import MessageInput from './messageinput';

interface MessageProps 
{
    date : string ,
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
            sender : "me" ,
            date: new Date().toLocaleString([], { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        }

        SetMessages((prev) => [...prev , newMessage]);
    }
    const handleSendMessage2 = (message : string) =>
    {
        const newMessage = {
            text : message , 
            sender : "another_user" ,
            date: new Date().toLocaleString([], { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            }) 

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
            <MessageInput 
                handleSendMessage = {handleSendMessage2}
            />
        </>
    )
}


export default ChatPage ;