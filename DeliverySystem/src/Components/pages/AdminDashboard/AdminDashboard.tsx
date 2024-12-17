import { Box, Button, ButtonGroup, Grid2, Typography } from "@mui/material";
import { useBodyBackground } from "../../../Hooks/useBodyBackground";
import {
  useAuthentication,
  ROLE_ADMIN,
} from "../../../Hooks/useAuthentication";
import { BACKGROUND_RIGHT, IMAGE3 } from "../../../constants";
import { useState } from "react";
import { ACCOUNTS_INDEX } from "./constant";
import { AdminDashboardAccounts } from "./AdminDashboardAccounts";
import { AdminDashboardOrders } from "./AdminDashboardOrders";
import { AdminDashboardTitle } from "./AdminDashboardTitle";
import "./adminDashboard.css";
import { PageTitle } from "../../PageTitle.tsx";

export const AdminDashboard = () => {
  useBodyBackground({
    backgroundImage: IMAGE3,
    backgroundPosition: BACKGROUND_RIGHT,
    backgroundSize: "cover",
  });

  const userInfo = useAuthentication(ROLE_ADMIN);
  const [mode, setMode] = useState<boolean>(ACCOUNTS_INDEX);

  return (
    <Grid2 className="admin-dasboard">
      <Grid2 container className="container-title">
        <AdminDashboardTitle mode={mode} setMode={setMode} />
      </Grid2>
      <Grid2 container justifyContent="center">
        <Box>
          {mode ? <AdminDashboardOrders /> : <AdminDashboardAccounts />}
        </Box>
      </Grid2>
    </Grid2>
  );
};
