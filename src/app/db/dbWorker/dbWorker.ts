import dbConnection from "./dbConnection"

export default async function dbWorker(sql: string, params: string | any[], callback?: (arg0: any, arg1: any) => any) {
    const connection = await dbConnection();
    try {
        const res = await connection
            .query(sql, params);
        await connection.end();
        if (callback) callback(null, res[0]);

    } catch (error) {
        await connection.end();
        if (callback) callback({
            error: 'error #kfsdf94'
        }, null);
    }
}