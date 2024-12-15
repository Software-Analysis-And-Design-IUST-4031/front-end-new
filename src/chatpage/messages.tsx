import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize } from '@mui/material';
import Message from './message';


interface Message {
    // id: number;
    text: string;
    sender: string ;
}

interface MessagesProps 
{
    messages : Message[];
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
            }}
        >
            {
                messages.map((message , index) =>
                    (
                        <Message
                            text = {message.text} 
                            sender = {message.sender} 
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