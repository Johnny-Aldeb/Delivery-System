import { AccountValues, CreateAccountData } from "./types";

const userTypeMapper = new Map([
  ["customer", 3],
  ["driver", 2],
  ["admin", 1],
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
