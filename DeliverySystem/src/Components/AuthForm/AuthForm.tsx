import {
  Button,
  Grid2,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AccountBar } from "./AccountBar/AccountBar";
import {
  TextFieldsConfig,
  initialValuesCreateAccount,
  initialValuesSignIn,
} from "./types";
import {
  COLOR_MAIN,
  CREATE_ACCOUNT_FORM_BUTTON,
  HOME_PAGE_URL,
  IMAGE2,
  IMAGE1,
  SIGN_IN_FORM_BUTTON,
  BACKGROUND_BOTTOM,
  BACKGROUND_LEFT,
} from "../../constants";
import {
  CANCEL_BUTTON,
  EMPTY_STRING,
  signInSchema,
  createAccountSchema,
  isPasswordField,
} from "./constants";
import { AuthService } from "../../services/AuthService";
import cloneDeep from "lodash/cloneDeep";
import {
  prepareCreateAccountValues,
  prepareSignInValues,
} from "./authFormUtils.ts";
import { useBodyBackground } from "../../Hooks/useBodyBackground.ts";
import "./authform.css";
import { useAuthentication } from "../../Hooks/useAuthentication.ts";

export const AuthForm = ({
  title,
  textFields,
  initialValues,
  signInAuth,
}: {
  title: string;
  textFields: Array<TextFieldsConfig>;
  initialValues: initialValuesCreateAccount | initialValuesSignIn;
  signInAuth: boolean;
}) => {
  const navigate = useNavigate();
  useBodyBackground(
    signInAuth
      ? {
          backgroundImage: IMAGE2,
          backgroundPosition: BACKGROUND_BOTTOM,
          backgroundSize: "cover",
        }
      : {
          backgroundImage: IMAGE1,
          backgroundPosition: `${BACKGROUND_LEFT} ${BACKGROUND_BOTTOM}`,
          backgroundSize: "cover",
        }
  );

  const authContext = useAuthentication(true);
  const { login } = authContext || {};

  const [authError, setAuthError] = useState<string>("");

  const { mutate } = useMutation(
    signInAuth ? AuthService.Login : AuthService.Register,
    {
      onSuccess: (data) => {
        if (signInAuth && login) {
          login(data.accessToken);
        }
        navigate(`${HOME_PAGE_URL}${signInAuth ? "" : "?param=success"}`);
      },
      onError: (error: any) => {
        setAuthError(error?.response?.data?.error);
      },
    }
  );

  const [accountType, setAccountType] = useState<string>("customer");
  const formik = useFormik({
    initialValues: signInAuth
      ? (initialValues as initialValuesSignIn)
      : (initialValues as initialValuesCreateAccount),
    validationSchema: signInAuth ? signInSchema : createAccountSchema,
    onSubmit: (values) => {
      const formValues = cloneDeep(values);
      const preparedValues = signInAuth
        ? prepareSignInValues(formValues)
        : prepareCreateAccountValues(formValues);
      mutate(preparedValues);
    },
  });

  useEffect(() => {
    formik.resetForm({
      values: signInAuth
        ? (initialValues as initialValuesSignIn)
        : (initialValues as initialValuesCreateAccount),
    });
  }, [initialValues, signInAuth]);

  const horizontal = "right";
  const vertical = "top";

  return (
    <Grid2
      mt={1}
      pt={5}
      container
      direction="column"
      alignItems="center"
      spacing={3}
    >
      <Snackbar
        open={!!authError}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={5000}
        onClose={() => setAuthError("")}
      >
        <Alert
          sx={{ height: "3rem", alignItems: "center" }}
          severity="error"
          variant="filled"
          onClose={() => setAuthError("")}
        >
          <Typography>{authError}</Typography>
        </Alert>
      </Snackbar>
      <Typography variant="h4" textAlign={"center"} color={"white"}>
        {title}
      </Typography>
      <Card sx={{ p: 2, maxWidth: "22rem", borderRadius: 14 }}>
        <CardContent>
          {signInAuth ? (
            <Paper elevation={2}>
              <Grid2 pt={1} pb={1} mb={2} container justifyContent={"center"}>
                <AccountBar
                  accountType={accountType}
                  setAccountType={setAccountType}
                  formik={formik}
                  signInAuth={signInAuth}
                />
              </Grid2>
            </Paper>
          ) : null}

          <Grid2 size={12}>
            <form onSubmit={formik.handleSubmit}>
              {textFields.map((textField, index) => {
                const fieldName = textField.name as keyof (
                  | initialValuesCreateAccount
                  | initialValuesSignIn
                );
                return (
                  <TextField
                    key={`${index}${title}`}
                    fullWidth
                    size={"small"}
                    sx={{ mb: 2 }}
                    name={textField.name}
                    label={textField.label}
                    value={formik.values[fieldName]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      !!(formik.touched[fieldName] && formik.errors[fieldName])
                    }
                    helperText={
                      formik.touched[fieldName]
                        ? formik.errors[fieldName]
                        : EMPTY_STRING
                    }
                    type={isPasswordField(fieldName)}
                  />
                );
              })}
              <Grid2 container justifyContent={"center"}>
                <Button
                  onClick={formik.handleSubmit}
                  type="submit"
                  variant="contained"
                  sx={{ mr: 2, backgroundColor: COLOR_MAIN }}
                >
                  {signInAuth
                    ? SIGN_IN_FORM_BUTTON
                    : CREATE_ACCOUNT_FORM_BUTTON}
                </Button>
                <Button
                  onClick={() => formik.resetForm()}
                  sx={{ color: COLOR_MAIN }}
                >
                  {CANCEL_BUTTON}
                </Button>
              </Grid2>
            </form>
          </Grid2>
        </CardContent>
      </Card>
    </Grid2>
  );
};
