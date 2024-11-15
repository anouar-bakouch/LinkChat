import {db} from "@vercel/postgres"
import {Redis} from "@upstash/redis"
import {arrayBufferToBase64,stringToArrayBuffer} from "../lib/base64"
import crypto from "crypto"

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request){

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({message: 'Method not allowed'}),{status:405})

    }

    const {username,password} = await request.json();
    const client = await db.connect();

    try {
        const result = await client.query('SELECT * from users WHERE username = $1',[username]);
        const user = result.rows[0];

        if(!user){
            return new Response(
JSON.stringify({message: 'Invalid username or password'}),{status:401});
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
        if (hashedPassword !== user.password) {
            return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
        }

        // Generate token
        const token = crypto.randomBytes(16).toString('hex');

        // Store token in Redis with a 1-hour expiration
        await redis.set(token, JSON.stringify({ userId: user.id, username: user.username }), { ex: 3600 });

        // Update last login date
        await client.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

        return new Response(JSON.stringify({ token }), { status: 200 });


    } catch(error) {
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    } finally {
        client.release();
    }



}


