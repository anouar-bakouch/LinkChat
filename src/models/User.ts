

export interface User {

    avatar_url: string | undefined;
    user_id: number;
    username: string;
    email?: string;
    password: string;
    last_login?: string;
    external_id?: string;
    created_at: string;
    
}