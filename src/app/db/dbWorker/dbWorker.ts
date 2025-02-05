import connect from "./connect";

export default async function dbWorker(
  sqlSQ: string,
  parameters: any
): Promise<{
  result?: any;
  error?: { code: string };
}> {
  const connection = await connect();
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
