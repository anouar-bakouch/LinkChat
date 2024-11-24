// UserList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/user/userSlice';
import { RootState, AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';

import { User } from '../models/User';

export const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { list, loading, error } = useSelector((state: RootState) => state.users) as {
    list: User[];
    loading: boolean;
    error: string | null;
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const currentUsername = sessionStorage.getItem('username') || '';

  const filteredUsers = list.filter((user: User) => user.username !== currentUsername);
  
  // Select only the top three users
  const topUsers = filteredUsers.slice(0, 3);

  const handleUserClick = (userId: number) => {
    navigate(`/messages/user/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" className="text-center mt-4">
        Erreur: {error}
      </Typography>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-y-auto h-full">
      <List>
        {topUsers.length > 0 ? (
          topUsers.map((user, index) => (
            <React.Fragment key={user.user_id}>
              <ListItem
                component="li"  
                onClick={() => handleUserClick(user.user_id)}
                className="hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar_url} alt={user.username}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" className="font-semibold">
                      {user.username}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      Dernière connexion : {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
                    </Typography>
                  }
                />
              </ListItem>
              {index < topUsers.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        ) : (
          <Typography className="text-center text-gray-500 mt-4">
            Aucun utilisateur disponible.
          </Typography>
        )}
      </List>
    </div>
  );
};