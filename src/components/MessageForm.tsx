import React, { useState } from 'react';

interface MessageFormProps {
  onSendMessage: (content: string) => void;
}

export function MessageForm({ onSendMessage }: MessageFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}