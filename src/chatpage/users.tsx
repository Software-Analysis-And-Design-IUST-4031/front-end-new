import React from 'react';
import User from './user';
import { TextField, Button, Box , TextareaAutosize , Typography} from '@mui/material';
interface UserProps {
  id: number;
  name: string;
}

interface UserListProps {
  users: UserProps[];
  activeUser: UserProps | null;
  setActiveUser: (user: UserProps) => void;
}

const UserList: React.FC<UserListProps> = ({ users, activeUser, setActiveUser }) => {
  return (
    <Box sx={{ 
        // width: '250px', 
        borderRight: '1px solid #ccc', 
        overflowY: 'auto',
        height: '100vh',
        margin : 0 ,
        widht : '100%',
        backgroundColor : '#ccc'
     }}>
      {users.map((user) => (
        <User 
          key={user.id} 
          id = {user.id}
          name = {user.name}
          isActive={activeUser?.id === user.id} 
          onClick={() => setActiveUser(user)} 
        />
      ))}
    </Box>
  );
};

export default UserList;
