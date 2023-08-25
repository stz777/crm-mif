import Client from "./client";
import getFinReportdata from "./getFinReportdata";

export default async function Page() {
    const data = await getFinReportdata();
    return <Client reportData={data} />
    
}