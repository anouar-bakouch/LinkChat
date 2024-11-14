import { CustomError } from "./CustomError";

export interface ErrorCallback {
    (error: CustomError): void;
}