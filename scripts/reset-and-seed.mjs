import { MongoClient } from "mongodb";
import { auth } from "../src/lib/auth.ts";
import { TOP_50_RECRUITER_TEMPLATES } from "../src/lib/resumeTemplatesData.ts";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in environment!");
  process.exit(1);
}

const SUPER_ADMIN_EMAIL = (
  process.env.SUPER_ADMIN_EMAIL || "superadmin@careergraph.com"
)
  .toLowerCase()
  .trim();
const SUPER_ADMIN_PASSWORD =
  process.env.SUPER_ADMIN_password ||
  process.env.SUPER_ADMIN_PASSWORD ||
  "z5h#nXxMLn8C6ko#dv&uaw$27pCrP^BN";

const DEFAULT_POLAR_PRODUCTS = {
  "Starter Pack": "3394c8b2-4d26-4b82-96c2-00ce0eec3ca0",
  "Pro Pack": "0fc91c28-912b-4786-bce7-8aebbfd27d78",
  "Ultra Career Pack": "ecb97c0d-db2e-4bb5-8664-9eb51e847ae2",
};

const DEFAULT_PACKAGES = [
  {
    name: "Starter Pack",
    tokens: 500,
    price: 5,
    polarProductId: DEFAULT_POLAR_PRODUCTS["Starter Pack"],
    description:
      "Essential token bundle for kickstarting your targeted job applications.",
    badge: "Starter",
    isPopular: false,
    features: [
      "~12 Complete Application Suites",
      "50 Deep ATS Resume Audits (10 tokens each)",
      "25 AI Tailored Cover Letters (20 tokens each)",
      "50 Job Fit Alignment Checks (10 tokens each)",
      "Tokens never expire (Lifetime validity)",
    ],
    isActive: true,
    category: "bundle",
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pro Pack",
    tokens: 1150,
    price: 10,
    polarProductId: DEFAULT_POLAR_PRODUCTS["Pro Pack"],
    description:
      "Our most popular package for serious applicants targeting top roles (+15% Free Bonus).",
    badge: "Most Popular",
    isPopular: true,
    features: [
      "~28 Complete Application Suites",
      "1,150 AI Diamond Tokens (+150 bonus)",
      "115 Deep ATS Resume Audits (10 tokens each)",
      "57 AI Tailored Cover Letters (20 tokens each)",
      "High-Priority AI Inference",
      "Tokens never expire (Lifetime validity)",
    ],
    isActive: true,
    category: "bundle",
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ultra Career Pack",
    tokens: 2600,
    price: 20,
    polarProductId: DEFAULT_POLAR_PRODUCTS["Ultra Career Pack"],
    description:
      "Maximum career acceleration bundle with the highest token value per dollar (+30% Free Bonus).",
    badge: "Best Value",
    isPopular: false,
    features: [
      "~65 Complete Application Suites",
      "2,600 AI Diamond Tokens (+600 bonus)",
      "260 Deep ATS Resume Audits (10 tokens each)",
      "130 AI Tailored Cover Letters (20 tokens each)",
      "Priority VIP AI Inference Speed",
      "Tokens never expire (Lifetime validity)",
    ],
    isActive: true,
    category: "bundle",
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Annual VIP Pass",
    tokens: 7000,
    price: 50,
    polarProductId: "",
    description:
      "All-in-one 365-day pass with 7,000 Lifetime Tokens and 1 Full Year of VIP Priority Daily AI Job Scraping (Save 58%).",
    badge: "1 Year VIP • Save 58%",
    isPopular: false,
    features: [
      "~175 Complete Application Suites",
      "7,000 AI Diamond Tokens (+75% Mega Bonus)",
      "365 Days of Daily AI Job Matches (1 Full Year)",
      "Top VIP Priority in Daily Scraper Queue",
      "Up to 20 Tailored Matches Per Day",
      "Tokens never expire (Lifetime validity)",
    ],
    isActive: true,
    sortOrder: 4,
    category: "bundle",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Token Mini Refill",
    tokens: 200,
    price: 2,
    polarProductId: "",
    description:
      "Instant token top-up for ATS resume checks & tailored cover letters (Tokens only, no daily scraping).",
    badge: "Quick Top-Up",
    category: "token_only",
    isPopular: false,
    features: [
      "200 AI Diamond Tokens",
      "20 Deep ATS Resume Audits (10 tokens each)",
      "10 AI Tailored Cover Letters (20 tokens each)",
      "Tokens never expire (Lifetime validity)",
      "Instant balance credit",
    ],
    isActive: true,
    sortOrder: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Token Pro Refill",
    tokens: 600,
    price: 5,
    polarProductId: "",
    description:
      "High-volume token refill for active applicants focusing on resume audits and cover letters (+20% Bonus).",
    badge: "Best Value Refill",
    category: "token_only",
    isPopular: false,
    features: [
      "600 AI Diamond Tokens (+100 Free Bonus)",
      "60 Deep ATS Resume Audits (10 tokens each)",
      "30 AI Tailored Cover Letters (20 tokens each)",
      "Tokens never expire (Lifetime validity)",
      "Instant balance credit",
    ],
    isActive: true,
    sortOrder: 11,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DEFAULT_JOB_MARKETS = [
  {
    name: "LinkedIn Jobs",
    link: "https://www.linkedin.com/jobs",
    category: "general",
    description:
      "The world's largest professional networking platform and job marketplace with direct recruiter messaging.",
    tags: ["Global", "All Roles", "Networking", "Easy Apply"],
    rating: 5,
    isFavorite: true,
    visitCount: 0,
    savedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Wellfound (AngelList)",
    link: "https://wellfound.com/jobs",
    category: "startups",
    description:
      "Connect directly with startup founders and early-stage high-growth technology companies.",
    tags: ["Startups", "Equity", "Direct Founders", "Tech"],
    rating: 5,
    isFavorite: true,
    visitCount: 0,
    savedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "RemoteOK",
    link: "https://remoteok.com",
    category: "remote",
    description:
      "Premier marketplace for remote developers, designers, and marketers with verified pay statistics.",
    tags: ["Remote", "Transparent Pay", "Worldwide", "Tech"],
    rating: 5,
    isFavorite: true,
    visitCount: 0,
    savedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "We Work Remotely",
    link: "https://weworkremotely.com",
    category: "remote",
    description:
      "One of the oldest and largest remote work communities with 100% remote job listings.",
    tags: ["Remote", "Engineering", "Marketing", "Customer Support"],
    rating: 4,
    isFavorite: false,
    visitCount: 0,
    savedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Y Combinator Work at a Startup",
    link: "https://www.workatastartup.com",
    category: "startups",
    description:
      "Apply directly to YC-backed startup teams and breakthrough venture companies worldwide.",
    tags: ["YC Alumni", "High Equity", "Engineering", "Founders"],
    rating: 5,
    isFavorite: true,
    visitCount: 0,
    savedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Indeed",
    link: "https://www.indeed.com",
    category: "general",
    description:
      "Comprehensive worldwide job aggregator covering every industry and experience level.",
    tags: ["Global", "High Volume", "Aggregator", "All Roles"],
    rating: 4,
    isFavorite: false,
    visitCount: 0,
    savedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function main() {
  console.log("=================================================");
  console.log("🚀 CAREER GRAPH DATASET RESET & SEED SCRIPT");
  console.log("=================================================");

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("CareerGraph");

  console.log("\n📦 STEP 1: Saving all 50 Resume Templates into DB...");
  const resumeTemplatesColl = db.collection("resumetemplates");
  await resumeTemplatesColl.deleteMany({});

  const templateDocs = TOP_50_RECRUITER_TEMPLATES.map((tmpl) => ({
    ...tmpl,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const tmplInsertResult = await resumeTemplatesColl.insertMany(templateDocs);
  console.log(
    `✅ Saved ${tmplInsertResult.insertedCount} resume templates into 'resumetemplates' collection.`,
  );

  console.log("\n💎 STEP 2: Seeding Token Packages...");
  const tokenPackagesColl = db.collection("tokenpackages");
  await tokenPackagesColl.deleteMany({});
  const pkgInsertResult = await tokenPackagesColl.insertMany(DEFAULT_PACKAGES);
  console.log(
    `✅ Seeded ${pkgInsertResult.insertedCount} token packages into 'tokenpackages' collection.`,
  );

  console.log("\n🌐 STEP 3: Seeding Curated Job Markets...");
  const jobMarketsColl = db.collection("jobmarkets");
  await jobMarketsColl.deleteMany({});
  const jmInsertResult = await jobMarketsColl.insertMany(DEFAULT_JOB_MARKETS);
  console.log(
    `✅ Seeded ${jmInsertResult.insertedCount} curated job markets into 'jobmarkets' collection.`,
  );

  console.log(
    "\n🧹 STEP 4: Resetting Super Admin & Test Accounts for Clean Auth Injection...",
  );
  const userColl = db.collection("user");
  const accountColl = db.collection("account");
  const sessionColl = db.collection("session");

  // Remove existing super admin to test injection cleanly
  const existingAdmin = await userColl.findOne({ email: SUPER_ADMIN_EMAIL });
  if (existingAdmin) {
    const adminId = existingAdmin._id;
    await accountColl.deleteMany({
      $or: [{ userId: adminId }, { userId: adminId.toString() }],
    });
    await sessionColl.deleteMany({
      $or: [{ userId: adminId }, { userId: adminId.toString() }],
    });
    await userColl.deleteOne({ _id: adminId });
    console.log(
      `🧹 Cleaned up existing super admin record to prepare for fresh Better Auth injection.`,
    );
  }

  // Also clean up any orphan test accounts
  const auditUser = await userColl.findOne({ email: "audit_user@example.com" });
  if (auditUser) {
    await accountColl.deleteMany({
      $or: [{ userId: auditUser._id }, { userId: auditUser._id.toString() }],
    });
    await sessionColl.deleteMany({
      $or: [{ userId: auditUser._id }, { userId: auditUser._id.toString() }],
    });
    await userColl.deleteOne({ _id: auditUser._id });
    console.log(`🧹 Cleaned up audit test user.`);
  }

  console.log(
    "\n👑 STEP 5: Testing Super Admin Check & One-Time Injection Logic...",
  );
  // Function to simulate the system startup check
  async function checkAndInjectSuperAdmin() {
    const adminInDb = await userColl.findOne({
      email: { $regex: new RegExp(`^${SUPER_ADMIN_EMAIL}$`, "i") },
    });

    if (adminInDb) {
      console.log(
        `ℹ️ [CHECK] Super admin (${SUPER_ADMIN_EMAIL}) ALREADY EXISTS. Doing nothing.`,
      );
      return { injected: false };
    }

    console.log(
      `⚡ [CHECK] Super admin (${SUPER_ADMIN_EMAIL}) NOT FOUND. Injecting via Better Auth...`,
    );
    try {
      await auth.api.signUpEmail({
        body: {
          name: "Super Admin",
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD,
        },
      });
    } catch (signupErr) {
      console.warn(
        "Better Auth signUpEmail note:",
        signupErr?.message || signupErr,
      );
    }

    // Configure role & permissions
    await userColl.updateOne(
      { email: { $regex: new RegExp(`^${SUPER_ADMIN_EMAIL}$`, "i") } },
      {
        $set: {
          role: "super_admin",
          emailVerified: true,
          status: "active",
          tokens: 999999,
          isProfileComplete: true,
          phone: "+1-555-0199",
          headline: "Platform Super Administrator",
          updatedAt: new Date(),
        },
      },
    );
    console.log(
      `✅ [CHECK] Super admin (${SUPER_ADMIN_EMAIL}) injected into DB with role 'super_admin' and 999,999 tokens.`,
    );
    return { injected: true };
  }

  // 1st run: Should inject
  const run1 = await checkAndInjectSuperAdmin();
  console.log(`Run 1 result: injected = ${run1.injected}`);

  // 2nd run: Should detect existing and do nothing
  const run2 = await checkAndInjectSuperAdmin();
  console.log(
    `Run 2 result: injected = ${run2.injected} (Expected: false, did nothing)`,
  );

  console.log("\n🔐 STEP 6: Verifying Super Admin Login via Better Auth...");
  try {
    const signInRes = await auth.api.signInEmail({
      body: {
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
      },
      asResponse: true,
    });
    console.log(`✅ Super Admin Sign-In Status: ${signInRes.status}`);
    const cookieHeader = signInRes.headers.get("set-cookie");
    if (cookieHeader) {
      console.log(`✅ Valid Better Auth session cookie issued.`);
    } else {
      console.warn("⚠️ Warning: No cookie issued on sign in.");
    }
  } catch (err) {
    console.error("❌ Sign in verification failed:", err);
  }

  console.log("\n📊 STEP 7: Final DB Status Summary:");
  const templatesCount = await db
    .collection("resumetemplates")
    .countDocuments();
  const packagesCount = await db.collection("tokenpackages").countDocuments();
  const marketsCount = await db.collection("jobmarkets").countDocuments();
  const finalUsers = await db
    .collection("user")
    .find(
      {},
      { projection: { email: 1, role: 1, emailVerified: 1, tokens: 1 } },
    )
    .toArray();

  console.log(`- Resume Templates: ${templatesCount} (Expected: 50)`);
  console.log(`- Token Packages:   ${packagesCount} (Expected: 3)`);
  console.log(`- Curated Markets:  ${marketsCount} (Expected: 6)`);
  console.log(`- Active Users:`, finalUsers);

  await client.close();
  console.log("\n=================================================");
  console.log("✨ APPLICATION & DATASET RESET COMPLETED SUCCESSFULLY!");
  console.log("=================================================");
}

main().catch((err) => {
  console.error("Fatal error during reset & seed:", err);
  process.exit(1);
});
