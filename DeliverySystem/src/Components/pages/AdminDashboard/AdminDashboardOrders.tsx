import { Box, Grid2, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OrderService } from "../../../services";
import { useQuery } from "@tanstack/react-query";
import {
  useAuthentication,
  ROLE_ADMIN,
} from "../../../Hooks/useAuthentication";
import { AdminCustomCard } from "./AdminCustomCard";
import "./adminDashboard.css";
import {Order} from "../../../models";

export const AdminDashboardOrders = () => {
  const user = useAuthentication(ROLE_ADMIN);
  const { data: orders, isLoading } = useQuery(
    ["orders", user?.userInfo?.id],
    () => OrderService.GetAllOrders(),
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
          overflowX: "auto",
          height: "400px",
        }}
      >
        {!isLoading &&
          orders &&
          orders?.map((order: Order, index: number) => {
            const trackingNumber = order.trackingNumber;
            return (
              <Accordion
                key={trackingNumber}
                sx={{
                  backgroundColor: "white",
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
                  }}
                >
                  <Typography
                    sx={{ fontFamily: '"Montserrat", serif' }}
                  >{`Order ${++index}: ${trackingNumber}`}</Typography>
                </AccordionSummary>
                <AccordionDetails className="container-accordion-details">
                  <Grid2 container justifyContent={"space-around"}>
                    <AdminCustomCard
                      title={"Recipient"}
                      first={`First name: ${order.recipientFirstName}`}
                      second={`Last name: ${order.recipientLastName}`}
                      third={`Address: ${order.recipientAddress}`}
                    />
                    <AdminCustomCard
                      title={"Sender"}
                      first={`First name: ${order.senderFirstName}`}
                      second={`Last name: ${order.senderLastName}`}
                      third={`Contact: ${order.senderPhoneNumber}`}
                    />
                    <AdminCustomCard
                      title={"Order details"}
                      first={`Weight: ${order.packageWeight} kg`}
                      second={`Dimensions: ${order.packageDimension}`}
                      third={`Cost: ${order.amount} ${order.currency}`}
                    />
                  </Grid2>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>
    </Grid2>
  );
}