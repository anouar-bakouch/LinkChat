import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchMessages, selectMessages } from '../features/user/chatSlice';
import { useParams } from 'react-router-dom';
import { Message } from '../models/Message';

export function MessageList() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    if (userId) {
      dispatch(fetchMessages(userId));
    }
  }, [dispatch, userId]);

  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((message: Message) => (
          <li
            key={message.id}
            style={{ textAlign: message.senderId === userId ? 'left' : 'right' }}
          >
            <strong>{message.senderName}</strong>: {message.content}{' '}
            <em>({new Date(message.timestamp).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}