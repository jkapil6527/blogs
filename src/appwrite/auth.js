import conf from "../config/config.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        // call another method
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  // async getCurrentUser() {
  //     try {
  //         return await this.account.get();
  //     } catch (error) {
  //         console.log("Appwrite serive :: getCurrentUser :: error", error);
  //     }

  //     return null;
  // }

  // async getCurrentUser() {
  //   try {
  //     const user = await this.account.get();
  //     return user;
  //   } catch (error) {
  //     // Only log if it's not the "guest missing scope" error
  //     if (error?.code !== 401) {
  //       console.error("Appwrite service :: getCurrentUser :: error", error);
  //     }
  //     return null; // No logged in user
  //   }
  // }
  
  async getCurrentUser() {
    try {
        return await this.account.get();
    } catch (error) {
        console.log("Appwrite serive :: getCurrentUser :: error", error);
    }

    return null;
}

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite serive :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
