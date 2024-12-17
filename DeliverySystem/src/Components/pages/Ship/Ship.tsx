import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  styled,
} from "@mui/material";
import { useBodyBackground } from "../../../Hooks/useBodyBackground.ts";
import {
  BACKGROUND_BOTTOM,
  BACKGROUND_RIGHT,
  IMAGE4,
} from "../../../constants.ts";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PageTitle } from "../../PageTitle.tsx";
import { StyledTextField } from "../../StyledTextField.tsx";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ROLE_USER,
  useAuthentication,
} from "../../../Hooks/useAuthentication.ts";

const Price = styled(Typography)(() => ({
  fontFamily: '"Inter", serif',
  fontSize: "16px",
  color: "#848D9D",
  textAlign: "right",
}));

interface FormValues {
  senderFirstName: string;
  senderLastName: string;
  senderAddress: string;
  senderApartment: string;
  senderCity: string;
  senderState: string;
  senderPostalCode: string;
  senderCountry: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientAddress: string;
  recipientApartment: string;
  recipientCity: string;
  recipientState: string;
  recipientPostalCode: string;
  recipientCountry: string;
}

interface ShipmentData {
  productName: string;
  totalPrice: number;
  tax: number;
  totalWithTax: number;
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
  type: string;
  subtype: string;
  weight: number;
  distance: number;
}

const validationSchema = Yup.object({
  senderFirstName: Yup.string().required("First name is required"),
  senderLastName: Yup.string().required("Last name is required"),
  senderAddress: Yup.string().required("Address is required"),
  senderApartment: Yup.string().optional(),
  senderCity: Yup.string().required("City is required"),
  senderState: Yup.string().required("State is required"),
  senderPostalCode: Yup.string().required("Postal Code is required"),
  senderCountry: Yup.string().required("Country is required"),

  recipientFirstName: Yup.string().required("First name is required"),
  recipientLastName: Yup.string().required("Last name is required"),
  recipientAddress: Yup.string().required("Address is required"),
  recipientApartment: Yup.string().optional(),
  recipientCity: Yup.string().required("City is required"),
  recipientState: Yup.string().required("State is required"),
  recipientPostalCode: Yup.string().required("Postal Code is required"),
  recipientCountry: Yup.string().required("Country is required"),
});

