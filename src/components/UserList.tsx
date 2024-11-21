import React from 'react';
import { User } from '../models/User';

interface UserListProps {
  users: User[];
  onSelectConversation: (conversationId: string) => void;
}

export function UserList({ users, onSelectConversation }: UserListProps) {
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onSelectConversation(user.id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}