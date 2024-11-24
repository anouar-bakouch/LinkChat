import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, uploadImageMessage } from '../features/user/messageSlice';
import { RootState, AppDispatch } from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import { UserList } from './UserList';
import { RoomsList } from './RoomsList';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  Paper,
  Container,
  Input,
} from '@mui/material';
import { Logout, Send, PhotoCamera } from '@mui/icons-material';

export const Chat = () => {
  const { userId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { list: messages, loading, error } = useSelector((state: RootState) => state.messages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      dispatch(fetchMessages({ receiverId: Number(userId), receiverType: 'user' }));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    navigate('/'); // Redirect to root
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMessageObj = {
      message_id: Date.now(),
      sender_id: Number(sessionStorage.getItem('id')),
      receiver_id: Number(userId),
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      image_url: null,
    };

    setNewMessage('');

    await dispatch(
      sendMessage({
        receiverId: Number(userId),
        content: newMessageObj.content,
      })
    );
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);

      await handleUploadImage(file);
    }
  };

  const handleUploadImage = async (file: File) => {
    if (file) {
      const messageimage = newMessage.trim() === '' ? 'IMAGE' : newMessage.trim();
      await dispatch(uploadImageMessage({ file, receiverId: Number(userId), receiverType: 'user', content: messageimage }));
      setSelectedFile(null);
      setNewMessage('');
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      {/* Sidebar */}
      <Box width="25%" borderRight="1px solid #ccc">
        <AppBar position="sticky" sx={{ backgroundColor: 'white' }}>
          <Toolbar>
          <img
          alt="UBO"
          width={30}
          height={30}
          src="https://play-lh.googleusercontent.com/c5HiVEILwq4DqYILPwcDUhRCxId_R53HqV_6rwgJPC0j44IaVlvwASCi23vGQh5G3LIZ"
          className="mx-auto h-10 w-auto"
        />
            <Button
              sx = {{ color: 'blue', marginLeft:7 } }
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </Toolbar>
        </AppBar>
        <Box height="calc(100% - 64px)" display="flex" flexDirection="column">
          <Box p={2}>
            <Typography variant="h6" textAlign="center">
              Utilisateurs
            </Typography>
            <UserList />
          </Box>
          <Box p={2}>
            <Typography variant="h6" textAlign="center">
              Groupes
            </Typography>
            <RoomsList />
          </Box>
        </Box>
      </Box>

      {/* Main Chat */}
      <Box width="75%" display="flex" flexDirection="column">
        {/* Messages */}
        <Box flex="1" p={2} overflow="auto">
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={message.message_id || `message-${index}`}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender_id === Number(sessionStorage.getItem('id')) ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: 2,
                    backgroundColor: message.sender_id === Number(sessionStorage.getItem('id')) ? 'primary.main' : 'grey.200',
                    color: message.sender_id === Number(sessionStorage.getItem('id')) ? 'white' : 'black',
                  }}
                >
                  {message.image_url ? (
                    <img src={message.image_url} alt="Message attachment" style={{ maxWidth: 200, borderRadius: 8 }} />
                  ) : (
                    <Typography>{message.content}</Typography>
                  )}
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {message.timestamp}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
            <div ref={scrollRef} />
          </List>
        </Box>

        {/* Message Input */}
        <Box display="flex" alignItems="center" p={2} borderTop="1px solid #ccc">
          <TextField
            placeholder="Type your message here..."
            variant="outlined"
            fullWidth
            multiline
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <IconButton onClick={handleFileButtonClick} sx={{ ml: 2 }}>
            <PhotoCamera />
          </IconButton>
          <IconButton onClick={handleSendMessage} sx={{ ml: 2, backgroundColor: 'green', color: 'white' }}>
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
