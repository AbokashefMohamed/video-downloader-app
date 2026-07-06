import validator from "validator";
import { isDisposableEmail } from "disposable-email-domains-js";


export function validateEmail(email) {
    if (!validator.isEmail(email)) {
        return "Please enter a valid email address";
    }

    if (isDisposableEmail(email)) {
        return "Temporary or disposable email addresses are not allowed";
    }

    return null;
}


export function validatePassword(password) {
    if(password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        return "Password must contain at least one symbol";
    }

    return null;
}