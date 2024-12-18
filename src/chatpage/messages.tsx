import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize } from '@mui/material';
import Message from './message';


interface MessageProps {
    // id: number;
    text: string,
    sender: string ,
    date : string , 
}

interface MessagesProps 
{
    messages : MessageProps[];
}


// const messages = [
//     // { 'message' : "HELLo from user . it is getting ..." , 'sender' : 'me' } ,
//     // {'message' : "HELLo from user . it is sending ..." , 'sender' : 'another_user' } ,
//     // {'message' : "HELLo from user . it is getting ..." , 'sender' : 'me' } ,
//     // {'message' : "HELLo from user . it is sending ..." , 'sender' : 'another_user' } ,

// ]

const MessageList: React.FC<MessagesProps> = ({messages}) =>
{
    return (
        <Box
            sx = {{
                flexDirection : 'column' ,
                display : 'flex' , 
                gap : '10px' ,
            }}
        >
            {
                messages.map((message , index) =>
                    (
                        <Message
                            text = {message.text} 
                            sender = {message.sender} 
                            date = {message.date}
                            key = {index} 
                            id = {index}  
                        />
                    )
                )
            }



        </Box>
    )
} 


export default MessageList 