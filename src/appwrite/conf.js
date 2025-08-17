import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImg, status, userId }) {
    console.log("kapil" , title, slug, content, featuredImg, status, userId);
    
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImg,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("APPWRITE SERVICE :: CREATEPOST :: ERROR", error);
    }
  }

  async updatePost(slug, { title, content, featuredImg, status }) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImg,
          status,
        },
        "unique()", // or custom ID
        {
          title: "My Post",
          content: "Post body here",
          status: true,
          "featured-image": fileId, // must match the exact attribute name in schema
        }
      );
    } catch (error) {
      console.log("APPWRITE SERVICE :: UPDATEPOST :: ERROR", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.appwriteCollectionId,
        config.appwriteDatabaseId,
        slug
      );
      return true;
    } catch (error) {
      console.log("APPWRITE SERVICE :: DELETEPOST :: ERROR", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("APPWRITE SERVICE :: GETPOST :: ERROR", error);
    }
  }
  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      // Validate configuration before making the request
      if (
        !config.appwriteDatabaseId ||
        config.appwriteDatabaseId === "undefined"
      ) {
        throw new Error(
          "Database ID is not configured. Please check your environment variables."
        );
      }

      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("APPWRITE SERVICE :: GETPOSTS :: ERROR", error);
      throw error; // Re-throw to handle in the component
    }
  }

  //file upload services

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("APPWRITE SERVICE :: uploadFile :: ERROR", error);
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("APPWRITE SERVICE :: deleteFile :: ERROR", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    // return this.bucket.getFilePreview(config.appwriteBucketId, fileId);

    return `https://nyc.cloud.appwrite.io/v1/storage/buckets/687f76ae003476628789/files/689ccfb5003ce8e94a2e/view?project=687f56d4000020077fa9&mode=admin`


  }

}

const service = new Service();
export default service;
