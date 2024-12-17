import { Button, Box } from "@mui/material";
import { handleClickPage, handleDashboardReroute } from "./headerUtils.ts";
import { CREATE_ACCOUNT_URL, SIGN_IN_URL } from "../../constants.ts";
import { CREATE_ACCOUNT, LOG_IN } from "./constants.ts";
import { useNavigate } from "react-router-dom";
import { useAuthentication, ROLE_ANY } from "../../Hooks/useAuthentication.ts";
import { styled } from "@mui/material";

const StyledMainButton = styled(Button)({
  fontFamily: '"Montserrat", serif',
  fontSize: "16px",
  textTransform: "none",
  color: "#071528",
  backgroundColor: "white",
  height: "50px",
  borderRadius: "80px",
});

const StyledSecondaryButton = styled(Button)({
  fontFamily: '"Montserrat", serif',
  fontSize: "16px",
  textTransform: "none",
  color: "white",
  backgroundColor: "none",
});

export const HeaderButtonGroup = ({
  setSignInAuth,
}: {
  setSignInAuth: (auth: boolean) => void;
  signInAuth: boolean;
}) => {
  const navigate = useNavigate();
  const authContext = useAuthentication(ROLE_ANY);
  const { logout, authToken } = authContext || {};

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
        {!authToken && (
          <>
            <StyledSecondaryButton
              disableRipple
              onClick={() => {
                handleClickPage(
                  navigate,
                  CREATE_ACCOUNT_URL,
                  setSignInAuth,
                  false,
                );
              }}
            >
              {CREATE_ACCOUNT}
            </StyledSecondaryButton>
            <StyledMainButton
              disableRipple
              sx={{
                width: "100px",
              }}
              onClick={() => {
                handleClickPage(navigate, SIGN_IN_URL, setSignInAuth, true);
              }}
            >
              {LOG_IN}
            </StyledMainButton>
          </>
        )}
        {authToken && (
          <>
            <StyledSecondaryButton disableRipple onClick={logout}>
              Logout
            </StyledSecondaryButton>
              <StyledMainButton
                  disableRipple
                  sx={{
                      width: "140px",
                  }}
                  onClick={() => {
                      if (authContext) {
                          handleDashboardReroute(navigate, authContext);
                      } else {
                          console.error("Auth context is null, cannot reroute to the dashboard.");
                      }
                  }}
              >
                  Dashboard
              </StyledMainButton>
          </>
        )}
      </Box>
    </>
  );
};
