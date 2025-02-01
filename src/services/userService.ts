import { clerkClient } from '@clerk/nextjs/server';

export const isExistingUser = async (phoneNumber:string[] | null) =>{
    const client = await clerkClient();
    if(!phoneNumber){
        throw new Error('Invalid_param_provided')
    }
    
    const users = await client.users.getUserList({ phoneNumber });
    const userExists = users.data.length > 0;

    return userExists;
}