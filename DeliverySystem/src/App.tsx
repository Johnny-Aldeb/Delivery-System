import { Container, Grid2 } from "@mui/material";
import { Header } from "./components/Header/Header";
import { HomePage } from "./components/pages/HomePage/HomePage";
import Quote from "./Components/pages/Quote/Quote";
import { AuthForm } from "./components/AuthForm/AuthForm";
import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Track } from "./components/pages/HomePage/Track";
import { TrackPage } from "./components/pages/HomePage/TrackPage";
import {
  CREATE_ACCOUNT_FIELDS,
  SIGN_IN_FIELDS,
  INITIAL_VALUES_CREATE_ACCOUNT,
  INITIAL_VALUES_SIGN_IN,
} from "./Components/AuthForm/constants";
import {
  HOME_PAGE_URL,
  SIGN_IN_URL,
  CREATE_ACCOUNT_URL,
  CREATE_ACCOUNT_FORM_TITLE,
  SIGN_IN_FORM_TITLE,
  INVALID_ACCESS_URL,
  USER_DASHBOARD_URL,
  DRIVER_DASHBOARD_URL,
  ADMIN_DASHBOARD_URL,
  QUOTE_URL,
} from "./constants";
import "./app.css";

import "react-chatbot-kit/build/main.css";
import config from "./components/Chatbot/config.js";
import MessageParser from "./components/Chatbot/MessageParser.jsx";
import ActionProvider from "./components/Chatbot/ActionProvider.jsx";
import { TestLogInPage } from "Components/pages/TestLogInPage.js";
import { InvalidAccessPage } from "Components/pages/InvalidAccesPage.js";
import { UserDashboard } from "Components/pages/UserDashboard/UserDashboard.js";
import { DriverDashboard } from "Components/pages/DriverDashboard/DriverDashboard.js";
import { AdminDashboard } from "Components/pages/AdminDashboard/AdminDashboard.js";
import ChatBotContainer from './components/Chatbot/ChatBotContainer'; 

function App() {
  const location = useLocation();
  const [signInAuth, setSignInAuth] = useState<boolean>(
    location.pathname === SIGN_IN_URL
  );

  return (
    <Container maxWidth="xl">
      <Header setSignInAuth={setSignInAuth} signInAuth={signInAuth} />
      <Grid2>
        <ChatBotContainer />

        <Routes>
          <Route path={HOME_PAGE_URL} element={<HomePage />} />
          <Route
            path={SIGN_IN_URL}
            element={
              <AuthForm
                title={SIGN_IN_FORM_TITLE}
                textFields={SIGN_IN_FIELDS}
                initialValues={INITIAL_VALUES_SIGN_IN}
                signInAuth={signInAuth}
              />
            }
          />
          <Route
            path={CREATE_ACCOUNT_URL}
            element={
              <AuthForm
                title={CREATE_ACCOUNT_FORM_TITLE}
                textFields={CREATE_ACCOUNT_FIELDS}
                initialValues={INITIAL_VALUES_CREATE_ACCOUNT}
                signInAuth={signInAuth}
              />
            }
          />
          <Route path={QUOTE_URL} element={<Quote />} />
          <Route path="/Track/:trackingNumber" element={<Track />} />
          <Route path="/Track" element={<TrackPage />} />
          <Route path={INVALID_ACCESS_URL} element={<InvalidAccessPage />} />
          <Route path={USER_DASHBOARD_URL} element={<UserDashboard />} />
          <Route path={DRIVER_DASHBOARD_URL} element={<DriverDashboard />} />
          <Route path={ADMIN_DASHBOARD_URL} element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to={HOME_PAGE_URL} replace />} />
        </Routes>
      </Grid2>
    </Container>
  );
}
export default App;
