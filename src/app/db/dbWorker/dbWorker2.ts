// import dbConnection from "./connect";
import dbConnection from "./dbConnection";
import ts_dbWorkerOutput from "./types/ts_dbWorkerOutput";

export default async function dbWorker(
  sqlSQ: string,
  parameters: any
): Promise<ts_dbWorkerOutput> {
  const connection = await dbConnection();
  try {
    const sql = await connection.query(sqlSQ, parameters);
    await connection.end();
    return {
      result: sql[0],
    };
  } catch (error: any) {
    await connection.end();
    console.error("#kadsj", error);

    if (error.code)
      return {
        error: {
          // code: error.code,
          ...error,
        },
      };
  }
  return {
    error: {
      code: "unknown",
    },
  };
}