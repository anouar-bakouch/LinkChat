import { UserList } from './UserList';
import { MessageList } from './MessageList';

export function Chat() {
  return (
    <div>
      <h1>Chat Room</h1>
      <div style={{ display: 'flex' }}>
        <UserList />
        <MessageList />
      </div>
    </div>
  );
}