import { Button, ButtonGroup, Box } from "@mui/material";
import {
  ACCOUNTS_INDEX,
  BUTTON_ACCOUNTS_TITLE,
  BUTTON_ORDERS_TITLE,
  ORDERS_INDEX,
} from "./constant";
import { getClassName } from "./adminUtils";
import "./adminDashboard.css";

export const AdminDashboardTitle = ({ mode, setMode }) => {
  return (
    <Box
      sx={{
        width: "450px",
        boxShadow: "none",
        border: "1px solid #D4D7DD",
        borderRadius: "50px",
        mb: "20px",
        mx: "auto",
      }}
    >
      <ButtonGroup
        variant="outlined"
        aria-label="Basic button group"
        sx={{ width: "fit-content", height: "48px", m: "10px", gap: "1px" }}
      >
        <Button
          disableRipple
          className={getClassName(mode)}
          onClick={() => setMode(ACCOUNTS_INDEX)}
          variant="contained"
          sx={{
            width: "215px",
            borderRadius: "50px !important",
            backgroundColor: "#071528",
            color: "white",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: '"Montserrat", serif',
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "medium",
            }}
          >
            {BUTTON_ACCOUNTS_TITLE}
          </span>
        </Button>
        <Button
          disableRipple
          className={getClassName(!mode)}
          onClick={() => setMode(ORDERS_INDEX)}
          variant="contained"
          sx={{
            width: "215px",
            color: "black",
            backgroundColor: "white",
            borderRadius: "50px !important",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: '"Montserrat", serif',
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "medium",
            }}
          >
            {BUTTON_ORDERS_TITLE}
          </span>
        </Button>
      </ButtonGroup>
    </Box>
  );
};
