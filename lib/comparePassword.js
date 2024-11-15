import { hashPassword } from './hash';

export async function comparePassword(password, hashedPassword) {
    const hashedInputPassword = await hashPassword(password);
    return hashedInputPassword === hashedPassword;
}