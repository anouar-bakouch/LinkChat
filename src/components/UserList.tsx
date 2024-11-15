import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUsers, selectUsers, selectCurrentUser } from '../features//user/chatSlice';
import { useNavigate } from 'react-router-dom';
import { User } from '../models/User';

export function UserList() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserClick = (userId: string) => {
    navigate(`/messages/user/${userId}`);
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users
          .filter((user: User) => user.id !== currentUser?.id)
          .map((user: User) => (
            <li key={user.id} onClick={() => handleUserClick(user.id)}>
              {user.username} (Last login: {new Date(user.lastLogin).toLocaleString()})
            </li>
          ))}
      </ul>
    </div>
  );
}