import { MapPinCheck, Calendar1, Weight, MapPinHouse } from "lucide-react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useCallback } from "react";
import { Payment } from "models";

interface QuoteProposalProps {
  type: "document" | "package";
  subtype: "standard" | "large" | "small";
  origin: string;
  destination: string;
  weight?: number;
  totalPrice: number;
  distance: number;
  basePrice: number;
}

export default function QuoteProposal({
  type = "document",
  subtype = "large",
  origin = "Montréal, Quebec",
  destination = "Montréal, Quebec",
  weight = 5000,
  totalPrice = 10,
  distance = 500,
  basePrice = 10,
}: QuoteProposalProps) {
  const getMaxDimensions = (): string => {
    if (type === "document") {
      return subtype === "standard"
        ? "Max dimensions: 245mm x 156mm"
        : "Max dimensions: 380mm x 270mm";
    } else {
      return subtype === "small"
        ? "Max dimensions: 35cm x 26cm x 5cm"
        : "Max dimensions: 40cm x 30cm x 20cm";
    }
  };

  const getWeight = (): string => {
    if (type === "document") {
      return subtype === "standard" ? "50g" : "500g";
    }
    return `${(weight / 1000).toFixed(1)} kg`;
  };

  const getDistancePrice = (): string => {
    if (type === "document") return "$0";
    return `$${(distance * 0.01).toFixed(2)}`;
  };

  const getWeightPrice = (): string => {
    if (type === "document") return "$0";
    return `$${Math.floor(weight / 100)}`;
  };

  const getTitle = (): string => {
    if (type === "document") {
      return `${subtype === "standard" ? "Standard" : "Large"} Envelope`;
    }
    return `${subtype === "small" ? "Small" : "Large"} Package`;
  };

  const handleOnShip = useCallback(async () => {
    // try {
    //   const payment = new Payment({
    //     amount: Number(totalPrice.toFixed(2)) * 100,
    //     productName: `${type} - ${subtype}`,
    //     userEmail: "test@test.com",
    //   });
    //   const data = await PaymentService.stripeURL(payment);
    //   if (data.url) {
    //     window.location.href = data.url;
    //   } else {
    //     console.error("Stripe URL not found in response");
    //   }
    // } catch (error) {
    //   console.error("Error during Stripe checkout:", error);
    // }
  }, []);

  return (
    <Box sx={{ width: "800px", mx: "auto", borderRadius: "50px" }}>
      <Card sx={{ borderRadius: "50px" }}>
        <CardContent sx={{ m: "25px", p: "0 !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left Section */}
            <Box sx={{ m: "15px" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}
              >
                <img
                  src={`/${
                    type === "document"
                      ? subtype === "standard"
                        ? "StandardEnvelope"
                        : "LargeEnvelope"
                      : subtype === "small"
                      ? "SmallPackage"
                      : "LargePackage"
                  }.svg`}
                  alt={getTitle()}
                  style={{ width: "90px", objectFit: "contain" }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", serif',
                      fontSize: "18px",
                      color: "#071528",
                    }}
                  >
                    {getTitle()}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", serif',
                      fontSize: "12px",
                      color: "#071528",
                    }}
                  >
                    {getMaxDimensions()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "30px" }}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "25px" }}
                >
                  {[
                    { icon: MapPinHouse, label: "Origin", value: origin },
                    {
                      icon: Calendar1,
                      label: "Estimated Delivery",
                      value: "3-5 Business Days",
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
                      value: destination,
                    },
                    { icon: Weight, label: "Weight", value: getWeight() },
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
            </Box>

            {/* Right Section */}
            <Box
              sx={{
                width: "340px",
                border: "1px solid rgba(132, 141, 157, 0.35)",
                borderRadius: "30px",
              }}
            >
              <Box sx={{ m: "40px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", serif',
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: "#071528",
                    }}
                  >
                    Total Cost
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", serif',
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: "#071528",
                    }}
                  >
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{}}>
                  {[
                    { label: getTitle(), value: `$${basePrice}` },
                    { label: "Distance", value: getDistancePrice() },
                    { label: "Weight", value: getWeightPrice() },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '"Montserrat", serif',
                          fontSize: "16px",
                          fontWeight: "medium",
                          color: "#848D9D",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Montserrat", serif',
                          fontSize: "16px",
                          color: "#071528",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
          <Button
            disableRipple
            fullWidth
            variant="contained"
            sx={{
              mt: "25px",
              borderRadius: "30px",
              backgroundColor: "#071528",
              fontFamily: '"Montserrat", serif',
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "medium",
              height: "50px",
              boxShadow: "none",
            }}
            onClick={handleOnShip}
          >
            Ship
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
