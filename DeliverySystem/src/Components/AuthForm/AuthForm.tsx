import {
  Button,
  Grid2,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { StyledTextField } from "./../StyledTextField.tsx";
import { PageTitle } from "./../PageTitle.tsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
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
  signInSchema,
  createAccountSchema,
  isPasswordField,
} from "./constants";
import { AuthService } from "../../services";
import cloneDeep from "lodash/cloneDeep";
import {
  prepareCreateAccountValues,
  prepareSignInValues,
} from "./authFormUtils.ts";
import { useBodyBackground } from "../../Hooks/useBodyBackground.ts";
import "./authform.css";
import {
  useAuthentication,
  ROLE_ANY,
  ROLE_USER,
  ROLE_DRIVER,
  ROLE_ADMIN,
} from "../../Hooks/useAuthentication.ts";
import { USER_TYPE_ID } from "../../Hooks/constants.ts";

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
        },
  );

  const authContext = useAuthentication(ROLE_ANY);
  const { login } = authContext || {};

  const [authError, setAuthError] = useState<string>("");

  const { mutate } = useMutation(
    signInAuth ? AuthService.Login : AuthService.Register,
    {
      onSuccess: async (data) => {
        if (signInAuth && login) {
          login(data.accessToken, data.user);
        }
        if (signInAuth) {
          if (data.user[USER_TYPE_ID] === ROLE_USER) {
            navigate(`/user-dashboard/${data.user["id"]}`);
          } else if (data.user[USER_TYPE_ID] === ROLE_DRIVER) {
            navigate(`/driver-dashboard/${data.user["id"]}`);
          } else if (data.user[USER_TYPE_ID] === ROLE_ADMIN) {
            navigate(`/admin-dashboard/${data.user["id"]}`);
          }
        } else {
          navigate(`${HOME_PAGE_URL}?param=success`);
        }
      },
      onError: (error: any) => {
        setAuthError(error?.response?.data?.error || error?.code);
      },
    },
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
              ? {
                  ...prepareSignInValues(formValues as initialValuesSignIn),
                  firstName: "N/A",
                  lastName: "N/A",
                  userTypeId: ROLE_USER,
                  phoneNumber: "000-000-0000",
              }
              : {
                  ...prepareCreateAccountValues(formValues as initialValuesCreateAccount),
                  userTypeId: prepareCreateAccountValues(formValues as initialValuesCreateAccount).userTypeId ?? ROLE_USER, // Default to ROLE_USER if undefined
              };

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
  const vertical = "bottom";

  return (
    <Grid2 container direction="column" alignItems="center">
      <Snackbar
        open={!!authError}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={5000}
        onClose={() => setAuthError("")}
      >
        <Alert
          sx={{ height: "3rem", alignItems: "center", borderRadius: "50px" }}
          severity="error"
          variant="filled"
          onClose={() => setAuthError("")}
        >
          <Typography>{authError}</Typography>
        </Alert>
      </Snackbar>
      <PageTitle title={title} />
      <Card sx={{ width: "500px", borderRadius: "50px" }}>
        <CardContent sx={{ m: "25px", p: "0 !important" }}>
          {signInAuth ? (
            <Paper
              elevation={2}
              sx={{
                boxShadow: "none",
                border: "1px solid #D4D7DD",
                borderRadius: "50px",
                mb: "15px",
              }}
            >
              <Grid2
                pt={"10px"}
                pb={"10px"}
                container
                justifyContent={"center"}
                sx={{ boxShadow: "none" }}
              >
                <AccountBar
                  accountType={accountType}
                  setAccountType={setAccountType}
                  formik={formik}
                  signInAuth={signInAuth}
                />
              </Grid2>
            </Paper>
          ) : null}

          <Grid2>
            <form onSubmit={formik.handleSubmit}>
              {textFields.map((textField, index) => {
                const fieldName = textField.name as keyof (
                  | initialValuesCreateAccount
                  | initialValuesSignIn
                );
                return (
                  <StyledTextField
                    key={`${index}${title}`}
                    fullWidth
                    sx={{ mb: "15px" }}
                    name={textField.name}
                    label={textField.label}
                    placeholder={`${textField.label}`}
                    value={formik.values[fieldName]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      !!(formik.touched[fieldName] && formik.errors[fieldName])
                    }
                    type={isPasswordField(fieldName)}
                  />
                );
              })}
              <Grid2 container justifyContent={"center"}>
                <Button
                  disableRipple
                  onClick={(e) => {
                      e.preventDefault();
                      formik.handleSubmit();
                  }}
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: COLOR_MAIN,
                    borderRadius: "30px",
                    fontFamily: '"Montserrat", serif',
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: "medium",
                    height: "50px",
                    width: "225px",
                    boxShadow: "none",
                  }}
                >
                  {signInAuth
                    ? SIGN_IN_FORM_BUTTON
                    : CREATE_ACCOUNT_FORM_BUTTON}
                </Button>
                <Button
                  disableRipple
                  onClick={() => formik.resetForm()}
                  sx={{
                    color: COLOR_MAIN,
                    borderRadius: "30px",
                    fontFamily: '"Montserrat", serif',
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: "medium",
                    height: "50px",
                    width: "225px",
                    boxShadow: "none",
                  }}
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
