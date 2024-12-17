import { Grid2, Card, Typography } from "@mui/material";
import { useBodyBackground } from "../../../Hooks/useBodyBackground";
import { useAuthentication, ROLE_USER } from "../../../Hooks/useAuthentication";
import { BACKGROUND_RIGHT, IMAGE3 } from "../../../constants";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { UserOrderTableRow } from "./UserOrderTableRow";
import { OrderService } from "../../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function createData(
  trackingNumber: string,
  driver: string,
  recipient: string,
  destination: string,
  status: string,
  packageDimension: string,
  weight: number,
  cost: string,
  paymentMethod: string,
) {
  return {
    trackingNumber: trackingNumber,
    driver: driver,
    recipient: recipient,
    destination: destination,
    status: status,
    packageDimension: packageDimension,
    weight: weight,
    cost: cost,
    paymentMethod: paymentMethod,
  };
}

export const UserOrderTable = () => {
  useBodyBackground({
    backgroundImage: IMAGE3,
    backgroundPosition: BACKGROUND_RIGHT,
    backgroundSize: "cover",
  });

  const user = useAuthentication(ROLE_USER);
  const [dataRows, setDataRows] = useState([]);

  const { data, isLoading, isError } = useQuery(
    ["getOrdersBySenderId", user?.userInfo?.id],
    () => OrderService.GetOrdersBySenderId(user?.userInfo?.id),
    {
      onSuccess: (data) => {
        const transformedData = data.map((order) =>
          createData(
            order.trackingNumber,
            `${order.driverFirstName} ${order.driverLastName}`,
            `${order.recipientFirstName} ${order.recipientLastName}`,
            order.recipientAddress,
            order.latestStatusName,
            order.packageDimension,
            order.packageWeight,
            `${order.amount} ${order.currency}`,
            order.method,
          ),
        );
        setDataRows(transformedData);
      },
    },
  );

  console.log(JSON.stringify(data));
  return (
    <>
      {!isLoading && (
        <Grid2 container justifyContent="center">
          <Grid2 item xs={12} md={12} sx={{ width: "100%" }}>
            <Card
              sx={{
                height: "400px",
                padding: "25px",
                background: "linear-gradient(to bottom, #ffffff, #f0f0f5)",
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: "30px",
                  overflow: "hidden",
                  boxShadow: "none",
                }}
              >
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "black" }}>
                      <TableCell sx={{ color: "white" }} />
                      <TableCell
                        sx={{
                          color: "white",
                          fontFamily: '"Montserrat", serif',
                        }}
                      >
                        Tracking Number
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontFamily: '"Montserrat", serif',
                        }}
                      >
                        Driver
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontFamily: '"Montserrat", serif',
                        }}
                      >
                        Recipient
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontFamily: '"Montserrat", serif',
                        }}
                      >
                        Destination
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "white",
                          fontFamily: '"Montserrat", serif',
                        }}
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataRows?.map((row, index) => (
                      <UserOrderTableRow
                        key={row?.tackingNumber}
                        row={row}
                        index={index}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {!dataRows.length && (
                <Grid2 container sx={{ justifyContent: "center" }}>
                  {" "}
                  <Typography
                    variant="h5"
                    color="black"
                    p={5}
                    pb={3}
                    sx={{ fontFamily: '"Montserrat", serif' }}
                  >
                    There are currently no results to display.
                  </Typography>
                </Grid2>
              )}
            </Card>
          </Grid2>
        </Grid2>
      )}
    </>
  );
};
