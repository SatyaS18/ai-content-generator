/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.tsx",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://test_owner:A4LFQyl7hIdE@ep-soft-dust-a5vtjh15.us-east-2.aws.neon.tech/ai-content-generator?sslmode=require",
  },
};
