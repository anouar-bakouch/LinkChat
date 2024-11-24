import React, { useEffect, useState } from 'react';
import { fetchUsersApi, fetchMessagesApi } from './chatApi';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { ParticipantList } from './ParticipantList';
import { ConversationList } from './ConversationList';
import { MessageList } from './MessageList';

export function Chat() {
  const [participants, setParticipants] = useState<User[]>([]);
  const [conversations, setConversations] = useState<any[]>([]); // Replace with actual conversation type
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParticipants() {
      const users = await fetchUsersApi();
      setParticipants(users);
    }
    fetchParticipants();
  }, []);

  useEffect(() => {
    // Fetch conversations here and setConversations
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      const fetchMessages = async () => {
        try {
          const messages = await fetchMessagesApi(selectedConversationId);
          setMessages(messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedConversationId]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <ParticipantList participants={participants} />
        <ConversationList conversations={conversations} onSelectConversation={setSelectedConversationId} />
      </div>
      <div style={{ flex: 1, padding: '10px' }}>
        <MessageList messages={messages} />
      </div>
    </div>
  );
}