import { hc } from 'hono/client';
import {type ApiRoutes} from "../../../server/app"
import { queryOptions } from '@tanstack/react-query';

const client = hc<ApiRoutes>('/') 

export const api = client.api

async function getCurrentUser(){
    try{
        const res = await api.me.$get()
    if(!res.ok){
        return null
    }
    
    let data = await res.json()
    if(!data){
        return null
    }
    console.log('accessed getCurrentUser')
    return data
    }catch(err){
      
        console.log(err)
        return null
    }
    
}

export const userQueryOptions = queryOptions(
    { queryKey: ['get-user-profile'], 
        queryFn: getCurrentUser,
        staleTime:Infinity
     })