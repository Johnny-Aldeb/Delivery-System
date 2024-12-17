import { PageTitle } from "../../PageTitle.tsx";
import { useBodyBackground } from "../../../Hooks/useBodyBackground.ts";
import { BACKGROUND_BOTTOM, IMAGE2 } from "../../../constants.ts";
import ChatBotContainer from "../../Chatbot/ChatBotContainer.jsx";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import { Link } from "@mui/material";

export default function Help() {
  useBodyBackground({
    backgroundImage: IMAGE2,
    backgroundPosition: BACKGROUND_BOTTOM,
    backgroundSize: "cover",
  });

  return (
    <>
      <PageTitle title="FAQ" />
      <ChatBotContainer />
      <Card
        sx={{
          height: "350px",
          width: "800px",
          backgroundColor: "white",
          mx: "auto",
          borderRadius: "50px",
          overflowY: "auto",
        }}
      >
        <CardContent sx={{ margin: "25px", p: "0 !important" }}>
          <Accordion
            sx={{
              boxShadow: "none",
              color: "black",
              border: "1px solid rgba(0, 0, 0, .125)",
              borderRadius: "35px",
              marginBottom: "10px",
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
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                pl: "30px",
                height: "50px",
              }}
            >
              What is Parceler?
            </AccordionSummary>
            <AccordionDetails
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                lineHeight: "25px",
                pl: "30px",
                pr: "30px",
                pb: "30px",
              }}
            >
              Parceler is a delivery service platform developed by our team,
              DEVengers as a university project for SOEN 343 to demonstrate our
              skills in software architecture and design. Parceler includes
              features such as shipping quotations, package tracking, payment
              processing, and chatbot assistance.
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              boxShadow: "none",
              color: "black",
              border: "1px solid rgba(0, 0, 0, .125)",
              borderRadius: "35px",
              marginBottom: "10px",
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
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                pl: "30px",
                height: "50px",
              }}
            >
              How does Parceler work?
            </AccordionSummary>
            <AccordionDetails
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                lineHeight: "25px",
                pl: "30px",
                pr: "30px",
                pb: "30px",
              }}
            >
              Parceler enables users to request delivery services by providing
              shipment details like destination, weight, and package type. The
              system generates a quote, and upon payment, sends an email with a
              QR code for package drop-off. Users can track their shipments in
              real time on the tracking page.
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              boxShadow: "none",
              color: "black",
              border: "1px solid rgba(0, 0, 0, .125)",
              borderRadius: "35px",
              marginBottom: "10px",
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
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                pl: "30px",
                height: "50px",
              }}
            >
              Is Parceler a real delivery service?
            </AccordionSummary>
            <AccordionDetails
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                lineHeight: "25px",
                pl: "30px",
                pr: "30px",
                pb: "30px",
              }}
            >
              No, Parceler is not a real delivery service. It is a prototype
              developed for academic purposes to demonstrate software
              development, database management, and user interface design
              skills. Parceler is intended only as an example project and is not
              used for actual deliveries.
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              boxShadow: "none",
              color: "black",
              border: "1px solid rgba(0, 0, 0, .125)",
              borderRadius: "35px",
              marginBottom: "10px",
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
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                pl: "30px",
                height: "50px",
              }}
            >
              What technologies are used to build Parceler?
            </AccordionSummary>
            <AccordionDetails
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                lineHeight: "25px",
                pl: "30px",
                pr: "30px",
                pb: "30px",
              }}
            >
              Parceler is built using modern web development technologies,
              including React with TypeScript for frontend, and Node.js with
              Express for the backend API. PostgreSQL serves as the database,
              managed and initialized using Docker for a consistent environment.
              The user interface is designed using Figma and built with
              Material-UI (MUI), and Framer Motion for animations. Parceler also
              integrates APIs such as Google Maps for address autocomplete and
              Stripe for payment processing.
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              boxShadow: "none",
              color: "black",
              border: "1px solid rgba(0, 0, 0, .125)",
              borderRadius: "35px",
              marginBottom: "10px",
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
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                pl: "30px",
                height: "50px",
              }}
            >
              Who is behind Parceler?
            </AccordionSummary>
            <AccordionDetails
              sx={{
                fontFamily: '"Montserrat", serif',
                fontWeight: "medium",
                lineHeight: "25px",
                pl: "30px",
                pr: "30px",
                pb: "30px",
              }}
            >
              Parceler was developed by the DEVengers, a team of dedicated
              students collaborating on a university project for a Software
              Architecture and Design course. The team includes{" "}
                <Link href="https://github.com/mavmoud" underline="none">
                    {"Mahmoud"}
                </Link>
                ,{" "}
                <Link href="https://github.com/F4KER-X" underline="none">
                    {"Danny"}
                </Link>
                ,{" "}
                <Link href="https://github.com/GianlucaGirardi" underline="none">
                    {"Luca"}
                </Link>
                ,{" "}
                <Link href="https://github.com/Johnny-Aldeb" underline="none">
                    {"Johnny"}
                </Link>
                , and{" "}
                <Link href="https://github.com/AsimRahman88" underline="none">
                    {"Asim"}
                </Link>
                , who each brought unique skills to the project, contributing to
                areas such as frontend development, backend design, and overall
                system architecture.
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
