import { useState } from "react";
import { CustomError } from "../models/CustomError"
import { Session } from "../models/Session"
import { loginUser } from "./loginApi";


export function login () {

    const [error,setError] = useState({} as CustomError);
    const [session,setSession] = useState({} as Session);

    const HandleSubmit = (event:React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        
        loginUser({user_id:-1,username : data.get('login') as string,password : data.get('password') as string}, 
        (result :Session) => {
            setSession(result)
            form.reset()
            setError(new CustomError(""));
        } , (loginError : CustomError) => {
            setError(loginError)
            setSession({} as Session)
        });

    }



}