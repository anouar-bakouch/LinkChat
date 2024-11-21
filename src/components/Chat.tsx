import React, { useEffect, useState } from 'react';
import { UserList } from './UserList';
import { MessageList } from './MessageList';
import { MessageForm } from './MessageForm';
import { fetchUsersApi, fetchMessagesApi } from './chatApi';
import { User } from '../models/User';
import { Message } from '../models/Message';

export function Chat() {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const users = await fetchUsersApi();
      setUsers(users);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      const fetchMessages = async () => {
        const messages = await fetchMessagesApi(selectedConversationId as string);
        setMessages(messages);
      }
      fetchMessages();
    }
  }, [selectedConversationId]);

  const handleSendMessage = async (content: string) => {
    if (selectedConversationId) {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          userId: 1, // Example user ID, replace with actual user ID
          content,
        }),
      });
      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div style={{ display: 'flex' }}>
        <UserList users={users} onSelectConversation={setSelectedConversationId} />
        <div>
          <MessageList messages={messages} />
          <MessageForm onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}