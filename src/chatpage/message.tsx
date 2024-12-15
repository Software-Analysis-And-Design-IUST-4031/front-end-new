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
                justifyContent : sender === "me" ?  "flex-end" : "flex-start",
                maxWidth : '100%' , 
                position : 'relative'
            }}
        >
            <Box
                sx = {{
                    bgcolor : sender === "me" ? 'black' : 'red', 
                    color: sender === 'me' ? 'white' : 'black',
                    // maxwidth : '50%' ,
                    p : 1 , 
                    maxWidth : '50%' ,
                    wordBreak: 'break-word',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&::after': {
                        content: '""', // This makes the pseudo-element appear
                        position: 'absolute', // It's positioned relative to the parent
                        bottom: '0', // Puts it at the bottom of the chat bubble
                        right: sender === 'me' ? '-10px' : 'auto', // Position it to the right for 'me', or 'auto' otherwise
                        left: sender === 'me' ? 'auto' : '-10px', // Position it to the left for another user
                        width: 0, // The pseudo-element does not have width or height
                        height: 0, // It uses borders to "draw" a shape
                        borderStyle: 'solid', // Makes the "borders" solid so it looks like a shape
                        borderWidth: sender === 'me' 
                          ? '10px 10px 10px 10px'  // Makes a triangle pointing **left**
                          : '10px 10px 0 0', // Makes a triangle pointing **right**
                        borderColor: sender === 'me' 
                          ? `black transparent transparent transparent` 
                          : `red transparent transparent transparent`
                      }
                }}
            >
                <Typography
                    sx = {{
                        textAlign: sender === "me" ? 'right' : 'left'
                    }} 
                >
                    
                    {text} 
                </Typography>
            </Box>
        </Box>
    )
}

export default Message;