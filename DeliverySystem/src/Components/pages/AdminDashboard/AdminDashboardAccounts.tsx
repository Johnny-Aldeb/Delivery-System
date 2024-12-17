import { Box, Grid2, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UserService } from "../../../services";
import { useQuery } from "@tanstack/react-query";
import {
  useAuthentication,
  ROLE_ADMIN,
} from "../../../Hooks/useAuthentication";
import { userTypeMapper } from "../../AuthForm/authFormUtils";
import "./adminDashboard.css";

export const AdminDashboardAccounts = () => {
  const user = useAuthentication(ROLE_ADMIN);
  const { data: users, isLoading } = useQuery(
    ["users", user?.userInfo?.id],
    () => UserService.GetAllUsers(),
  );

  return (
    <Grid2
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "fit-content",
        mb: "30px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          p: "25px",
          borderRadius: "50px",
          height: "400px",
          overflowX: "auto",
        }}
      >
        {!isLoading &&
          users &&
          users?.map((user, index) => {
            return (
              <Accordion
                key={user.email}
                sx={{
                  boxShadow: "none",
                  color: "black",
                  border: "1px solid rgba(0, 0, 0, .125)",
                  borderRadius: "35px",
                  width: "800px",
                  mb: "10px",
                  "&:first-of-type": {
                    borderTopLeftRadius: "35px",
                    borderTopRightRadius: "35px",
                  },
                  "&:last-of-type": {
                    borderBottomLeftRadius: "35px",
                    borderBottomRightRadius: "35px",
                  },
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    height: "50px",
                    pl: "20px",
                    fontFamily: '"Montserrat", serif',
                  }}
                >
                  {`Account ${++index}: ${user.firstName} ${user.lastName}`}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    p={1}
                    variant="h6"
                    sx={{ fontFamily: '"Montserrat", serif' }}
                  >{`Account Details`}</Typography>
                  <Typography
                    pl={1}
                    sx={{ fontFamily: '"Montserrat", serif' }}
                  >{`Account type: ${userTypeMapper.get(
                    user.userTypeId,
                  )}`}</Typography>
                  <Typography
                    pl={1}
                    sx={{ fontFamily: '"Montserrat", serif' }}
                  >{`Email: ${user.email}`}</Typography>
                  <Typography
                    pl={1}
                    sx={{ fontFamily: '"Montserrat", serif' }}
                  >{`Phone number: ${user.phoneNumber}`}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>
    </Grid2>
  );
};
