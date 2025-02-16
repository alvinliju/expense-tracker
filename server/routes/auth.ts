import { Hono } from "hono";
import {kindeClient, sessionManager } from '../kinde'

import { authMiddleware } from "../kinde";



export const authRoute = new Hono()
.get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get("/callback", async (c) => {
    const url = new URL(c.req.url)
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/me", authMiddleware, async(c)=>{
    try{
      console.log('accessed /me route')
    const user = await c.var.user
    console.log('accessed /me route')
    return c.json({ user })
    }catch(err){
      throw new Error("error occured")
      console.log(err)
    }
    
  })
  
  