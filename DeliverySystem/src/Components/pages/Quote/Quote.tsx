import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  styled,
  InputAdornment,
} from "@mui/material";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Package, Mail } from "lucide-react";
import QuoteProposal from "./QuoteProposal";
import { PageTitle } from "../../PageTitle.tsx";
import { useBodyBackground } from "../../../Hooks/useBodyBackground.ts";
import { BACKGROUND_BOTTOM, IMAGE2 } from "../../../constants.ts";

const StyledRadioGroup = styled(RadioGroup)({
  display: "grid",
  gridTemplateColumns: "318px 318px",
  gap: "14px",
});

const RadioButton = styled(FormControlLabel)({
  margin: 0,
  paddingLeft: "25px",
  height: "54px",
  border: "1px solid #D4D7DD",
  borderRadius: 30,
  transition: "all 0.2s ease",

  "& .MuiSvgIcon-root": {
    display: "none",
  },

  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  "&.Mui-checked": {
    borderColor: "#071528",
  },
  "& .MuiRadio-root": {
    padding: 0,
  },
});

const RadioCard = styled(FormControlLabel)({
  margin: 0,
  padding: "25px",
  border: "1px solid #D4D7DD",
  borderRadius: 30,
  transition: "all 0.2s ease",

  "& .MuiSvgIcon-root": {
    display: "none",
  },

  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  "&.Mui-checked": {
    borderColor: "#071528",
  },
  "& .MuiRadio-root": {
    padding: 0,
  },
});

const StyledTextField = styled(TextField)(() => ({
  "& .MuiFormLabel-root": {
    paddingLeft: "25px",
  },
  "& .MuiInputBase-input": {
    paddingLeft: "25px",
  },
  "& .MuiInputLabel-root": {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#848D9D",
    transition: "opacity 0.2s",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#848D9D",
    opacity: 0,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
    "& fieldset": {
      borderColor: "#D4D7DD",
      top: 0,
      legend: {
        display: "none",
      },
    },
    "&.Mui-focused fieldset": {
      borderColor: "#071528",
    },
  },
  "& .MuiInputLabel-shrink": {
    color: "#848D9D",
    opacity: 0,
  },
}));

const formatAddress = (address: string): string => {
  const parts = address.split(",");

  const city = parts[1].trim(); // Part between the first and second commas
  const province = parts[2].trim().split(" ")[0]; // First word in part after the second comma
  return `${city}, ${province}`;
};

const calculateDistance = async (
  origin: string,
  destination: string
): Promise<number> => {
  const service = new google.maps.DistanceMatrixService();
  try {
    const response = await service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
    });

    if (response.rows[0]?.elements[0]?.distance) {
      return response.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
    }
  } catch (error) {
    console.error("Error calculating distance:", error);
  }
  return 0;
};

interface FormValues {
  origin: string;
  destination: string;
  type: string;
  subtype: string;
  weight?: number;
}

interface QuoteData {
  type: "document" | "package";
  subtype: "standard" | "large" | "small";
  origin: string;
  destination: string;
  weight?: number;
  totalPrice: number;
  distance: number;
  basePrice: number;
}

