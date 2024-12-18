import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize , Typography} from '@mui/material';
import MessageList from './messages';
import MessageInput from './messageinput';
import UserList from './users';
import User from './user';

interface MessageProps 
{
    date : string ,
    text : string , 
    sender : string // it must be me or another_user ,
}
interface UserProps {
    id: number;
    name: string;
}
interface MessagesByUser {
    [userId: number]: MessageProps[];
}



const ChatPage = () =>
{
    const [activeUser, setActiveUser] = useState<UserProps | null>(null);
    const [messages , SetMessages] = useState<MessagesByUser> ({});   
    const [users, setUsers] = useState<UserProps[]>([
        { id: 1, name: 'John' }, 
        { id: 2, name: 'Sarah' },
        { id: 3, name: 'David' }
    ]);
    const handleSendMessage = (message : string) =>
    {
        if (activeUser === null)
        {
            return;
        } 
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

        // SetMessages((prev) => [...prev , newMessage]);
        SetMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            if (updatedMessages[activeUser.id]) {
              updatedMessages[activeUser.id] = [...updatedMessages[activeUser.id], newMessage];
            } else {

              updatedMessages[activeUser.id] = [newMessage];
            }
            return updatedMessages;
          });
    }
    const handleSendMessage2 = (message : string) =>
    {
        if (activeUser === null)
        {
            return;
        } 
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

        SetMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            if (updatedMessages[activeUser.id]) {
              updatedMessages[activeUser.id] = [...updatedMessages[activeUser.id], newMessage];
            } else {

              updatedMessages[activeUser.id] = [newMessage];
            }
            return updatedMessages;
          });
    }


    return (
        <Box
            sx = {{
                diplay : 'flex' ,
                flexDirection : 'column' ,
            }}
        >

            <UserList 
                users={users} 
                activeUser={activeUser} 
                setActiveUser={setActiveUser} 
            />
            <MessageList
                messages={activeUser ? messages[activeUser.id] || [] : []}
            />


            {activeUser && (
                <MessageInput handleSendMessage={handleSendMessage} />
            )}
            <MessageInput 
                handleSendMessage = {handleSendMessage2}
            /> 
        </Box>
    )
}


export default ChatPage ;