export default function Ship() {
  const user = useAuthentication(ROLE_USER);

  const [step, setStep] = useState("sender");
  const [shipmentData, setShipmentData] = useState<ShipmentData>({
    productName: "",
    totalPrice: 0,
    tax: 0,
    totalWithTax: 0,
    originStreetNumber: "",
    originStreetName: "",
    originCity: "",
    originProvince: "",
    originPostalCode: "",
    originCountry: "",
    destinationStreetNumber: "",
    destinationStreetName: "",
    destinationCity: "",
    destinationProvince: "",
    destinationPostalCode: "",
    destinationCountry: "",
    type: "",
    subtype: "",
    weight: 0,
    distance: 0,
  });
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientFirstName, setRecipientFirstName] = useState("");
  const [recipientLastName, setRecipientLastName] = useState("");

  const originAddress = `${shipmentData.originStreetNumber} ${shipmentData.originStreetName}`;
  const destinationAddress = `${shipmentData.destinationStreetNumber} ${shipmentData.destinationStreetName}`;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setShipmentData(location.state as ShipmentData);
    } else {
      // If there's no state, redirect back to the quote page
      navigate("/quote");
    }
  }, [location, navigate]);

  useBodyBackground({
    backgroundImage: IMAGE4,
    backgroundPosition: `${BACKGROUND_RIGHT} ${BACKGROUND_BOTTOM}`,
    backgroundSize: "cover",
  });

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const address = `${formData.get("senderApartment") ? formData.get("senderApartment") + "-" : ""}${shipmentData.originStreetNumber} ${shipmentData.originStreetName}, ${shipmentData.originCity}, ${shipmentData.originProvince} ${shipmentData.originPostalCode}, ${shipmentData.originCountry}`;

    setSenderAddress(address);
    setStep("recipient");

    console.log({
      senderAddress: address,
      recipientAddress,
      recipientFirstName,
      recipientLastName,
      ...shipmentData,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const address = `${formData.get("recipientApartment") ? formData.get("recipientApartment") + "-" : ""}${shipmentData.destinationStreetNumber} ${shipmentData.destinationStreetName}, ${shipmentData.destinationCity}, ${shipmentData.destinationProvince} ${shipmentData.destinationPostalCode}, ${shipmentData.destinationCountry}`;
    const firstName = formData.get("recipientFirstName") as string;
    const lastName = formData.get("recipientLastName") as string;

    setRecipientAddress(address);
    setRecipientFirstName(firstName);
    setRecipientLastName(lastName);

    try {
      const shipmentPayload = {
        weight: shipmentData.weight,
        recipientFirstName: firstName,
        recipientLastName: lastName,
        senderAddress,
        recipientAddress: address,
      };

      sessionStorage.setItem(
          "shipmentPayload",
          JSON.stringify(shipmentPayload),
      );

      const token = user?.authToken;
      if (!token) {
        console.error("Authentication token is missing");
        navigate("/login", { state: { from: location.pathname } });
        return;
      }

      const response = await axios.post(
          "http://localhost:3001/api/payment/checkout",
          {
            amount: Math.round(shipmentData.totalWithTax * 100),
            userEmail: user?.userInfo?.email,
            productName: shipmentData.productName || "Shipment",
            userId: user.userInfo?.id,
          },
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          },
      );

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      senderFirstName: "",
      senderLastName: "",
      senderAddress: "",
      senderApartment: "",
      senderCity: "",
      senderState: "",
      senderPostalCode: "",
      senderCountry: "",
      recipientFirstName: "",
      recipientLastName: "",
      recipientAddress: "",
      recipientApartment: "",
      recipientCity: "",
      recipientState: "",
      recipientPostalCode: "",
      recipientCountry: "",
    },
    validationSchema,
    onSubmit: async (_, { setSubmitting }) => {
      setSubmitting(true);

      const eventMock = {
        preventDefault: () => {}, // Mock preventDefault to avoid errors
        target: document.querySelector("form") as HTMLFormElement, // Mock the form target
      } as unknown as React.FormEvent<HTMLFormElement>;

      if (step === "sender") {
        handleNext(eventMock);
      } else {
        await handleSubmit(eventMock);
      }

      setSubmitting(false);
    },
  });

  const renderFormFields = () => {
    const fields = [
      { id: "FirstName", label: "First Name" },
      { id: "LastName", label: "Last Name" },
      { id: "Address", label: "Address" },
      { id: "Apartment", label: "Apartment, suite, etc. (optional)" },
      { id: "City", label: "City" },
      { id: "State", label: "State" },
      { id: "PostalCode", label: "Postal Code" },
      { id: "Country", label: "Country" },
    ];

    return (
      <>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "14px" }}
        >
          <StyledTextField
            key={`${step}${fields[0].id}`}
            fullWidth
            id={`${step}${fields[0].id}`}
            name={`${step}${fields[0].id}`}
            label={step === "sender" ? "" : fields[0].label}
            placeholder={fields[0].label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              step === "sender"
                ? formik.touched.senderFirstName &&
                  !!formik.errors.senderFirstName
                : formik.touched.recipientFirstName &&
                  !!formik.errors.recipientFirstName
            }
          />
          <StyledTextField
            key={`${step}${fields[1].id}`}
            fullWidth
            id={`${step}${fields[1].id}`}
            name={`${step}${fields[1].id}`}
            label={step === "sender" ? "" : fields[1].label}
            placeholder={fields[1].label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              step === "sender"
                ? formik.touched.senderLastName &&
                  !!formik.errors.senderLastName
                : formik.touched.recipientLastName &&
                  !!formik.errors.recipientLastName
            }
          />
        </Box>
        <StyledTextField
          key={`${step}${fields[2].id}`}
          fullWidth
          id={`${step}${fields[2].id}`}
          name={`${step}${fields[2].id}`}
          value={step === "sender" ? originAddress : destinationAddress}
          slotProps={{
            input: { readOnly: true },
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            step === "sender"
              ? formik.touched.senderAddress && !!formik.errors.senderAddress
              : formik.touched.recipientAddress &&
                !!formik.errors.recipientAddress
          }
        />
        <StyledTextField
          key={`${step}${fields[3].id}`}
          fullWidth
          id={`${step}${fields[3].id}`}
          name={`${step}${fields[3].id}`}
          label={fields[3].label}
          placeholder={fields[3].label}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            step === "sender"
              ? formik.touched.senderApartment &&
                !!formik.errors.senderApartment
              : formik.touched.recipientApartment &&
                !!formik.errors.recipientApartment
          }
        />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "14px" }}
        >
          <StyledTextField
            key={`${step}${fields[4].id}`}
            fullWidth
            id={`${step}${fields[4].id}`}
            name={`${step}${fields[4].id}`}
            value={
              step === "sender"
                ? shipmentData.originCity
                : shipmentData.destinationCity
            }
            slotProps={{
              input: { readOnly: true },
            }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              step === "sender"
                ? formik.touched.senderCity && !!formik.errors.senderCity
                : formik.touched.recipientCity && !!formik.errors.recipientCity
            }
          />
          <StyledTextField
            key={`${step}${fields[5].id}`}
            fullWidth
            id={`${step}${fields[5].id}`}
            name={`${step}${fields[5].id}`}
            value={
              step === "sender"
                ? shipmentData.originProvince
                : shipmentData.destinationProvince
            }
            slotProps={{
              input: { readOnly: true },
            }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              step === "sender"
                ? formik.touched.senderState && !!formik.errors.senderState
                : formik.touched.recipientState &&
                  !!formik.errors.recipientState
            }
          />
          <StyledTextField
            key={`${step}${fields[6].id}`}
            fullWidth
            id={`${step}${fields[6].id}`}
            name={`${step}${fields[6].id}`}
            value={
              step === "sender"
                ? shipmentData.originPostalCode
                : shipmentData.destinationPostalCode
            }
            slotProps={{
              input: { readOnly: true },
            }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              step === "sender"
                ? formik.touched.senderPostalCode &&
                  !!formik.errors.senderPostalCode
                : formik.touched.recipientPostalCode &&
                  !!formik.errors.recipientPostalCode
            }
          />
        </Box>
        <StyledTextField
          key={`${step}${fields[7].id}`}
          fullWidth
          id={`${step}${fields[7].id}`}
          name={`${step}${fields[7].id}`}
          value={
            step === "sender"
              ? shipmentData.originCountry
              : shipmentData.destinationCountry
          }
          slotProps={{
            input: { readOnly: true },
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            step === "sender"
              ? formik.touched.senderCountry && !!formik.errors.senderCountry
              : formik.touched.recipientCountry &&
                !!formik.errors.recipientCountry
          }
        />
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          width: "fit-content",
          display: "flex",
          mx: "auto",
          justifyContent: "space-between",
          gap: "40px",
        }}
      >
        <Box>
          <PageTitle title={"Create a Shipment"} />
          <Card
            sx={{ width: "700px", mx: "auto", borderRadius: "50px", p: "0" }}
          >
            <CardContent sx={{ m: "25px", p: "0 !important" }}>
              <Typography
                sx={{
                  ml: "20px",
                  mb: "12px",
                  fontFamily: '"Montserrat", serif',
                  fontSize: "18px",
                  fontWeight: "medium",
                  color: "#071528",
                }}
              >
                {step === "sender" ? "Ship From:" : "Ship To:"}
              </Typography>
              <form onSubmit={step === "sender" ? handleNext : handleSubmit}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "14px" }}
                >
                  {renderFormFields()}
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
                    {step === "sender" ? "Next" : "Pay"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Box sx={{ height: "104px" }}></Box>
          <Card
            sx={{ width: "280px", mx: "auto", borderRadius: "50px", p: "0" }}
          >
            <CardContent sx={{ m: "25px", p: "0 !important" }}>
              <Box
                sx={{
                  p: "15px",
                  mb: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", serif',
                      fontSize: "16px",
                      fontWeight: "medium",
                      color: "#071528",
                    }}
                  >
                    Shipment
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", serif',
                      fontSize: "16px",
                      fontWeight: "medium",
                      color: "#071528",
                    }}
                  >
                    Tax
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", serif',
                      fontSize: "16px",
                      fontWeight: "medium",
                      color: "#071528",
                    }}
                  >
                    Total
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Price>${shipmentData.totalPrice.toFixed(2)}</Price>
                  <Price>${shipmentData.tax.toFixed(2)}</Price>
                  <Price>${shipmentData.totalWithTax.toFixed(2)}</Price>
                </Box>
              </Box>
              <StyledTextField
                fullWidth
                id="promocode"
                name="promocode"
                label="Promo Code"
                placeholder="Promo Code"
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}
