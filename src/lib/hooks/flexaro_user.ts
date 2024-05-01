/**
 * @file flexaro_user.ts
 * @description This file contains the custom hookS for handling user with jwt token. 
 * This hooks will store the user data in the local storage and provide the user data to the components.
 * 
 * @version 0.0.1
 * Features:
 *      - Store user data in the local storage
 *      - Load user data from the local storage
 *      
 */

import { useCallback, useEffect, useState } from "react";


export interface FlexaroUser {
    id: any,
    data: any,
    jwt: string
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
    }

    const logout = () => {
        localStorage.removeItem("flexaro_user");
        setUser(null);
    }

    const get_user_jwt = useCallback(()=>{
        return user?.jwt;
    }, []);

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