import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

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
const db = mongoClient.db();

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
      technicalSkills: { type: "string", required: false },
      website: { type: "string", required: false },
      linkedin: { type: "string", required: false },
      experience: { type: "string", required: false },
      education: { type: "string", required: false },
      isProfileComplete: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      tokens: {
        type: "number",
        defaultValue: 50,
        required: false,
      },
      verifiedBonusGiven: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token: _token }, _request) => {
      // In a real application, you would send this URL via an email provider (like Resend, SendGrid, etc.)
      console.log(`\n\n======================================================`);
      console.log(`🔒 PASSWORD RESET LINK GENERATED FOR: ${user.email}`);
      console.log(`🔗 Click to reset: ${url}`);
      console.log(`======================================================\n\n`);
    },
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
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
});
