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
  Typography,
  styled,
  InputAdornment,
} from "@mui/material";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Package, Mail } from "lucide-react";
import QuoteProposal from "./QuoteProposal.tsx";
import { PageTitle } from "../../PageTitle.tsx";
import { useBodyBackground } from "../../../Hooks/useBodyBackground.ts";
import { BACKGROUND_BOTTOM, IMAGE2 } from "../../../constants.ts";
import { StyledTextField } from "../../StyledTextField.tsx";
import { useLocation } from "react-router-dom";

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

const calculateDistance = async (
  origin: string,
  destination: string,
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
  weight: number;
}

interface QuoteData {
  type: "document" | "package";
  subtype: "standard" | "large" | "small";
  originStreetNumber: string;
  originStreetName: string;
  originCity: string;
  originProvince: string;
  originPostalCode: string;
  originCountry: string;
  destinationStreetNumber: string;
  destinationStreetName: string;
  destinationCity: string;
  destinationProvince: string;
  destinationPostalCode: string;
  destinationCountry: string;
  weight: number;
  totalPrice: number;
  distance: number;
  basePrice: number;
}

interface AddressComponents {
  streetNumber: string;
  streetName: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  fullAddress: string;
}

interface Place extends google.maps.places.PlaceResult {
  formatted_address?: string;
  address_components?: google.maps.GeocoderAddressComponent[];
  geometry?: google.maps.places.PlaceGeometry;
}

const extractAddressComponents = (place: Place): AddressComponents | null => {
  if (!place.address_components) return null;

  let streetNumber = "";
  let streetName = "";
  let city = "";
  let province = "";
  let postalCode = "";
  let country = "";

  place.address_components.forEach((component) => {
    const types = component.types;

    if (types.includes("street_number")) {
      streetNumber = component.long_name;
    }
    if (types.includes("route")) {
      streetName = component.long_name;
    }
    if (types.includes("locality")) {
      city = component.long_name;
    }
    if (types.includes("administrative_area_level_1")) {
      province = component.short_name;
    }
    if (types.includes("postal_code")) {
      postalCode = component.long_name;
    }
    if (types.includes("country")) {
      country = component.long_name;
    }
  });

  // Validate that we have all required components
  if (
    !streetNumber ||
    !streetName ||
    !city ||
    !province ||
    !postalCode ||
    !country
  ) {
    return null;
  }

  return {
    streetNumber,
    streetName,
    city,
    province,
    postalCode,
    country,
    fullAddress:
      place.formatted_address ||
      `${streetNumber} ${streetName}, ${city}, ${province} ${postalCode}, ${country}`,
  };
};

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
  const [originAddress, setOriginAddress] = useState<AddressComponents | null>(
    null,
  );
  const [destinationAddress, setDestinationAddress] =
    useState<AddressComponents | null>(null);

  const location = useLocation();
  const { origin, destination } = location.state || {};

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const onOriginLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete): void => {
      setOriginAutocomplete(autocomplete);
      autocomplete.setOptions({
        types: ["address"],
        fields: ["formatted_address", "address_components", "geometry"],
      });
    },
    [],
  );

  const onDestinationLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete): void => {
      setDestinationAutocomplete(autocomplete);
      autocomplete.setOptions({
        types: ["address"],
        fields: ["formatted_address", "address_components", "geometry"],
      });
    },
    [],
  );

  const formik = useFormik<FormValues>({
    initialValues: {
      origin: origin || "",
      destination: destination || "",
      type: "",
      subtype: "",
      weight: 0,
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
      if (!isLoaded || !originAddress || !destinationAddress) return;

      try {
        const distance = await calculateDistance(
          values.origin,
          values.destination,
        );
        const basePrice = calculateBasePrice(values.type, values.subtype);
        const distancePrice = calculateDistancePrice(distance, values.type);
        const weightPrice = calculateWeightPrice(values.weight, values.type);
        const totalPrice = basePrice + distancePrice + weightPrice;

        setQuoteData({
          type: values.type as "document" | "package",
          subtype: values.subtype as "standard" | "large" | "small",
          originStreetNumber: originAddress.streetNumber,
          originStreetName: originAddress.streetName,
          originCity: originAddress.city,
          originProvince: originAddress.province,
          originPostalCode: originAddress.postalCode,
          originCountry: originAddress.country,
          destinationStreetNumber: destinationAddress.streetNumber,
          destinationStreetName: destinationAddress.streetName,
          destinationCity: destinationAddress.city,
          destinationProvince: destinationAddress.province,
          destinationPostalCode: destinationAddress.postalCode,
          destinationCountry: destinationAddress.country,
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
    type: string,
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

  const handlePlaceChanged = (field: "origin" | "destination") => (): void => {
    const autocomplete =
      field === "origin" ? originAutocomplete : destinationAutocomplete;
    if (autocomplete) {
      const place: Place = autocomplete.getPlace();

      if (!place.formatted_address || !place.address_components) {
        formik.setFieldError(field, "Please select a complete address");
        return;
      }

      const addressComponents = extractAddressComponents(place);

      if (!addressComponents) {
        formik.setFieldError(
          field,
          "Please select a complete address with all required components",
        );
        return;
      }

      // Set the parsed address in state
      if (field === "origin") {
        setOriginAddress(addressComponents);
      } else {
        setDestinationAddress(addressComponents);
      }

      // Set the full address in the form field
      formik.setFieldValue(field, addressComponents.fullAddress);

      // Example of accessing individual components:
      console.log(`Selected ${field} address:`, {
        street: `${addressComponents.streetNumber} ${addressComponents.streetName}`,
        city: addressComponents.city,
        province: addressComponents.province,
        postalCode: addressComponents.postalCode,
        country: addressComponents.country,
      });
      console.log(originAddress);
      console.log(destinationAddress);
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
                  options={{ types: ["address"] as const }} // Type assertion for literal type
                >
                  <StyledTextField
                    fullWidth
                    id="origin"
                    name="origin"
                    label="Origin"
                    placeholder="Origin"
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
                  options={{ types: ["address"] as const }} // Type assertion for literal type
                >
                  <StyledTextField
                    fullWidth
                    id="destination"
                    name="destination"
                    label="Destination"
                    placeholder="Destination"
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
                            placeholder="Weight"
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
          transition={{ duration: 0.5 }}
        >
          {quoteData && <QuoteProposal {...quoteData} />}
        </motion.div>
      )}
    </Box>
  );
}
