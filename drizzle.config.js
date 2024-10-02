/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
};
