export const appwriteConfig = {
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "",
  collectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID || "",
  usersCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "users",
  endpoint:
    process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  apiKey: process.env.EXPO_PUBLIC_APPWRITE_API_KEY || "",
};
