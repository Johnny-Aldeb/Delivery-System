import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HOME_PAGE } from "./constants.ts";
import {HELP_URL, HOME_PAGE_URL, QUOTE_URL} from "../../constants";
import { HeaderButtonGroup } from "./HeaderButtonGroup";

export const Header = ({
  setSignInAuth,
  signInAuth,
}: {
  setSignInAuth: Function;
  signInAuth: boolean;
}) => {
  const navigate = useNavigate();
  const handleTrackClick = () => {
    navigate("/track");
  };
  return (
    <AppBar
      position="static"
      sx={{
        background: "none",
        width: "85%",
        mx: "auto",
        boxShadow: "none",
        mb: "80px",
      }}
    >
      <Toolbar
        sx={{
          p: "0",
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            gap: "14px",
            alignItems: "center",
          }}
          onClick={() => navigate(HOME_PAGE_URL)}
        >
          <img
            src="/Parceler.svg"
            alt="Home Icon"
            style={{ width: "40px", height: "40px" }}
          />
          <Typography
            sx={{
              fontFamily: '"Montserrat", serif',
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "3.5px",
              pt: "8px",
            }}
          >
            {HOME_PAGE}
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            gap: "60px",
          }}
        >
          <Button
            disableRipple
            color="inherit"
            sx={{
              fontFamily: '"Montserrat", serif',
              fontSize: "15px",
              fontWeight: "small",
              textTransform: "none",
            }}
            onClick={handleTrackClick}
          >
            Track
          </Button>
          <Button
            disableRipple
            color="inherit"
            sx={{
              fontFamily: '"Montserrat", serif',
              fontSize: "16px",
              fontWeight: "medium",
              textTransform: "none",
            }}
            onClick={() => navigate(QUOTE_URL)}
          >
            Ship
          </Button>
          <Button
            disableRipple
            color="inherit"
            sx={{
              fontFamily: '"Montserrat", serif',
              fontSize: "16px",
              fontWeight: "medium",
              textTransform: "none",
            }}
            onClick={() => navigate(HELP_URL)}
          >
            Help
          </Button>
        </Box>
        <HeaderButtonGroup
          setSignInAuth={setSignInAuth}
          signInAuth={signInAuth}
        />
      </Toolbar>
    </AppBar>
  );
};
