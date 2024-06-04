// const Redis = require('ioredis')
import {Redis} from "ioredis"

const redisClient = () =>{
    if(process.env.REDIS_URL){
        console.log("redis connected")
        return process.env.REDIS_URL
    }
    throw new Error('Redis Connection failed')
}

export const redis = new Redis(redisClient());
