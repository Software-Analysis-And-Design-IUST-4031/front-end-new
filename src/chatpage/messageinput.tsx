import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize} from '@mui/material';
import { Typography } from 'tabler-icons-react';



// interface MessageInputProps 
// {
//     message : string ,

// }

const MessageInput : React.FC = () => 
{
    const [message , SetMessage] = useState('');

    const handleSendMessage = () => 
    {
         
        SetMessage('');
    }
    const height = 50 ;
    return (
        <Box justifyContent = 'center'>
            <Box sx = {{
                display : 'flex' ,
                flexDirection : 'column' ,
                p : 4 , 
                gap : '12px'
            }}>
                {/* <Box 
                    sx = {{
                        display : 'flex' ,
                        width: '100%',
                    }}
                > */}
                    <TextareaAutosize
                        // maxRows={4}
                        // aria-label="maximum height"
                        // minRows = {1}
                        // fullWidth
                        // label = 'type a message ...'
                        value = {message}
                        placeholder='send a messge ...'
                        onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => SetMessage(e.target.value)}
                        
                        style = {{
                            padding : '15px' ,
                            width : '100%' ,
                            // resize : none
                        }}
                        // InputProps={{
                        //     sx: {
                        //         height: height, 
                        //         width : '100%'
                        //     }
                        // }}
                    />
                {/* </Box> */}
                <Box  
                    sx = {{
                        justifyContent : 'center'
                    }}
                >
                    <Button variant="contained" onClick = {handleSendMessage} 
                        sx = {{
                            height : {height},
                            width : 120 ,  
                        }}
                    >
                        click to send
                    </Button>
                </Box>
                
                
            </Box>
        </Box>

    )
}



export default MessageInput;