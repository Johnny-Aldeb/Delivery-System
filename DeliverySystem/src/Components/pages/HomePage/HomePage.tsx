import { Grid2, Snackbar, Alert, Typography } from "@mui/material";
import { useBodyBackground } from "../../../Hooks/useBodyBackground.ts";
import { BACKGROUND_RIGHT, IMAGE3 } from "../../../constants.ts";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Truck, PackageSearch } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SUCCESS_MESSAGE_REGISTER_ACCOUNT } from "Components/AuthForm/constants.ts";
import { useAuthentication } from "../../../Hooks/useAuthentication.ts";

export const HomePage = () => {
  useBodyBackground({
    backgroundImage: IMAGE3,
    backgroundPosition: BACKGROUND_RIGHT,
    backgroundSize: "cover",
  });
  const authContext = useAuthentication(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const param = queryParams.get("param");
  const [successBar, setSuccessBar] = useState(!!param);

  // Single state to toggle between track and quote display
  const [isQuoteDisplay, setIsQuoteDisplay] = useState(false);

  const handleQuoteClick = () => {
    setIsQuoteDisplay(true); // Show the quote section
  };

  const handleTrackClick = () => {
    setIsQuoteDisplay(false); // Show the track section
  };
  const vertical = "top";
  const horizontal = "right";
 
  return (
    <Grid2 pl={5} pt={3}>
      <Snackbar
        open={successBar}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={3000}
        onClose={() => setSuccessBar(false)}
      >
        <Alert
          sx={{ height: "3rem", alignItems: "center" }}
          severity="success"
          variant="filled"
          onClose={() => setSuccessBar(false)}
        >
          <Typography>{SUCCESS_MESSAGE_REGISTER_ACCOUNT}</Typography>
        </Alert>
      </Snackbar>
      <p style={{ margin: "20px", color: "white", fontSize: "30px" }}>
        Global Reach,
        <br />
        Reliable Deliveries.
      </p>
      {/* Conditionally render trackDisplay or quoteDisplay based on state */}
      {isQuoteDisplay
        ? quoteDisplay(handleTrackClick)
        : trackDisplay(handleQuoteClick)}
    </Grid2>
  );
};

const trackDisplay = (handleQuoteClick: () => void) => {
  return (
    <Grid2 mt={1}>
      <Card sx={{ maxWidth: 275 }}>
        <CardContent>
          <Grid2 mt={1}>
            <Card sx={{ maxWidth: 220 }}>
              <CardContent>
                <ButtonGroup
                  variant="outlined"
                  aria-label="Basic button group"
                  sx={{ width: "190px" }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      width: "50%",
                      backgroundColor: "black",
                      color: "white",
                      "&:hover": { backgroundColor: "gray" },
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <PackageSearch size={24} style={{ marginRight: "8px" }} />
                      Track
                    </span>
                  </Button>
                  {/* Trigger switching to quote display */}
                  <Button
                    sx={{
                      width: "50%",
                      color: "black",
                      borderColor: "black",
                      "&:hover": {
                        borderColor: "black",
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={handleQuoteClick}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <Truck size={24} style={{ marginRight: "8px" }} />
                      Quote
                    </span>
                  </Button>
                </ButtonGroup>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 mt={1}>
            <TextField
              id="outlined-basic"
              label="Tracking Number"
              variant="outlined"
            />
          </Grid2>
          <Grid2 mt={1}>
            <Button
              variant="contained"
              sx={{
                width: "220px",
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "gray" },
              }}
            >
              Track Package
            </Button>
          </Grid2>
        </CardContent>
      </Card>
    </Grid2>
  );
};

const quoteDisplay = (handleTrackClick: () => void) => {
  return (
    <Grid2 mt={1}>
      <Card sx={{ maxWidth: 275 }}>
        <CardContent>
          <Grid2 mt={1}>
            <Card sx={{ maxWidth: 220 }}>
              <CardContent>
                <ButtonGroup
                  variant="outlined"
                  aria-label="Basic button group"
                  sx={{ width: "190px" }}
                >
                  {/* Trigger switching to track display */}
                  <Button
                    sx={{
                      width: "50%",
                      color: "black",
                      borderColor: "black",
                      "&:hover": {
                        borderColor: "black",
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={handleTrackClick}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <PackageSearch size={24} style={{ marginRight: "8px" }} />
                      Track
                    </span>
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      width: "50%",
                      backgroundColor: "black",
                      color: "white",
                      "&:hover": { backgroundColor: "gray" },
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <Truck size={24} style={{ marginRight: "8px" }} />
                      Quote
                    </span>
                  </Button>
                </ButtonGroup>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 mt={1}>
            <TextField id="outlined-basic" label="Origin" variant="outlined" />
          </Grid2>
          <Grid2 mt={1}>
            <TextField
              id="outlined-basic"
              label="Destination"
              variant="outlined"
            />
          </Grid2>
          <Grid2 mt={1}>
            <Button
              variant="contained"
              sx={{
                width: "220px",
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "gray" },
              }}
            >
              Get Quote
            </Button>
          </Grid2>
        </CardContent>
      </Card>
    </Grid2>
  );
};
