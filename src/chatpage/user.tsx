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
    chat_id : number ;
}

// const user1 : UserProps =  {
//     name : "Ali" , 
//     id : 1 ,
//     isActive: true, 
//     onClick: () => {console.log(1)},
// }


const User: React.FC<UserProps> = ({name , id , isActive , onClick}) =>{
    const shortName = (name : string) =>
    {
        if (name.length < 10)
        {
            return name ;
        }
        else
        {
            return name.slice(0 , 15) + ' ...'
        }
    }
    return (
        <ListItem disablePadding sx = {{
                width : '100%'
            }}
        >
            <ListItemButton onClick={onClick} sx = {{
                gap : '8px',
                alignItems: 'center', 
            }}>
                <Avatar sx={{ bgcolor: isActive ? 'black' : 'gray' }}>
                    {name[0].toUpperCase()}
                </Avatar>
                <ListItemText primary= {shortName(name)} />
            </ListItemButton>
        </ListItem>
    )

}


export default User ;
