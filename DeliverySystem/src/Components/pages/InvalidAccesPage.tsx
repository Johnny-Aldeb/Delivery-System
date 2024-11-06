import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import { INVALID_ACCESS_MESSAGE, INVALID_ACCESS_TITLE, INVALID_ACCESS_RETURN } from './constants';
import { HOME_PAGE_URL } from '../../constants';
import {useBodyBackground} from '../../Hooks/useBodyBackground'; 
import { BACKGROUND_RIGHT } from '../../constants'; // Adjust path if necessary
import { EMPTY_STRING } from 'Components/AuthForm/constants';

export const InvalidAccessPage: React.FC = () => {
  const navigate = useNavigate();

  useBodyBackground({
    backgroundImage: EMPTY_STRING,
    backgroundPosition: BACKGROUND_RIGHT,
    backgroundSize: "cover",
  });

  const handleGoBack = () => {
    navigate(HOME_PAGE_URL); 
  };

  return (
    <Container 
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        borderRadius: 2,
        boxShadow: 3,
        padding: 4,
        maxHeight: '30rem',
      }}
    >
      <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h4" color="error" gutterBottom>
        {INVALID_ACCESS_TITLE}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {INVALID_ACCESS_MESSAGE}
      </Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          onClick={handleGoBack}
          sx={{ textTransform: 'none', fontWeight: 'bold', paddingX: 3, color: 'white', backgroundColor: 'black' }}
        >
          {INVALID_ACCESS_RETURN}
        </Button>
      </Box>
    </Container>
  );
};

export default InvalidAccessPage;
