import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessagesGrp, uploadImageMessage, addMessage } from '../features/user/messageSlice';
import { RootState, AppDispatch } from '../store';
import { useNavigate, useParams } from 'react-router-dom';

export const GroupChat = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { listgrp: messages, loading, error } = useSelector((state: RootState) => state.messages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLInputElement>(null);

  const parsedRoomId = Number(roomId);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    if (!isNaN(parsedRoomId)) {
      dispatch(fetchMessagesGrp({ receiverId: parsedRoomId, receiverType: 'group' }));
    } else {
      console.error('Invalid room ID:', roomId);
    }
  }, [dispatch, parsedRoomId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      receiver_id: parsedRoomId,
      image_url: '',
      content: newMessage.trim(),
      sender_id: Number(sessionStorage.getItem('id')),
      receiver_type: 'group',
    };

    const token = sessionStorage.getItem('token');
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Authentication': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (response.ok) {
      const sentMessage = await response.json();
      dispatch(addMessage(sentMessage));
      setNewMessage('');
    } else {
      console.error('Failed to send message');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      await handleUploadImage(file);
    }
  };

  const handleUploadImage = async (file: File) => {
    if (file) {
      await dispatch(uploadImageMessage({ file, receiverId: parsedRoomId, receiverType: 'group', content: newMessage.trim() }));
      setSelectedFile(null);
      setNewMessage('');
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen w-screen overflow-y-hidden">
      {/* Group chat UI elements */}
    </div>
  );
};