import { useDispatch } from 'react-redux';
import { clearUser } from './features/user/userSlice'; 
import { Button } from '@mui/material';


function Home() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Déconnexion
      </Button>
    </div>
  );
}

export default Home;