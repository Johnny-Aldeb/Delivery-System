import { useEffect, useState } from "react";
import { useBodyBackground } from "../../../Hooks/useBodyBackground.ts";
import {
  BACKGROUND_BOTTOM,
  BACKGROUND_TOP,
  IMAGE1,
  IMAGE2,
  IMAGE3,
} from "../../../constants.ts";
import { useParams } from "react-router-dom";
import { Card, Grid, CardContent, Typography, Box, Grid2 } from "@mui/material";
import { OrderService } from "../../../services/OrderService";
import {
  MapPinHouse,
  Calendar1,
  MapPinCheck,
  Weight,
  PackagePlus,
  Package2,
  Container,
  PackageOpen,
  Undo2,
  CircleAlert,
  Truck,
} from "lucide-react";

interface Order {
  senderAddress: string;
  recipientAddress: string;
  packageWeight: number;
  latestStatusName: string;
}

interface statusHistory {
  createdAt: string;
  packagePickedUp: string;
  packageInTransit: string;
  outForDelivery: string;
  packageDelivered: string;
  estimatedDelivery: string;
}

interface OrderData {
  order: Order;
  statusHistory: statusHistory;
}

export const iconMap = new Map([
  [
    "Shipment Created",
    () => (
      <Box
        sx={{
          width: "35px",
          height: "35px",
          backgroundColor: "#071528",
          borderRadius: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PackagePlus color="white" size={"22px"} />
      </Box>
    ),
  ],
  [
    "Picked Up",
    () => (
      <Box
        sx={{
          width: "35px",
          height: "35px",
          backgroundColor: "#071528",
          borderRadius: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Package2 color="white" size={"22px"} />
      </Box>
    ),
  ],
  [
    "In Transit",
    () => (
      <Box
        sx={{
          width: "35px",
          height: "35px",
          backgroundColor: "#071528",
          borderRadius: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container color="white" size={"22px"} />
      </Box>
    ),
  ],
  [
    "Out for Delivery",
    () => (
      <Box
        sx={{
          width: "35px",
          height: "35px",
          backgroundColor: "#071528",
          borderRadius: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Truck color="white" size={"22px"} />
      </Box>
    ),
  ],
  [
    "Delivered",
    () => (
      <Box
        sx={{
          width: "35px",
          height: "35px",
          backgroundColor: "#071528",
          borderRadius: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PackageOpen color="white" size={"22px"} />
      </Box>
    ),
  ],
  [
    "Delivery Attempted",
    () => (
      <Box
        sx={{
          width: "35px",
          height: "35px",
          backgroundColor: "#071528",
          borderRadius: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircleAlert color="white" size={"22px"} />
      </Box>
    ),
  ],
  [
    "Returned to Sender",
    () => (
      <Box
        sx={{
          width: "35px",
          height: "35px",
          backgroundColor: "#071528",
          borderRadius: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Undo2 color="white" size={"22px"} />
      </Box>
    ),
  ],
]);

export const Track = () => {
  useBodyBackground({
    backgroundImage: IMAGE2,
    backgroundPosition: BACKGROUND_BOTTOM,
    backgroundSize: "cover",
  });

  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const validTrackingNumber = trackingNumber || "";

  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const data =
          await OrderService.GetOrderByTrackingNumber(validTrackingNumber);
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [trackingNumber, validTrackingNumber]);

  let EstimatedDelivery = "";

  if (orderData?.order?.latestStatusName === "Delivered") {
    EstimatedDelivery = "Delivered";
  } else if (orderData?.order?.latestStatusName === "Out for Delivery") {
    EstimatedDelivery = "1 Business Days";
  } else if (orderData?.order?.latestStatusName === "In Transit") {
    EstimatedDelivery = "2-3 Business Days";
  } else if (orderData?.order?.latestStatusName === "Picked Up") {
    EstimatedDelivery = "5-6 Business Days";
  } else if (orderData?.order?.latestStatusName === "Shipment Created") {
    EstimatedDelivery = "6-10 Business Days";
  } else {
    EstimatedDelivery = "N/A";
  }

  const formatAddress = (address: string): string => {
    if (!address) {
      return "Invalid Address";
    }

    const parts = address.split(",");

    if (parts.length < 3) {
      return "Incomplete Address"; // Fallback for invalid address format
    }

    const city = parts[1]?.trim() || "Unknown City"; // Default to avoid undefined errors
    const province = parts[2]?.trim().split(" ")[0] || "Unknown Province"; // Default to avoid undefined errors

    return `${city}, ${province}`;
  };

  const trackingStatus = orderData?.statusHistory;
  return (
    <Grid2 container justifyContent="center" alignItems="center">
      <Card
        sx={{
          width: "fit-content",
          borderRadius: "70px",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            p: "0 !important",
            margin: "40px",
            gap: "30px",
            justifyContent: "space-between",
          }}
        >
          {/* Left section */}
          <CardContent
            sx={{
              p: "0 !important",
            }}
          >
            <Card
              sx={{
                width: "385px",
                padding: "5px 10px",
                borderRadius: "20px",
                backgroundColor: "#0d1b2a",
                margin: "auto",
                textAlign: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                color="white"
                sx={{
                  fontSize: "14px",
                  fontFamily: '"Montserrat", serif',
                  fontWeight: "light",
                }}
              >
                Tracking Number: {trackingNumber}
              </Typography>
            </Card>
            <Typography
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                fontSize: "34px",
                mt: "45px",
                ml: "15px",
                width: "200px",
                lineHeight: "40px",
              }}
            >
              {orderData?.order?.latestStatusName ?? "N/A"}
            </Typography>
            <Box sx={{ display: "flex", gap: "30px", mt: "40px", ml: "15px" }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "25px" }}
              >
                {[
                  {
                    icon: MapPinHouse,
                    label: "Origin",
                    value: formatAddress(
                      `${orderData?.order?.senderAddress ?? "N/A"}`,
                    ),
                  },
                  {
                    icon: Calendar1,
                    label: "Estimated Delivery",
                    value: `${EstimatedDelivery}`,
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <item.icon size={"16px"} />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Inter", serif',
                          fontSize: "12px",
                          color: "#848D9D",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Montserrat", serif',
                          fontSize: "14px",
                          color: "#071528",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "25px" }}
              >
                {[
                  {
                    icon: MapPinCheck,
                    label: "Destination",
                    value: formatAddress(
                      `${orderData?.order?.recipientAddress ?? "N/A"}`,
                    ),
                  },
                  {
                    icon: Weight,
                    label: "Weight",
                    value: `${orderData?.order?.packageWeight ?? "N/A"} grams`,
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <item.icon size={"16px"} />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Inter", serif',
                          fontSize: "12px",
                          color: "#848D9D",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Montserrat", serif',
                          fontSize: "14px",
                          color: "#071528",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: "48px", ml: "15px", mb: "10px" }}>
              <svg
                width="35"
                height="35"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_361_49"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="5"
                  y="0"
                  width="30"
                  height="40"
                >
                  <path
                    d="M5.48376 0.320007H34.4534V39.7867H5.48376V0.320007Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask0_361_49)">
                  <path
                    d="M34.0342 16.83L27.2575 13.7692V4.45669C27.2575 4.41294 27.2575 4.36919 27.2138 4.32544C27.17 4.10669 27.0388 3.84461 26.82 3.75711L20.3492 0.434192C20.1308 0.302942 19.8683 0.302942 19.6496 0.434192L12.7854 3.71336C12.7417 3.75711 12.6979 3.75711 12.6542 3.80086C12.4796 3.93211 12.3046 4.15044 12.3046 4.41294V9.57211L5.92126 12.6325C5.87751 12.6325 5.87751 12.6763 5.87751 12.6763C5.61501 12.8075 5.48376 13.07 5.48376 13.3759V32.2638C5.48376 32.5696 5.65876 32.8321 5.92126 33.0071L19.6063 39.6088C19.7371 39.6525 19.8246 39.6963 19.9558 39.6963C20.0871 39.6963 20.1746 39.6525 20.3054 39.6088L33.9904 33.0071C34.2529 32.8759 34.4279 32.6134 34.4279 32.2638V17.5734C34.515 17.2671 34.3404 16.9613 34.0342 16.83ZM13.9221 5.72461L19.1688 8.21669V12.1517L13.9221 9.61586V5.72461ZM25.6396 13.7692L20.8304 16.2179V8.04169L25.6396 5.72461V13.7692ZM26.0333 26.9296L20.7867 24.35V18.8413L26.0333 21.3771V26.9296ZM19.1688 17.4421C19.1688 17.5296 19.1688 17.6171 19.1688 17.7042V24.3938L13.9221 26.9734V17.2234L19.1688 14.6875V17.4421ZM13.9221 29.5092L19.1688 32.045V37.6413L13.9221 35.1054V29.5092ZM19.9996 30.6459L14.9717 28.2413L19.9996 25.7492L25.0275 28.1975L19.9996 30.6459ZM26.82 19.9342L21.7483 17.4859L26.4267 15.1246L31.8046 17.5734L26.82 19.9342ZM19.9558 2.05211L24.5904 4.41294L19.7808 6.73003L14.9717 4.45669L19.9558 2.05211ZM13.1354 11.015L18.1196 13.4196L13.1354 15.8242L8.15085 13.4196L13.1354 11.015ZM7.10168 14.6875L12.3483 17.2234V34.275L7.10168 31.7392V14.6875ZM20.7867 32.045L26.0333 29.5092V35.0617L20.7867 37.5979V32.045ZM27.6508 34.275V21.3334L32.8975 18.8413V31.7829L27.6508 34.275Z"
                    fill="#071528"
                  />
                </g>
              </svg>
            </Box>
          </CardContent>

          {/* Right section - Tracking Progress inside a rounded card */}
          <CardContent
            sx={{
              width: "325px",
              display: "flex",
              justifyContent: "center",
              p: "0 !important",
            }}
          >
            <Card
              sx={{
                pt: "45px",
                pb: "35px",
                borderRadius: "35px",
                border: "1px solid #DADDE2",
                boxShadow: "none", // Subtle shadow for depth
                width: "325px", // Slight padding on sides within the main card
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CardContent sx={{ p: "0 !important" }}>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontFamily: '"Inter", serif',
                    mb: "20px",
                  }}
                >
                  Tracking Progress
                </Typography>
                {trackingStatus && (
                  <Grid2 container direction="column" spacing={"10px"}>
                    {trackingStatus?.map((el) => {
                      return (
                        <Grid item key={el.id} container alignItems="center">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "16px",
                            }}
                          >
                            <span>{iconMap.get(el.statusName)?.()}</span>
                          </div>
                          <div>
                            <Typography
                              sx={{
                                fontFamily: '"Inter", serif',
                                fontSize: "16px",
                                color: "#071528",
                              }}
                            >
                              {el.statusName}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: '"Inter", serif',
                                fontSize: "12px",
                                color: "#848D9D",
                              }}
                            >
                              {el.createdAt}
                            </Typography>
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid2>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </CardContent>
      </Card>
    </Grid2>
  );
};

export default Track;
