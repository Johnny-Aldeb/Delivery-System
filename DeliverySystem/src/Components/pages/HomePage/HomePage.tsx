import { Grid2, Snackbar, Alert, Typography } from "@mui/material";
import { useBodyBackground } from "../../../Hooks/useBodyBackground.ts";
import { BACKGROUND_RIGHT, IMAGE3 } from "../../../constants.ts";
import { motion, AnimatePresence } from "framer-motion"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Truck, PackageSearch } from 'lucide-react';
import { useState, useCallback } from "react";
import { Formik, FormikErrors } from "formik";
import { useNavigate } from "react-router-dom";
import { OrderService } from "../../../services/OrderService";
import { useLocation } from "react-router-dom";
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { SUCCESS_MESSAGE_REGISTER_ACCOUNT } from "Components/AuthForm/constants.ts";
import {
    useAuthentication,
    ROLE_ANY,
} from "../../../Hooks/useAuthentication.ts";
import { StyledTextField } from "../../StyledTextField.tsx";

interface FormValues {
    trackingNumber: string;
}

interface QuoteFormValues {
    origin: string;
    destination: string;
}

export const HomePage = () => {
    useBodyBackground({
        backgroundImage: IMAGE3,
        backgroundPosition: BACKGROUND_RIGHT,
        backgroundSize: "cover",
    });
    const authContext = useAuthentication(ROLE_ANY);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const param = queryParams.get("param");
    const [successBar, setSuccessBar] = useState(!!param);

    const [isQuoteDisplay, setIsQuoteDisplay] = useState(false);
    const navigate = useNavigate();

    const handleQuoteClick = () => {
        setIsQuoteDisplay(true);
    };

    const handleTrackClick = () => {
        setIsQuoteDisplay(false);
    };
    const vertical = "bottom";
    const horizontal = "right";

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Grid2 ml={'120px'} mt={'170px'}>
            <Snackbar
                open={successBar}
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={3000}
                onClose={() => setSuccessBar(false)}
            >
                <Alert
                    sx={{ height: "3rem", alignItems: "center" }}
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccessBar(false)}
                >
                    <Typography>{SUCCESS_MESSAGE_REGISTER_ACCOUNT}</Typography>
                </Alert>
            </Snackbar>
            <p style={{ fontFamily: '"Montserrat", serif', fontWeight: '600', marginLeft: "35px", color: "white", fontSize: "36px" }}>
                Global Reach,
                <br />
                Reliable Deliveries.
            </p>
            <AnimatePresence mode="wait">
                {isQuoteDisplay ? (
                    <motion.div
                        key="quote"
                    >
                        <QuoteDisplay handleTrackClick={handleTrackClick} navigate={navigate} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="track"
                    >
                        <TrackDisplay handleQuoteClick={handleQuoteClick} navigate={navigate} />
                    </motion.div>
                )}
            </AnimatePresence>
        </Grid2>
    );
};

