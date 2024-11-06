import {
  TextFieldsConfig,
  initialValuesCreateAccount,
  initialValuesSignIn,
} from "./types";
import * as Yup from "yup";
export const CANCEL_BUTTON: string = "Cancel";
export const FIELD_REQUIRED_MESSAGE: string = "Required";
export const INVALID_EMAIL_MESSAGE: string = "Invalid email";
export const INVALID_CONFIRM_PASSWORD_MESSAGE: string = "Passwords must match";
export const EMPTY_STRING: string = "";
export const CUSTOMER_ACCOUNT_TYPE: string = "customer";
export const DRIVER_ACCOUNT_TYPE: string = "driver";
export const SUCCESS_MESSAGE_REGISTER_ACCOUNT: string =
  "Your account has succesfully been registered!";
export const ERROR_MESSAGE: string = "An error has occured";

export const CREATE_ACCOUNT_FIELDS: Array<TextFieldsConfig> = [
  { label: "First name", name: "fName" },
  { label: "Last name", name: "lName" },
  { label: "Phone number", name: "phoneNumber" },
  { label: "Address", name: "address" },
  { label: "Enter email", name: "emailCreateAccount" },
  { label: "Enter password", name: "passwordCreateAccount" },
  { label: "Confirm password", name: "confirmPassword" },
];

export const SIGN_IN_FIELDS: Array<TextFieldsConfig> = [
  { label: "Enter email", name: "emailSignIn" },
  { label: "Enter password", name: "passwordSignIn" },
];

export const INITIAL_VALUES_CREATE_ACCOUNT: initialValuesCreateAccount = {
  fName: EMPTY_STRING,
  lName: EMPTY_STRING,
  phoneNumber: EMPTY_STRING,
  address: EMPTY_STRING,
  emailCreateAccount: EMPTY_STRING,
  passwordCreateAccount: EMPTY_STRING,
  confirmPassword: EMPTY_STRING,
  accountTypeCreateAccount: CUSTOMER_ACCOUNT_TYPE,
};

export const INITIAL_VALUES_SIGN_IN: initialValuesSignIn = {
  emailSignIn: EMPTY_STRING,
  passwordSignIn: EMPTY_STRING,
  accountTypeSignIn: CUSTOMER_ACCOUNT_TYPE,
};

export const signInSchema = Yup.object().shape({
  emailSignIn: Yup.string()
    .email(INVALID_EMAIL_MESSAGE)
    .required(FIELD_REQUIRED_MESSAGE),
  passwordSignIn: Yup.string().required(FIELD_REQUIRED_MESSAGE),
});

export const createAccountSchema = Yup.object().shape({
  fName: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  lName: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  phoneNumber: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  address: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  emailCreateAccount: Yup.string()
    .email(INVALID_EMAIL_MESSAGE)
    .required(FIELD_REQUIRED_MESSAGE),
  passwordCreateAccount: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  confirmPassword: Yup.string()
    .required(FIELD_REQUIRED_MESSAGE)
    .oneOf(
      [Yup.ref("passwordCreateAccount")],
      INVALID_CONFIRM_PASSWORD_MESSAGE
    ),
});

export const isPasswordField = (fieldName: string): "password" | "text" => {
  const passwordFields = [
    "passwordCreateAccount",
    "confirmPassword",
    "passwordSignIn",
  ];
  return passwordFields.includes(fieldName) ? "password" : "text";
};
