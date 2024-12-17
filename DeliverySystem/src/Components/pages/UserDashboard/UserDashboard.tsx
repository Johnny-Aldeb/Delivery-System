import { Grid2, Typography, Button } from "@mui/material";
import { useBodyBackground } from "../../../Hooks/useBodyBackground";
import { useAuthentication, ROLE_USER } from "../../../Hooks/useAuthentication";
import { USER_INFO, USER_FIRST_NAME } from "../../../Hooks/constants";
import { BACKGROUND_RIGHT, IMAGE3, QUOTE_URL } from "../../../constants";
import { USER_DASHBOARD_TITLE } from "./constants";
import { UserOrderTable } from "./UserOrderTable";
import { Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../PageTitle.tsx";

export const UserDashboard = () => {
  useBodyBackground({
    backgroundImage: IMAGE3,
    backgroundPosition: BACKGROUND_RIGHT,
    backgroundSize: "cover",
  });
  const navigate = useNavigate();
  const user = useAuthentication(ROLE_USER);

  return (
    <Grid2 xs={12} md={7}>
      <Grid2 container direction="column" alignItems="center">
        <Grid2>
          <PageTitle
            title={`${user?.[USER_INFO]?.[USER_FIRST_NAME]}'s ${USER_DASHBOARD_TITLE}`}
          />
        </Grid2>

        <Grid2
          width={"800px"}
          sx={{
            height: "400px", // Set the desired height
            overflowY: "auto", // Enable vertical scrolling
            borderRadius: "50px", // Optional: Add rounded corners
          }}
        >
          <UserOrderTable />
        </Grid2>
        <Grid2 pt={"40px"}>
          <Button
            variant="contained"
            disableRipple
            sx={{
              borderRadius: "30px",
              height: "50px",
              width: "250px",
              boxShadow: "none",
              color: "#071528",
              gap: "10px",
              backgroundColor: "white",
            }}
            onClick={() => navigate(QUOTE_URL)}
          >
            <Truck />
            <Typography
              sx={{
                fontFamily: '"Montserrat", serif',
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "medium",
              }}
            >
              Create Shipment
            </Typography>
          </Button>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
