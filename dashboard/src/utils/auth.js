import store from '../store';
import API from './API';
import AuthEventBus from './AuthEventBus';

function _decodeJWT(jwt) {
    const decodedToken = JSON.parse(atob(jwt.split('.')[1]));
    const signInUserSession = new Date() <= new Date(decodedToken.exp * 1000);
    return Object.assign(decodedToken.user, { signInUserSession });
}

async function getUser() {
    const token = localStorage.getItem('token');
    if (token) return _decodeJWT(token, 'getUser');
    else return null;
}

async function signIn(username, password) {
    try {
        const response = await API.post('/auth/login', { email: username, password });
        store.commit('setToken', response.data.token);
        const user = _decodeJWT(response.data.token);
        store.commit('setUser', user);
        if (user && user.signInUserSession) {
            AuthEventBus.$emit('authState', 'signedIn');
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            AuthEventBus.$emit('authState', 'forcePasswordReset');
        } else {
            throw new Error('Failed to signIn');
        }
    } catch (err) {
        console.error(err);
        // Request was successful but API returned error code outside of range 2xx
        if (err.response) {
            if (err.response.data.message === 'INCORRECT_PASSWORD') {
                AuthEventBus.$emit('authError', 'Credentials incorrect, please try again.');
            } else if (err.response.data.message === 'USER_NOT_FOUND') {
                AuthEventBus.$emit('authError', 'Credentials incorrect, please try again.');
            } else {
                AuthEventBus.$emit('authError', 'Unknown server error, please try again.');
            }
        } else {
            AuthEventBus.$emit('authError', 'Unknown error, please try again');
        }
    }
}

async function resetPassword(username) {
    try {
        await API.post('/auth/forgot-password', { email: username });
        AuthEventBus.$emit('authState', 'forgetPasswordSent');
        return true;
    } catch (err) {
        console.error(err);
        // Request was successful but API returned error code outside of range 2xx
        if (err.response) {
            if (err.response.data.message === 'EMAIL_REQUIRED') {
                AuthEventBus.$emit('authError', 'Email required to reset password.');
            } else {
                AuthEventBus.$emit('authError', 'Unknown server error, please try again.');
            }
        } else {
            AuthEventBus.$emit('authError', 'Unknown error, please try again');
        }
    }
}

async function completeNewPassword(username, code, newPassword) {
    try {
        await API.post('/auth/password-reset', { email: username, token: code, password: newPassword });
        AuthEventBus.$emit('authState', 'passwordResetSuccess');
    } catch (err) {
        console.error(err);
        // Request was successful but API returned error code outside of range 2xx
        if (err.response) {
            if (err.response.data.message === 'EMAIL_REQUIRED') {
                AuthEventBus.$emit('authError', 'Email missing, please try the email link again.');
            } else if (err.response.data.message === 'TOKEN_REQUIRED') {
                AuthEventBus.$emit('authError', 'Token missing, please try the email link again.'); 
            } else if (err.response.data.message === 'PASSWORD_REQUIRED') {
                AuthEventBus.$emit('authError', 'Password missing. A new password is required to reset the old one.');
            } else if (err.response.data.message === 'TOKEN_NOT_FOUND') {
                AuthEventBus.$emit('authError', 'Token not found. Please try the reset password process again.');
            } else {
                AuthEventBus.$emit('authError', 'Unknown server error, please try again.');
            }
        } else {
            AuthEventBus.$emit('authError', 'Unknown error, please try again');
        }
    }
}

export {getUser, signIn, resetPassword, completeNewPassword};