const TrackDisplay = ({
                          handleQuoteClick,
                          navigate,
                      }: {
    handleQuoteClick: () => void;
    navigate: any;
}) => {
    const [submitError, setSubmitError] = useState<string | null>(null);

    return (
        <Grid2>
            <Card sx={{ width: '500px', borderRadius: '50px' }}>
                <CardContent sx={{ p: '0 !important', m: '25px' }}>
                    <Grid2 >
                        <Card sx={{ width: '450px', boxShadow: 'none', border: '1px solid #D4D7DD', borderRadius: '50px', mb: '15px', mx: 'auto'}}>
                            <CardContent sx={{ p: '0 !important'}}>
                                <ButtonGroup
                                    variant="outlined"
                                    aria-label="Basic button group"
                                    sx={{ width: "fit-content", height: '48px', m: '10px', gap: '1px' }}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: "215px",
                                            borderRadius: '50px !important',
                                            backgroundColor: "#071528",
                                            color: "white",
                                        }}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", fontFamily: '"Montserrat", serif', textTransform: 'none', fontSize: '16px', fontWeight: 'medium' }}>
                                          <PackageSearch size={24} style={{ marginRight: "10px" }} />
                                          Track
                                        </span>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: "215px",
                                            color: "black",
                                            backgroundColor: 'white',
                                            borderRadius: '50px !important',
                                            "&:hover": {
                                                boxShadow: 'none',
                                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            },
                                        }}
                                        onClick={handleQuoteClick}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", fontFamily: '"Montserrat", serif', textTransform: 'none', fontSize: '16px', fontWeight: 'medium' }}>
                                          <Truck size={24} style={{ marginRight: "10px" }} />
                                          Quote
                                        </span>
                                    </Button>
                                </ButtonGroup>
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Formik
                        initialValues={{trackingNumber: ""}}
                        onSubmit={async (values: FormValues, {setSubmitting}) => {
                            setSubmitError(null);
                            setSubmitting(true);
                            try {
                                const orderData = await OrderService.GetOrderByTrackingNumber(
                                    values.trackingNumber
                                );
                                if (
                                    orderData?.order?.trackingNumber === values.trackingNumber
                                ) {
                                    navigate(`/Track/${values.trackingNumber}`);
                                } else {
                                    setSubmitError("Invalid tracking number");
                                }
                            } catch (error) {
                                console.error("Error tracking the order:", error);
                                setSubmitError("Invalid tracking number");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                        validate={(values: FormValues) => {
                            const errors: FormikErrors<FormValues> = {};
                            if (!values.trackingNumber) {
                                errors.trackingNumber = "Required";
                            }
                            return errors;
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <Grid2>
                                    <div>
                                        <StyledTextField
                                            id="trackingNumber"
                                            label="Tracking Number"
                                            variant="outlined"
                                            name="trackingNumber"
                                            placeholder="Tracking Number"
                                            value={formik.values.trackingNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            sx={{width: '450px'}}
                                            error={
                                                Boolean(formik.errors.trackingNumber) &&
                                                formik.touched.trackingNumber
                                            }
                                        />
                                    </div>
                                </Grid2>
                                {submitError && (
                                    <Typography color="red" mt={1}>
                                        {submitError}
                                    </Typography>
                                )}
                                <Grid2 mt={'15px'}>
                                    <Button
                                        disableRipple
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            width: '450px',
                                            borderRadius: '30px',
                                            backgroundColor: "#071528",
                                            fontFamily: '"Montserrat", serif',
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            fontWeight: 'medium',
                                            height: '50px',
                                            boxShadow: 'none'
                                        }}
                                        disabled={formik.isSubmitting}
                                    >
                                        Track Package
                                    </Button>
                                </Grid2>
                            </form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </Grid2>
    );
};

const QuoteDisplay = ({
                          handleTrackClick,
                          navigate,
                      }: {
    handleTrackClick: () => void;
    navigate: any;
}) => {
    const [originAutocomplete, setOriginAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [destinationAutocomplete, setDestinationAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    const onOriginLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
        setOriginAutocomplete(autocomplete);
    }, []);

    const onDestinationLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
        setDestinationAutocomplete(autocomplete);
    }, []);

    const handlePlaceChanged = (field: 'origin' | 'destination', setFieldValue: (field: string, value: any) => void) => () => {
        const autocomplete = field === 'origin' ? originAutocomplete : destinationAutocomplete;
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setFieldValue(field, place.formatted_address);
            }
        }
    };

    return (
        <Grid2>
            <Card sx={{width: '500px', borderRadius: '50px'}}>
                <CardContent sx={{p: '0 !important', m: '25px' }}>
                    <Grid2>
                        <Card sx={{ width: '450px', boxShadow: 'none', border: '1px solid #D4D7DD', borderRadius: '50px', mb: '15px', mx: 'auto'}}>
                            <CardContent sx={{ p: '0 !important'}}>
                                <ButtonGroup
                                    variant="outlined"
                                    aria-label="Basic button group"
                                    sx={{ width: "fit-content", height: '48px', m: '10px', gap: '1px' }}
                                >
                                    <Button
                                        disableRipple
                                        variant="contained"
                                        sx={{
                                            width: "215px",
                                            color: "black",
                                            borderRadius: '50px !important',
                                            backgroundColor: "white",
                                            "&:hover": {
                                                boxShadow: 'none',
                                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            },
                                        }}
                                        onClick={handleTrackClick}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", fontFamily: '"Montserrat", serif', textTransform: 'none', fontSize: '16px', fontWeight: 'medium' }}>
                                          <PackageSearch size={24} style={{ marginRight: "10px" }} />
                                          Track
                                        </span>
                                    </Button>
                                    <Button
                                        disableRipple
                                        variant="contained"
                                        sx={{
                                            width: '215px',
                                            backgroundColor: "#071528",
                                            borderRadius: '50px !important',
                                            color: "white",
                                        }}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", fontFamily: '"Montserrat", serif', textTransform: 'none', fontSize: '16px', fontWeight: 'medium' }}>
                                          <Truck size={24} style={{ marginRight: "10px" }} />
                                          Quote
                                        </span>
                                    </Button>
                                </ButtonGroup>
                            </CardContent>
                        </Card>
                    </Grid2>

                    <Formik
                        initialValues={{
                            origin: "",
                            destination: "",
                        }}
                        onSubmit={(values: QuoteFormValues) => {
                            navigate('/quote', { state: { origin: values.origin, destination: values.destination } });
                        }}
                    >
                        {({ values, setFieldValue, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid2>
                                    <Autocomplete onLoad={onOriginLoad} onPlaceChanged={handlePlaceChanged('origin', setFieldValue)}>
                                        <StyledTextField
                                            id="origin"
                                            label="Origin"
                                            placeholder="Origin"
                                            variant="outlined"
                                            value={values.origin}
                                            onChange={(e) => setFieldValue('origin', e.target.value)}
                                            sx={{width: '450px'}}
                                        />
                                    </Autocomplete>
                                </Grid2>
                                <motion.div
                                    key="destination"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ overflow: "hidden" }}
                                >
                                    <Grid2 mt={'15px'}>
                                        <Autocomplete onLoad={onDestinationLoad} onPlaceChanged={handlePlaceChanged('destination', setFieldValue)}>
                                            <StyledTextField
                                                id="destination"
                                                label="Destination"
                                                placeholder="Destination"
                                                variant="outlined"
                                                value={values.destination}
                                                onChange={(e) => setFieldValue('destination', e.target.value)}
                                                sx={{ width: '450px' }}
                                            />
                                        </Autocomplete>
                                    </Grid2>
                                </motion.div>
                                <Grid2 mt={'15px'}>
                                    <Button
                                        disableRipple
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            width: '450px',
                                            borderRadius: '30px',
                                            backgroundColor: "#071528",
                                            fontFamily: '"Montserrat", serif',
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            fontWeight: 'medium',
                                            height: '50px',
                                            boxShadow: 'none'
                                        }}
                                    >
                                        Get Quote
                                    </Button>
                                </Grid2>
                            </form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </Grid2>
    );
};