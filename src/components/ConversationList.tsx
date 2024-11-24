import React from 'react';

interface ConversationListProps {
  conversations: any[]; // Replace with actual conversation type
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({ conversations, onSelectConversation }: ConversationListProps) {
  return (
    <div>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id} onClick={() => onSelectConversation(conversation.id)}>
            {conversation.name}
          </li>
        ))}
      </ul>
    </div>
  );
}