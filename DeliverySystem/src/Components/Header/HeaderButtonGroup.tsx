import { Button, Box, Typography } from "@mui/material";
import { handleClickPage } from "./headerUtils.ts";
import { CREATE_ACCOUNT_URL, SIGN_IN_URL } from "../../constants.ts";
import { CREATE_ACCOUNT, LOG_IN } from "./constants.ts";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../Hooks/useAuthentication.ts";

export const HeaderButtonGroup = ({
  setSignInAuth,
}: {
  setSignInAuth: Function;
  signInAuth: boolean;
}) => {
  const navigate = useNavigate();
  const authContext = useAuthentication(true);
  const { logout } = authContext || {};

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "35px",
          alignItems: "center",
        }}
      >
        <Button
          disableRipple
          sx={{
            fontFamily: '"Montserrat", serif',
            fontSize: "16px",
            textTransform: "none",
            color: "white",
            backgroundColor: "none",
          }}
          onClick={() => {
            handleClickPage(navigate, CREATE_ACCOUNT_URL, setSignInAuth, false);
          }}
        >
          {CREATE_ACCOUNT}
        </Button>
        <Button
          disableRipple
          sx={{
            fontFamily: '"Montserrat", serif',
            fontSize: "16px",
            textTransform: "none",
            color: "#071528",
            backgroundColor: "white",
            width: "100px",
            height: "50px",
            borderRadius: "80px",
          }}
          onClick={() => {
            handleClickPage(navigate, SIGN_IN_URL, setSignInAuth, true);
          }}
        >
          {LOG_IN}
        </Button>
        <Button color="inherit">
          <Typography onClick={logout}>Logout</Typography>
        </Button>
      </Box>
    </>
  );
};
