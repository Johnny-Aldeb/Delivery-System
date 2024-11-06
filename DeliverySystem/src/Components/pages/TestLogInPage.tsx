import { useAuthentication } from "../../Hooks/useAuthentication";
import { useBodyBackground } from "../../Hooks/useBodyBackground";
import { BACKGROUND_RIGHT } from "./../../constants";
import { Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";

export const TestLogInPage = () => {
  useBodyBackground({
    backgroundImage: "",
    backgroundPosition: BACKGROUND_RIGHT,
    backgroundSize: "cover",
  });

  const accessToken = useAuthentication(false);

  return (
    <>
      {accessToken ? (
        <Grid2
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Typography variant="h1" color="white">
            YOU ARE LOGGED IN!
          </Typography>
          <Typography variant="h3" color="white">
            You have access to view this page
          </Typography>
        </Grid2>
      ) : null}
    </>
  );
};
