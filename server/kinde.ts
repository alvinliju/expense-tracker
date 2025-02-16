import { createKindeServerClient, GrantType, type User, type UserType, } from "@kinde-oss/kinde-typescript-sdk";
import { type SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createFactory, createMiddleware } from 'hono/factory'
import { string, unknown } from "zod";



// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
    authDomain: process.env.KINDE_DOMAIN!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    redirectURL: process.env.KINDE_REDIRECT_URI!,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!
});



let store: Record<string, unknown> = {};

export const sessionManager = (c: Context):SessionManager  => ({
    async getSessionItem(key: string) {
       const result = getCookie(c,key)
       return result
    },
    async setSessionItem(key:string, value:unknown) {
      const cookieOptions = {
        httpOnly:true,
        secure:true,
        sameSite:"Lax"
      } as const;
      if(typeof value === "string"){
        setCookie(c, key, value, cookieOptions)
      }else{
        setCookie(c, key, JSON.stringify(value), cookieOptions)
      }
    },
    async removeSessionItem(key: string) {
      deleteCookie(c, key)
    },
    async destroySession() {
       ["id_token", "access_token", "user", "refresh_token"].forEach((key)=>{
            deleteCookie(c, key)
       })
    }
  })


export type Env = {
    Variables: {
        user: UserType
    }
}

const factory = createFactory<Env>()

export const authMiddleware = createMiddleware(async (c, next) => {
    try {
        const isAuthenticated = await kindeClient.isAuthenticated(sessionManager(c))
        if (!isAuthenticated) {
            return c.json({ message: "not authenticated" })
        }
        const user = await kindeClient.getUserProfile(sessionManager(c))

        c.set("user", user)
        await next()
    } catch (err) {
        return c.json({ message: "internal error" })
    }

})