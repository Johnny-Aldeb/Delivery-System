import { AccountValues, CreateAccountData } from "./types";
import {
  ROLE_USER,
  ROLE_DRIVER,
  ROLE_ADMIN,
} from "./../../Hooks/useAuthentication";

export const userTypeMapper = new Map([
  ["customer", ROLE_USER],
  ["driver", ROLE_DRIVER],
  ["admin", ROLE_ADMIN],
  [ROLE_USER, "customer"],
  [ROLE_DRIVER, "driver"],
  [ROLE_ADMIN, "admin"],
]);

export const prepareCreateAccountValues = (
  values: AccountValues
): CreateAccountData => {
  return {
    firstName: values.fName,
    lastName: values.lName,
    email: values.emailCreateAccount,
    password: values.passwordCreateAccount,
    userTypeId: userTypeMapper.get(values.accountTypeCreateAccount),
    address: values.address,
    phoneNumber: values.phoneNumber,
  };
};

export const prepareSignInValues = (values: AccountValues) => {
  return {
    email: values.emailSignIn,
    password: values.passwordSignIn,
  };
};
