import { Button, ToggleButtonGroup } from "@mui/material";
import { handleAccountToggle, getButtonStyles } from "./accountBarUtils";
import { CUSTOMER_ACCOUNT_TYPE, DRIVER_ACCOUNT_TYPE } from "../constants";
import { initialValuesCreateAccount, initialValuesSignIn } from "./../types";
import { User } from 'lucide-react';
import { Truck } from 'lucide-react';
import { FormikProps } from "formik";

export const AccountBar = ({
  accountType,
  setAccountType,
  formik,
  signInAuth,
}: {
  accountType: string;
  setAccountType: (type: string) => void;
  formik: FormikProps<initialValuesCreateAccount | initialValuesSignIn>;
  signInAuth: boolean;
}) => {
  return (
    <ToggleButtonGroup value={accountType} exclusive sx={{ }}>
      {[
        { value: CUSTOMER_ACCOUNT_TYPE, label: "Customer" },
        { value: DRIVER_ACCOUNT_TYPE, label: "Driver" },
      ].map(({ value, label }) => (
        <Button
          disableRipple
          key={value}
          value={value}
          onClick={() =>
            handleAccountToggle(value, setAccountType, formik, signInAuth)
          }
          sx={getButtonStyles(accountType, value)}
        >
          {value === CUSTOMER_ACCOUNT_TYPE ? (
            <User />
          ) : (
            <Truck />
          )}
          {label}
        </Button>
      ))}
    </ToggleButtonGroup>
  );
};
