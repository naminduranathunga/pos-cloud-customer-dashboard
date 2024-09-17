/**
 * @file flexaro_user.ts
 * @description Custom hook for managing user authentication with JWT token in React applications.
 * This hook provides functionalities to store user data in local storage, retrieve it, handle login/logout actions,
 * and get the user's JWT token.
 * 
 * @version 0.0.1
 * 
 * Features:
 *      - Store user data in local storage
 *      - Load user data from local storage
 *      - Handle user login
 *      - Handle user logout
 *      - Retrieve user's JWT token
 * 
 * Usage:
 * 
 * // Import the custom hook
 * import useFlexaroUser, { FlexaroUser } from './flexaro_user';
 * 
 * // Inside functional component
 * const { user, isLoading, error, get_user_jwt, login, logout } = useFlexaroUser();
 * 
 * // Check if user data is loading
 * if (isLoading) {
 *     return <LoadingSpinner />;
 * }
 * 
 * // Check for any errors during user data loading
 * if (error) {
 *     return <ErrorMessage message="Failed to load user data" />;
 * }
 * 
 * // Check if user is logged in
 * if (user) {
 *     // Access user data
 *     console.log(user.id);
 *     console.log(user.data);
 *     
 *     // Access user's JWT token
 *     const jwt = get_user_jwt();
 *     console.log(jwt);
 * 
 *     // Perform logout action
 *     const handleLogout = () => {
 *         logout();
 *     }
 * 
 *     return (
 *         <div>
 *             <p>Welcome, {user.data.username}!</p>
 *             <button onClick={handleLogout}>Logout</button>
 *         </div>
 *     );
 * } else {
 *     // Perform login action
 *     const handleLogin = () => {
 *         const user: FlexaroUser = {
 *             id: 1,
 *             data: { username: 'example_user' },
 *             jwt: 'example_jwt_token'
 *         };
 *         login(user);
 *     }
 * 
 *     return (
 *         <div>
 *             <p>Please login to continue.</p>
 *             <button onClick={handleLogin}>Login</button>
 *         </div>
 *     );
 * }
 */


import { useCallback, useEffect, useState } from "react";


export interface FlexaroUser {
    id: any,
    data: any,
    jwt: string,
    exp?: number,
}

const useFlexaroUser = () => {
    const [user, setUser] = useState<FlexaroUser|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const load_user_from_local_storage = () =>{
        const user = localStorage.getItem("flexaro_user");
        if(user){
            setUser(JSON.parse(user));
        }
    }

    const login = (user: FlexaroUser) => {
        localStorage.setItem("flexaro_user", JSON.stringify(user));
        setUser(user);
        console.log("User logged in");
    }

    const logout = () => {
        localStorage.removeItem("flexaro_user");
        setUser(null);
    }

    const get_user_jwt = useCallback(()=>{
        return user?.jwt;
    }, [user]);

    useEffect(()=>{
        try {
            load_user_from_local_storage();
            setIsLoading(false);
        } catch (error) {
            setError(error);
        }
    }, []);

    return {
        user,
        isLoading,
        error,
        get_user_jwt,
        login,
        logout,
    }
};

export default useFlexaroUser;


