import React from 'react';
import { User } from '../models/User';

interface ParticipantListProps {
  participants: User[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <div>
      <h2>Participants</h2>
      <ul>
        {participants.map((participant) => (
          <li key={participant.id}>{participant.username}</li>
        ))}
      </ul>
    </div>
  );
}