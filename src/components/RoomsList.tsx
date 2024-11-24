// RoomsList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms } from '../features/user/roomSlice';
import { RootState, AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { Room } from '../models/Room';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  Card,
  Skeleton,
} from '@mui/material';

export const RoomsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector((state: RootState) => state.rooms);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleRoomClick = (roomId: number) => {
    navigate(`/messages/room/${roomId}`);
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 2,
        backgroundColor: '#f5f5f5',
        boxShadow: 3,
        borderRadius: 2,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <Box>
        {loading ? (
          <List>
            {[...Array(10)].map((_, index) => (
              <ListItem key={index} disableGutters>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={50}
                  animation="wave"
                  sx={{ borderRadius: 1, mb: 1 }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <List>
            {list.map((room: Room) => (
              <ListItem key={room.room_id} disableGutters>
                <ListItemButton
                  onClick={() => handleRoomClick(room.room_id)}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 1,
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: 3,
                    },
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={room.name}
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'black',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
        {error && (
          <Typography color="error" textAlign="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Card>
  );
};
