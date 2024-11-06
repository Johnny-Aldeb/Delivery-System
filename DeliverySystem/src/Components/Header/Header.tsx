import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HOME_PAGE } from "./constants";
import { HOME_PAGE_URL } from "../../constants";
import { HeaderButtonGroup } from "./HeaderButtonGroup.tsx";

export const Header = ({
  setSignInAuth,
  signInAuth,
}: {
  setSignInAuth: Function;
  signInAuth: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{ background: "none", width: "85%", mx: "auto", boxShadow: "none" }}
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
            src={"Parceler.svg"}
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
            sx={{
              fontFamily: '"Montserrat", serif',
              fontSize: "16px",
              fontWeight: "medium",
              textTransform: "none",
              backgroundColor: "white",
            }}
            // TEST THE  LOGGEDINACCESS
            onClick={() => navigate("/login-TEST")}
          >
            <Typography color="red">{"TEST \nENCRYPTED PAGE"}</Typography>
          </Button>
          <Button
            disableRipple
            color="inherit"
            sx={{
              fontFamily: '"Montserrat", serif',
              fontSize: "15px",
              fontWeight: "small",
              textTransform: "none",
            }}
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
