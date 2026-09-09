import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/job-tracker";

// Maintain a cached MongoClient across hot reloads in development
let client: MongoClient;
let _clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  _clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  _clientPromise = client.connect();
}

const mongoClient = new MongoClient(uri);
const db = mongoClient.db("job-tracker");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "job_seeker",
        required: false,
        input: true,
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false,
      },
      phone: { type: "string", required: false },
      location: { type: "string", required: false },
      headline: { type: "string", required: false },
      bio: { type: "string", required: false },
      skills: { type: "string", required: false },
      website: { type: "string", required: false },
      linkedin: { type: "string", required: false },
      experience: { type: "string", required: false },
      education: { type: "string", required: false },
      isProfileComplete: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      ),
    },
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "428f5221b34a654ec9d9bcfe969446d1b7a2d109dcb4e8ec6b51079549f3e4ef",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
});
