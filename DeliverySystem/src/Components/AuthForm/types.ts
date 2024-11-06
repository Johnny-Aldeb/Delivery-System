export interface TextFieldsConfig {
  label: string;
  name: string;
}

export interface initialValuesCreateAccount {
  fName: string;
  lName: string;
  emailCreateAccount: string;
  phoneNumber: string;
  address: string;
  passwordCreateAccount: string;
  confirmPassword: string;
  accountTypeCreateAccount: string;
}

export interface initialValuesSignIn {
  emailSignIn: string;
  passwordSignIn: string;
  accountTypeSignIn: string;
}

export interface AccountValues {
  email: string,
  password: string
}

export interface CreateAccountData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userTypeId?: number;
  address: string;
  phoneNumber: string;
}
