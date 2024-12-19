import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize } from '@mui/material';
import { Typography } from 'tabler-icons-react';
import { FiSend } from "react-icons/fi";



interface MessageInputProps 
{
    handleSendMessage : (message : string) => void 
}

const MessageInput : React.FC<MessageInputProps> = ({handleSendMessage}) => 
{
    const [message , SetMessage] = useState('');

    // const handleSendMessage = (message : string) => 
    // {
        
    //     SetMessage('');
    // }
    const height = 50 ;
    return (
        <Box justifyContent = 'center'
            sx = {{
                p : 4 , 
                // widht : '100%',
            }}
        >
            <Box sx = {{
                display : 'flex' ,
                flexDirection : 'column' ,
                // p : 4 , 
                // gap : '12px' , 
                position : 'relative'
            }}>
                
                    <TextareaAutosize
                        // maxRows={4}
                        // aria-label="maximum height"
                        minRows = {1}
                        // fullWidth
                        // label = 'type a message ...'
                        value = {message}
                        placeholder='send a messge ...'
                        onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => SetMessage(e.target.value)}
                        
                        style = {{
                            padding : '15px' ,
                            width : '100%' ,
                            border: '1px solid #ccc',
                            // resize : none
                        }}
                        // InputProps={{
                        //     sx: {
                        //         height: height, 
                        //         width : '100%'
                        //     }
                        // }}
                    />
                
                    <FiSend 
                        
                        style = {{
                            position : 'absolute' , 
                            bottom : '10px' , 
                            right : '10px' , 
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: '#007BFF',
                        }}
                        onClick = {() => {
                            handleSendMessage(message);
                            SetMessage('');
                        }}
                    />
            </Box>
        </Box>
    )
}



export default MessageInput;