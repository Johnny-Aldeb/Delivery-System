import { useState } from "react";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Truck } from "lucide-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OrderService } from "../../../services";
import { useQuery } from "@tanstack/react-query";
import {
  useAuthentication,
  ROLE_DRIVER,
} from "../../../Hooks/useAuthentication";
import { USER_INFO, USER_ID } from "../../../Hooks/constants";
import { Grid2 } from "@mui/material";
import { DriverOrderDetails } from "./DriverOrderDetails";
import { Order } from "models";

export const DriverDashboardOrderList = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const user = useAuthentication(ROLE_DRIVER);
  const { data: orders, isLoading } = useQuery(
    ["getOrdersBySenderId", user?.userInfo?.id],
    () => OrderService.GetOrdersByDriverId(user?.[USER_INFO]?.[USER_ID]),
  );

  console.log("data", orders);

  return (
    <Grid2 sx={{ margin: "25px" }}>
      {!isLoading && orders ? (
        orders.map((order: Order) => {
          return (
            <Accordion
              key={order.trackingNumber}
              expanded={expanded === order.trackingNumber}
              onChange={handleChange(order.trackingNumber)}
              disableGutters
              sx={{
                boxShadow: "none",
                color: "black",
                border: "1px solid rgba(0, 0, 0, .125)",
                borderRadius: "35px",
                marginTop: "15px",
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
                expandIcon={<ExpandMoreIcon sx={{ color: "black" }} />}
                aria-controls="panel1d-content"
                id="panel1d-header"
                sx={{ height: "50px", pl: "20px" }}
              >
                {" "}
                <Truck />
                <Typography pl={2} sx={{ fontFamily: '"Montserrat", serif' }}>
                  <b>Delivery number: </b>
                  {order.trackingNumber}
                </Typography>
              </AccordionSummary>
              <DriverOrderDetails order={order} />
            </Accordion>
          );
        })
      ) : (
        <Typography variant="h4">There are no orders to display.</Typography>
      )}
    </Grid2>
  );
};
