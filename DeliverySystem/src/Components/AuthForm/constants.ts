import { TextFieldsConfig, initialValuesCreateAccount, initialValuesSignIn } from "./types";
import * as Yup from 'yup';

export const SUBMIT_BUTTON: string = 'Submit';
export const CANCEL_BUTTON: string = 'Cancel';
export const FIELD_REQUIRED_MESSAGE: string = 'Required';
export const INVALID_EMAIL_MESSAGE: string = 'Invalid email';
export const INVALID_CONFIRM_PASSWORD_MESSAGE: string = 'Passwords must match';
export const EMPTY_STRING: string = '';
export const CUSTOMER_ACCOUNT_TYPE: string = 'customer';
export const DRIVER_ACCOUNT_TYPE: string = 'driver';

export const CREATE_ACCOUNT_FIELDS: Array<TextFieldsConfig> = [
    { label: 'First Name', name: 'fName' },
    { label: 'Last Name', name: 'lName' },
    { label: 'Enter Email', name: 'emailCreateAccount', },
    { label: 'Enter Password', name: 'passwordCreateAccount' },
    { label: 'Confirm Password', name: 'confirmPassword' }
];

export const SIGN_IN_FIELDS: Array<TextFieldsConfig> = [
    { label: 'Enter Email', name: 'emailSignIn' },
    { label: 'Enter Password', name: 'passwordSignIn' },
];

export const INITIAL_VALUES_CREATE_ACCOUNT: initialValuesCreateAccount = {
    fName: EMPTY_STRING,
    lName: EMPTY_STRING,
    emailCreateAccount: EMPTY_STRING,
    passwordCreateAccount: EMPTY_STRING,
    confirmPassword: EMPTY_STRING,
    accountTypeCreateAccount: CUSTOMER_ACCOUNT_TYPE,
}

export const INITIAL_VALUES_SIGN_IN: initialValuesSignIn = {
    emailSignIn: EMPTY_STRING,
    passwordSignIn: EMPTY_STRING,
    accountTypeSignIn: CUSTOMER_ACCOUNT_TYPE,
}

export const signInSchema = Yup.object().shape({
    emailSignIn: Yup.string().email(INVALID_EMAIL_MESSAGE).required(FIELD_REQUIRED_MESSAGE),
    passwordSignIn: Yup.string().required(FIELD_REQUIRED_MESSAGE),
});

export const createAccountSchema = Yup.object().shape({
    fName: Yup.string().required(FIELD_REQUIRED_MESSAGE),
    lName: Yup.string().required(FIELD_REQUIRED_MESSAGE),
    emailCreateAccount: Yup.string().email(INVALID_EMAIL_MESSAGE).required(FIELD_REQUIRED_MESSAGE),
    passwordCreateAccount: Yup.string().required(FIELD_REQUIRED_MESSAGE),
    confirmPassword: Yup.string()
        .required(FIELD_REQUIRED_MESSAGE)
        .oneOf([Yup.ref('passwordCreateAccount')], INVALID_CONFIRM_PASSWORD_MESSAGE),
});

export const isPasswordField = (fieldName: string): 'password' | 'text' => {
    const passwordFields = ['passwordCreateAccount', 'confirmPassword', 'passwordSignIn'];
    return passwordFields.includes(fieldName) ? 'password' : 'text';
};
