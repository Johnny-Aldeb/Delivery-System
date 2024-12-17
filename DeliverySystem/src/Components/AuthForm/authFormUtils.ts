import {
  CreateAccountData,
  initialValuesCreateAccount,
  initialValuesSignIn
} from "./types";
import {
  ROLE_USER,
  ROLE_DRIVER,
  ROLE_ADMIN,
} from "./../../Hooks/useAuthentication";

export const userTypeMapper = (() => {
  const forwardMap = new Map<string, number>([
    ["customer", ROLE_USER],
    ["driver", ROLE_DRIVER],
    ["admin", ROLE_ADMIN],
  ]);

  const reverseMap = new Map<number, string>(
      Array.from(forwardMap.entries()).map(([key, value]) => [value, key])
  );

  return {
    get: (key: string | number): string | number | undefined => {
      if (typeof key === "string") {
        return forwardMap.get(key); // accountType to userTypeId
      }
      if (typeof key === "number") {
        return reverseMap.get(key); // userTypeId to accountType
      }
      return undefined;
    },
  };
})();

export const prepareCreateAccountValues = (
    values: initialValuesCreateAccount
): CreateAccountData => {
  return {
    firstName: values.fName,
    lastName: values.lName,
    email: values.emailCreateAccount,
    password: values.passwordCreateAccount,
    userTypeId: userTypeMapper.get(values.accountTypeCreateAccount) as number,
    phoneNumber: values.phoneNumber,
  };
};

export const prepareSignInValues = (values: initialValuesSignIn) => {
  return {
    email: values.emailSignIn,
    password: values.passwordSignIn,
  };
};
