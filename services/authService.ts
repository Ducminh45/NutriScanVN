import type { User } from '../types';

const USER_KEY = 'nutriscanvn_user';

// --- Mock Database ---
// In a real app, this would be your backend database.
const MOCK_USERS_DB: { [email: string]: { id: string, email: string, passwordHash: string } } = {
    "user@example.com": { id: "user123", email: "user@example.com", passwordHash: "hashed_password" }
};

// --- Session Management ---

export const mockLogin = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logout = (): void => {
    localStorage.removeItem(USER_KEY);
};

export const isLoggedIn = (): boolean => {
    return localStorage.getItem(USER_KEY) !== null;
};

export const getCurrentUser = (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) {
        return null;
    }
    try {
        return JSON.parse(userJson) as User;
    } catch (e) {
        return null;
    }
};

// --- Mock API Calls ---

export const login = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const lowercasedEmail = email.toLowerCase();
            // Check if user exists (in a real app, you'd also check the hashed password)
            if (MOCK_USERS_DB[lowercasedEmail] && password) {
                const user = { id: MOCK_USERS_DB[lowercasedEmail].id, email: lowercasedEmail };
                mockLogin(user);
                resolve(user);
            } else {
                reject(new Error("Invalid email or password."));
            }
        }, 500); // Simulate network delay
    });
};

export const signup = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const lowercasedEmail = email.toLowerCase();
            if (MOCK_USERS_DB[lowercasedEmail]) {
                reject(new Error("An account with this email already exists."));
                return;
            }
            if (!password || password.length < 6) {
                 reject(new Error("Password must be at least 6 characters long."));
                return;
            }
            
            // Create new user in our mock DB
            const newUser = {
                id: `user_${Date.now()}`,
                email: lowercasedEmail,
                passwordHash: `hashed_${password}` // Mock hashing
            };
            MOCK_USERS_DB[lowercasedEmail] = newUser;
            
            // We don't automatically log in the user, just return success
            resolve({ id: newUser.id, email: newUser.email });

        }, 500); // Simulate network delay
    });
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
             const lowercasedEmail = email.toLowerCase();
            if (MOCK_USERS_DB[lowercasedEmail]) {
                 // In a real app, you would send an email here.
                console.log(`Password reset link sent to ${lowercasedEmail}`);
                resolve({ message: "If an account exists for this email, a password reset link has been sent." });
            } else {
                // We resolve successfully even if the email doesn't exist for security reasons
                resolve({ message: "If an account exists for this email, a password reset link has been sent." });
            }
        }, 500);
    });
};