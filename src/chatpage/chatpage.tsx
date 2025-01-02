import React, { useState , useEffect} from 'react';
import { TextField, Button, Box , TextareaAutosize , Typography , Grid} from '@mui/material';
import MessageList from './messages';
import MessageInput from './messageinput';
import UserList from './users';
import User from './user';
import { userService } from '../services/userService';

interface MessageProps 
{
    date : string ,
    text : string , 
    sender : string // it must be me or another_user ,
}
interface UserProps {
    id: number;
    name: string;
    chat_id : number ;
}
interface MessagesByUser {
    [userId: number]: MessageProps[];
}



const ChatPage = () =>
{
    const [activeUser, setActiveUser] = useState<UserProps | null>(null);
    const [messages , setMessages] = useState<MessagesByUser> ({});   
    // const [users, setUsers] = useState<UserProps[]>([
    //     { id: 1, name: 'gggg' }, 
    //     // { id: 20, name: 'David' },
        
        
    // ]);


    const [users , setUsers] = useState<UserProps[]>([]); 

    // useEffect(() => {
    //   // Fetch users on component mount
    //   const loadChats = async () => {
    //     try {
    //       const fetchedUsers = await userService.fetchChats();
    //       setUsers(fetchedUsers); // Update state with fetched users
    //     } catch (error) {
    //       console.error('Failed to load chats:', error);
    //     }
    //   };
  
    //   loadChats();
    // }, []); 

    useEffect(() => {
      const intervalId = setInterval(async () => {
        try {
          const fetchedUsers = await userService.fetchChats();
          setUsers(fetchedUsers); // Update state with fetched users
        } catch (error) {
          console.error('Failed to load chats:', error);
        }
      }, 3000); // Poll every 3 seconds
    
      return () => clearInterval(intervalId); // Clean up on unmount
    }, []);

    // useEffect(() => {
    //   const loadMessages = async () => {
    //     if (activeUser) {
    //       try {
    //         const fetchedMessages = await userService.fetchMessages(activeUser.chat_id);
    //         setMessages((prevMessages) => ({
    //           ...prevMessages,
    //           [activeUser.id]: fetchedMessages,
    //         }));
    //       } catch (error) {
    //         console.error('Failed to load messages:', error);
    //       }
    //     }
    //   };
  
    //   loadMessages();
    // }, [activeUser]);

    useEffect(() => {
      const intervalId = setInterval(async () => {
        if (activeUser) {
          try {
            const fetchedMessages = await userService.fetchMessages(activeUser.chat_id);
            setMessages((prevMessages) => ({
              ...prevMessages,
              [activeUser.id]: fetchedMessages,
            }));
          } catch (error) {
            console.error('Failed to load messages:', error);
          }
        }
      }, 3000); // Poll every 3 seconds
    
      return () => clearInterval(intervalId); // Clean up on unmount
    }, [activeUser]);
    




    const handleSendMessage = async (message : string) =>
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
        setMessages((prevMessages : any) => {
            const updatedMessages = { ...prevMessages };
            if (updatedMessages[activeUser.id]) {
              updatedMessages[activeUser.id] = [...updatedMessages[activeUser.id], newMessage];
            } else {

              updatedMessages[activeUser.id] = [newMessage];
            }
            return updatedMessages;
          });
          await userService.sendMessage(activeUser.chat_id, message);
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

        setMessages((prevMessages : any) => {
            const updatedMessages = { ...prevMessages };
            if (updatedMessages[activeUser.id]) {
              updatedMessages[activeUser.id] = [...updatedMessages[activeUser.id], newMessage];
            } else {

              updatedMessages[activeUser.id] = [newMessage];
            }
            return updatedMessages;
          });
    }


    // const xx : number = userService.getUserIdByUsername("ghazalebadi");
    // console.log("fgh" + xx) ;

    // userService.getUserIdByUsername("ghazalebadi")
    // .then((xx) => {
    //   console.log("fgh" + xx); // Output: fgh1
    // })
    // .catch((error) => {
    //   console.error("Error fetching user ID:", error);
    // });



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
                width : '99.9%', 
                
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
                backgroundColor : 'red',
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
                {/* {activeUser && (
                    <MessageInput 
                        handleSendMessage = {handleSendMessage2}
                    /> 
                )} */}
            </Grid>
       
        </Grid>
    )
}


export default ChatPage ;