export default function Quote() {
  useBodyBackground({
    backgroundImage: IMAGE2,
    backgroundPosition: BACKGROUND_BOTTOM,
    backgroundSize: "cover",
  });

  const [showProposal, setShowProposal] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [originAutocomplete, setOriginAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [destinationAutocomplete, setDestinationAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const onOriginLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      setOriginAutocomplete(autocomplete);
    },
    []
  );

  const onDestinationLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      setDestinationAutocomplete(autocomplete);
    },
    []
  );

  const formik = useFormik<FormValues>({
    initialValues: {
      origin: "",
      destination: "",
      type: "",
      subtype: "",
      weight: undefined,
    },
    validationSchema: Yup.object({
      origin: Yup.string().required("Origin is required"),
      destination: Yup.string().required("Destination is required"),
      type: Yup.string().required("Type is required"),
      subtype: Yup.string().required("Subtype is required"),
      weight: Yup.number().when("type", {
        is: "package",
        then: (schema) =>
          schema.required("Weight is required for packages").min(1).max(5000),
      }),
    }),
    onSubmit: async (values) => {
      if (!isLoaded) return;

      try {
        // First calculate distance using the full addresses
        const distance = await calculateDistance(
          values.origin,
          values.destination
        );

        // Format addresses to city, province format before setting quote data
        const [formattedOrigin, formattedDestination] = await Promise.all([
          formatAddress(values.origin),
          formatAddress(values.destination),
        ]);

        // Calculate prices
        const basePrice = calculateBasePrice(values.type, values.subtype);
        const distancePrice = calculateDistancePrice(distance, values.type);
        const weightPrice = calculateWeightPrice(values.weight, values.type);
        const totalPrice = basePrice + distancePrice + weightPrice;

        // Set the quote data with formatted addresses
        setQuoteData({
          type: values.type as "document" | "package",
          subtype: values.subtype as "standard" | "large" | "small",
          origin: formattedOrigin,
          destination: formattedDestination,
          weight: values.weight,
          totalPrice,
          distance,
          basePrice,
        });

        setShowProposal(true);
      } catch (error) {
        console.error("Error processing quote:", error);
      }
    },
  });

  const calculateBasePrice = (type: string, subtype: string): number => {
    if (type === "document") {
      return subtype === "standard" ? 5 : 10;
    } else {
      return subtype === "small" ? 10 : 20;
    }
  };

  const calculateDistancePrice = (distance: number, type: string): number => {
    // Only calculate distance price for packages
    if (type === "document") return 0;
    return distance * 0.01; // 1 cent per kilometer
  };

  const calculateWeightPrice = (
    weight: number | undefined,
    type: string
  ): number => {
    // Only calculate weight price for packages
    if (type === "document") return 0;
    if (!weight) return 0;
    return Math.floor(weight / 100); // $1 per 100 grams
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === formik.values.type) {
      formik.setFieldValue("type", "");
      formik.setFieldValue("subtype", "");
      formik.setFieldValue("weight", undefined);
    } else {
      formik.setFieldValue("type", value);
      formik.setFieldValue("subtype", "");
      formik.setFieldValue("weight", undefined);
    }
  };

  const handleSubtypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === formik.values.subtype) {
      formik.setFieldValue("subtype", "");
    } else {
      formik.setFieldValue("subtype", value);
    }
  };

  const handlePlaceChanged = (field: "origin" | "destination") => () => {
    const autocomplete =
      field === "origin" ? originAutocomplete : destinationAutocomplete;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        formik.setFieldValue(field, place.formatted_address);
      }
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <PageTitle title="Get a Quote" />
      {!showProposal ? (
        <Card sx={{ width: "700px", mx: "auto", borderRadius: "50px", p: "0" }}>
          <CardContent sx={{ m: "25px", p: "0 !important" }}>
            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "14px" }}
              >
                <Autocomplete
                  onLoad={onOriginLoad}
                  onPlaceChanged={handlePlaceChanged("origin")}
                >
                  <StyledTextField
                    fullWidth
                    id="origin"
                    name="origin"
                    label="Origin"
                    value={formik.values.origin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.origin && Boolean(formik.errors.origin)
                    }
                  />
                </Autocomplete>

                <Autocomplete
                  onLoad={onDestinationLoad}
                  onPlaceChanged={handlePlaceChanged("destination")}
                >
                  <StyledTextField
                    fullWidth
                    id="destination"
                    name="destination"
                    label="Destination"
                    value={formik.values.destination}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.destination &&
                      Boolean(formik.errors.destination)
                    }
                  />
                </Autocomplete>

                <StyledRadioGroup
                  name="type"
                  value={formik.values.type}
                  onChange={handleTypeChange}
                >
                  <RadioButton
                    value="document"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                        }}
                      >
                        <Mail size={24} />
                        <Typography>Document</Typography>
                      </Box>
                    }
                    className={
                      formik.values.type === "document" ? "Mui-checked" : ""
                    }
                  />
                  <RadioButton
                    value="package"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                        }}
                      >
                        <Package />
                        <Typography>Package</Typography>
                      </Box>
                    }
                    className={
                      formik.values.type === "package" ? "Mui-checked" : ""
                    }
                  />
                </StyledRadioGroup>

                <AnimatePresence mode="wait">
                  {formik.values.type && (
                    <motion.div
                      key={formik.values.type}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      {formik.values.type === "document" ? (
                        <StyledRadioGroup
                          name="subtype"
                          value={formik.values.subtype}
                          onChange={handleSubtypeChange}
                        >
                          <RadioCard
                            value="standard"
                            control={<Radio />}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "266px",
                                }}
                              >
                                <Box>
                                  <Typography
                                    color={"#071528"}
                                    sx={{
                                      fontFamily: '"Inter", serif',
                                      fontSize: "15px",
                                    }}
                                  >
                                    Standard Envelope
                                  </Typography>
                                  <Box
                                    sx={{
                                      color: "#848D9D",
                                      fontSize: "14px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <Typography
                                      color={"#848D9D"}
                                      sx={{
                                        fontFamily: '"Inter", serif',
                                        fontSize: "14px",
                                      }}
                                    >
                                      Max length: 245mm
                                    </Typography>
                                    <Typography
                                      color={"#848D9D"}
                                      sx={{
                                        fontFamily: '"Inter", serif',
                                        fontSize: "14px",
                                      }}
                                    >
                                      Max width: 156mm
                                    </Typography>
                                    <Typography
                                      color={"#848D9D"}
                                      sx={{
                                        fontFamily: '"Inter", serif',
                                        fontSize: "14px",
                                      }}
                                    >
                                      Max weight: 50g
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    color={"#848D9D"}
                                    sx={{
                                      fontFamily: '"Inter", serif',
                                      fontSize: "14px",
                                      textAlign: "right",
                                    }}
                                  >
                                    $5
                                  </Typography>
                                  <img
                                    src={"StandardEnvelope.svg"}
                                    alt="Standard Envelope"
                                    style={{ height: "45px" }}
                                  />
                                </Box>
                              </Box>
                            }
                            className={
                              formik.values.subtype === "standard"
                                ? "Mui-checked"
                                : ""
                            }
                          />
                          <RadioCard
                            value="large"
                            control={<Radio />}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "266px",
                                }}
                              >
                                <Box>
                                  <Typography
                                    color={"#071528"}
                                    sx={{
                                      fontFamily: '"Inter", serif',
                                      fontSize: "15px",
                                    }}
                                  >
                                    Large Envelope
                                  </Typography>
                                  <Box
                                    sx={{
                                      color: "#848D9D",
                                      fontSize: "14px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <Typography
                                      color={"#848D9D"}
                                      sx={{
                                        fontFamily: '"Inter", serif',
                                        fontSize: "14px",
                                      }}
                                    >
                                      Max length: 380mm
                                    </Typography>
                                    <Typography
                                      color={"#848D9D"}
                                      sx={{
                                        fontFamily: '"Inter", serif',
                                        fontSize: "14px",
                                      }}
                                    >
                                      Max width: 270mm
                                    </Typography>
                                    <Typography
                                      color={"#848D9D"}
                                      sx={{
                                        fontFamily: '"Inter", serif',
                                        fontSize: "14px",
                                      }}
                                    >
                                      Max weight: 500g
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    color={"#848D9D"}
                                    sx={{
                                      fontFamily: '"Inter", serif',
                                      fontSize: "14px",
                                      textAlign: "right",
                                    }}
                                  >
                                    $10
                                  </Typography>
                                  <img
                                    src={"LargeEnvelope.svg"}
                                    alt="Large Envelope"
                                    style={{ height: "52px" }}
                                  />
                                </Box>
                              </Box>
                            }
                            className={
                              formik.values.subtype === "large"
                                ? "Mui-checked"
                                : ""
                            }
                          />
                        </StyledRadioGroup>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                          }}
                        >
                          <StyledRadioGroup
                            name="subtype"
                            value={formik.values.subtype}
                            onChange={handleSubtypeChange}
                          >
                            <RadioCard
                              value="small"
                              control={<Radio />}
                              label={
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "266px",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      color={"#071528"}
                                      sx={{
                                        fontFamily: '"Inter", serif',
                                        fontSize: "15px",
                                      }}
                                    >
                                      Small Package
                                    </Typography>
                                    <Box
                                      sx={{
                                        color: "#848D9D",
                                        fontSize: "14px",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                        }}
                                      >
                                        Max length: 35cm
                                      </Typography>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                        }}
                                      >
                                        Max width: 26cm
                                      </Typography>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                        }}
                                      >
                                        Max height: 5cm
                                      </Typography>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                        }}
                                      >
                                        Max weight: 5kg
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                          textAlign: "right",
                                        }}
                                      >
                                        $10
                                      </Typography>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "10px",
                                          textAlign: "right",
                                        }}
                                      >
                                        +1¢/km +$1/100g
                                      </Typography>
                                    </Box>
                                    <img
                                      src={"SmallPackage.svg"}
                                      alt="Small Package"
                                      style={{ height: "45px" }}
                                    />
                                  </Box>
                                </Box>
                              }
                              className={
                                formik.values.subtype === "small"
                                  ? "Mui-checked"
                                  : ""
                              }
                            />
                            <RadioCard
                              value="large"
                              control={<Radio />}
                              label={
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "266px",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      color={"#071528"}
                                      sx={{
                                        fontFamily: '"Inter", serif',
                                        fontSize: "15px",
                                      }}
                                    >
                                      Large Package
                                    </Typography>
                                    <Box
                                      sx={{
                                        color: "#848D9D",
                                        fontSize: "14px",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                        }}
                                      >
                                        Max length: 40cm
                                      </Typography>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                        }}
                                      >
                                        Max width: 30cm
                                      </Typography>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                        }}
                                      >
                                        Max height: 19cm
                                      </Typography>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                        }}
                                      >
                                        Max weight: 5kg
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "14px",
                                          textAlign: "right",
                                        }}
                                      >
                                        $20
                                      </Typography>
                                      <Typography
                                        color={"#848D9D"}
                                        sx={{
                                          fontFamily: '"Inter", serif',
                                          fontSize: "10px",
                                          textAlign: "right",
                                        }}
                                      >
                                        +1¢/km +$1/100g
                                      </Typography>
                                    </Box>
                                    <img
                                      src={"LargePackage.svg"}
                                      alt="Large Package"
                                      style={{ height: "52px" }}
                                    />
                                  </Box>
                                </Box>
                              }
                              className={
                                formik.values.subtype === "large"
                                  ? "Mui-checked"
                                  : ""
                              }
                            />
                          </StyledRadioGroup>

                          <StyledTextField
                            fullWidth
                            id="weight"
                            name="weight"
                            label="Weight"
                            type="string"
                            variant="outlined"
                            value={formik.values.weight || ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.weight &&
                              Boolean(formik.errors.weight)
                            }
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position="start">
                                    grams
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        </Box>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disableRipple
                  sx={{
                    borderRadius: "30px",
                    backgroundColor: "#071528",
                    fontFamily: '"Montserrat", serif',
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: "medium",
                    height: "50px",
                    boxShadow: "none",
                  }}
                >
                  Get Quote
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{
            opacity: 1,
            scale: 0.875,
            marginLeft: "auto",
            marginRight: "auto",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            marginLeft: "auto",
            marginRight: "auto",
          }}
          transition={{ duration: 0.4 }}
        >
          {quoteData && <QuoteProposal {...quoteData} />}
        </motion.div>
      )}
    </Box>
  );
}
