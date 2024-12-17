import { FormikProps } from "formik";
import { initialValuesCreateAccount, initialValuesSignIn } from "./../types";
import { COLOR_MAIN } from "./../../../constants";
import { CUSTOMER_ACCOUNT_TYPE, DRIVER_ACCOUNT_TYPE } from "../constants";

export const handleAccountToggle = (
  accountType: string,
  setAccountType: Function,
  formik: FormikProps<initialValuesCreateAccount | initialValuesSignIn>,
  signInAuth: boolean
) => {
  const type =
    accountType === CUSTOMER_ACCOUNT_TYPE
      ? CUSTOMER_ACCOUNT_TYPE
      : DRIVER_ACCOUNT_TYPE;
  setAccountType(type);
  formik.setFieldValue(
    signInAuth ? "accountTypeSignIn" : "accountTypeCreateAccount",
    type
  );
};

export const getButtonStyles = (accountType: string, buttonType: string) => ({
  backgroundColor: accountType === buttonType ? COLOR_MAIN : "",
  color: accountType === buttonType ? "white" : COLOR_MAIN,
  gap: "10px",
  borderRadius: '50px',
  fontFamily: '"Montserrat", serif',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'medium',
  height: '48px',
  width: '212px',
  boxShadow: 'none'
});
