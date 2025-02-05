import mysql from "mysql2/promise";

export default async function connect() {
  return await mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}
