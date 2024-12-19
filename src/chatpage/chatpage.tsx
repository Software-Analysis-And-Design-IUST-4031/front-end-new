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
                backgroundImage: 'url(data:image/jpeg;base64,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)' ,
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