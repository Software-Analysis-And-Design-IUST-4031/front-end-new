import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize , Typography} from '@mui/material';



interface MessageProps 
{
    id : number , 
    text : string , 
    sender : string // it must be me or another_user ,
}


const Message : React.FC<MessageProps> = ({text , sender , id}) =>
{
    return (
        <Box
            sx = {{
                display : 'flex' ,
                justifyContent : sender === "me" ?  "flex-end" : "flex-start" 
            }}
        >
            <Box
                sx = {{
                    bgcolor : sender === "me" ? 'black' : 'red', 
                    color: sender === 'me' ? 'white' : 'black',
                    width : '50%' , 
                }}
            >
                <Typography
                >
                    {text} 
                </Typography>
            </Box>
        </Box>
    )
}

export default Message;