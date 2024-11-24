import { Session } from "../models/Session";
import { User } from "../models/User";
import { ErrorCallback } from "../models/ErrorCallback";
import { SessionCallback } from "../models/SessionCallback";
import { CustomError } from "../models/CustomError";

export function loginUser(user: User, onResult: SessionCallback, onError: ErrorCallback) {
    fetch("/api/login",
        {
            method: "POST", // ou 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then(async (response) => {
            if (response.ok) {
                const session = await response.json() as Session;
                sessionStorage.setItem('token', session.token);
                sessionStorage.setItem('externalId', session.externalId);
                if(session.id){
                sessionStorage.setItem('id', session.id.toString());
                }
                sessionStorage.setItem('username', session.username || "");
                onResult(session)
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        }, onError);
}