import React, { useState } from 'react';
import { TextField, Button, Box , TextareaAutosize , Typography , Grid} from '@mui/material';
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
        { id: 1, name: 'gggg' }, 
        { id: 2, name: 'Sarah' },
        { id: 3, name: 'David' },
        { id: 4, name: 'David' },
        { id: 5, name: 'David' },
        { id: 6, name: 'David' },
        { id: 7, name: 'David' },
        { id: 8, name: 'David' },
        { id: 9, name: 'David' },
        { id: 10, name: 'David' },
        { id: 11, name: 'David' },
        { id: 12, name: 'David' },
        { id: 13, name: 'David' },
        { id: 14, name: 'David' },
        { id: 15, name: 'David' },
        { id: 16, name: 'David' },
        { id: 17, name: 'David' },
        { id: 18, name: 'David' },
        { id: 19, name: 'David' },
        // { id: 20, name: 'David' },
        
        
    ]);
    const handleSendMessage = (message : string) =>
    {
        if (activeUser === null || message === '')
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

    const urlImageBackGround = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrGGiAHnT4o4DcXN2zGVsbW70MRPJk0fdeIg&s' ;
    return (
        // <Box
        //     sx = {{
        //         diplay : 'flex' ,
        //         flexDirection : 'column' ,
        //     }}
        // >
        <Grid container spacing={0} 
            sx = {{
                border : '1000px',
                // width: '94vw',
                width : '105%', 
                
                padding : 0 , 
                margin : 0,
                display : 'flex'
                // height: '100vh', 
                // overflow: 'hidden', 
            }}
            style = {{
                padding  : 0 ,
                margin : 0
            }}
        >
            <Grid item 
                sx = {{
                    width : '25%',
                    padding : 0 , 
                    margin : 0,
                }}
            >
                <UserList 
                    users={users} 
                    activeUser={activeUser} 
                    setActiveUser={setActiveUser} 
                />
            </Grid>
        
            <Grid item sx = {{
                // backgroundColor: 'red' ,
                backgroundImage: `url(${urlImageBackGround})` ,
                // backgroundBlendMode: 'lighten',
                overflowY: 'auto',
                height: '100vh',
                width : '75%',
                padding : 0 , 
                margin : 0,
            }}>
                <MessageList
                    messages={activeUser ? messages[activeUser.id] || [] : []}
                />


                {activeUser && (
                    <MessageInput handleSendMessage={handleSendMessage} />
                )}
                {activeUser && (
                    <MessageInput 
                        handleSendMessage = {handleSendMessage2}
                    /> 
                )}
            </Grid>
       
        </Grid>
    )
}


export default ChatPage ;