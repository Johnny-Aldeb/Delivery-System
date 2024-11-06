import { Button, ToggleButtonGroup } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import { handleAccountToggle, getButtonStyles } from "./accountBarUtils";
import { CUSTOMER_ACCOUNT_TYPE, DRIVER_ACCOUNT_TYPE } from "../constants";
import { initialValuesCreateAccount, initialValuesSignIn } from "./../types";
import { FormikProps } from "formik";

export const AccountBar = ({
  accountType,
  setAccountType,
  formik,
  signInAuth,
}: {
  accountType: string;
  setAccountType: Function;
  formik: FormikProps<initialValuesCreateAccount | initialValuesSignIn>;
  signInAuth: boolean;
}) => {
  return (
    <ToggleButtonGroup value={accountType} exclusive>
      {[
        { value: CUSTOMER_ACCOUNT_TYPE, label: "Customer" },
        { value: DRIVER_ACCOUNT_TYPE, label: "Driver" },
      ].map(({ value, label }) => (
        <Button
          key={value}
          value={value}
          onClick={() =>
            handleAccountToggle(value, setAccountType, formik, signInAuth)
          }
          sx={getButtonStyles(accountType, value)}
        >
          {value === CUSTOMER_ACCOUNT_TYPE ? (
            <PersonIcon />
          ) : (
            <LocalShippingIcon />
          )}
          {label}
        </Button>
      ))}
    </ToggleButtonGroup>
  );
};
