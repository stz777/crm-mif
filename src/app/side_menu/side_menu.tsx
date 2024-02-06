import { cookies } from "next/headers";
import { getUserByToken } from "../components/getUserByToken";
import { headers } from "next/headers";
import Client from "./client";

export default async function SideMenu() {
    const headersList = headers();
    const currentPath = String(headersList.get("x-invoke-path"));
    const auth = cookies().get('auth');
    if (!auth?.value) return;
    const user = await getUserByToken(auth?.value);
    if (!user) return null;
    return <div style={{ width: "180px" }}>
        <Client currentPath={currentPath} />
    </div>
}
