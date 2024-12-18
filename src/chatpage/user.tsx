import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize , Typography ,ListItem ,ListItemButton , ListItemText , } from '@mui/material';
import MessageList from './messages';
import MessageInput from './messageinput';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';



interface UserProps {
    name : string , 
    id : number ,
    isActive: boolean;
    onClick: () => void;
}

// const user1 : UserProps =  {
//     name : "Ali" , 
//     id : 1 ,
//     isActive: true, 
//     onClick: () => {console.log(1)},
// }
const User: React.FC<UserProps> = ({name , id , isActive , onClick}) =>{
    return (
        <ListItem disablePadding sx = {{
                maxWidth : 300,
            }}
        >
            <ListItemButton onClick={onClick} sx = {{
                gap : '8px',
                alignItems: 'center', 
            }}>
                <Avatar sx={{ bgcolor: isActive ? 'blue' : 'gray' }}>
                    {name[0].toUpperCase()}
                </Avatar>
                <ListItemText primary= {name} />
            </ListItemButton>
        </ListItem>
    )

}


export default User ;

