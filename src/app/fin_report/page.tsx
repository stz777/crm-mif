import getFinReportdata from "./getFinReportdata";

export default async function Page() {
    const data = await getFinReportdata();
    return <>
        <h1>Отчет</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
}