import { createClient } from 'redis';
import { Product } from './types';
const client = createClient({
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_PASSWORD!,
    socket: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!) ,
    }
});
await client.connect();

export async function getCache(key: string, ): Promise<{success:boolean, data:Product[] | null, status:number}> {
        client.on('error', err => console.log('Redis Client Error', err));
      return new Promise(async (resolve, reject) => {
        try {
        const cachedData = await client.get(key);
        if (cachedData != null) {
            return resolve(JSON.parse(cachedData));
        }
        console.log('Cache miss for key:', key);
        return resolve({success:false, data:null, status:404});
 
    } catch (error) {
        console.error('Error retrieving from cache:', error);
        reject(error);
    }
})
}

export async function setCache(key: string, data: string, expirationInSeconds?: number): Promise<void> {
        client.on('error', err => console.log('Redis Client Error', err));
        return new Promise(async (resolve, reject) => {
        try {
        if (expirationInSeconds && expirationInSeconds > 0) {
            await client.set(key, data, { EX: expirationInSeconds });
        } else {
            await client.set(key, data);
        }

        return data;
        } catch (error) {
        console.error('Error setting cache:', error);
        reject(error);
    }
        });

}

