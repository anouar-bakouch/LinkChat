import { Session } from "./Session";


export interface SessionCallback {
    (session: Session): void;
}