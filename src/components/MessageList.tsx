import React from 'react';
import { Message } from '../models/Message';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.userId}</strong>: {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
}