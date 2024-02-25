import CreateClient from "./CreateClient";
import Image from "next/image";
import SearchIcon from "@/components/clients/controlPanel/search.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientsHeader(props: { searchParams: any }) {
    return <>
        <div className="d-flex ">
            <CreateClient />
            <div className="d-flex">
                <Search searchParams={props.searchParams} />
                <Image
                    src={SearchIcon}
                    alt=""
                    style={{
                        marginTop: "13px",
                        marginLeft: "-28px",
                    }}
                    className="me-2"
                    width={15}
                    height={15}
                />
            </div>
        </div>
    </>;
}


function Search(props: { searchParams: { is_archive?: "true", keyword: string }; }) {
    const router = useRouter();
    const [value, setValue] = useState(props.searchParams.keyword || "");
    return (
        <>
            <input
                type="text"
                style={{ width: 250 }}
                className="form-control"
                placeholder="Поиск"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    const params: { keyword?: string, is_archive?: "true" } = {};
                    if (e.target.value.length) params.keyword = e.target.value;
                    if (props.searchParams.is_archive === "true") params.is_archive = "true";
                    const fromEntriedParams = Object.entries(params).map(x => x.join("=")).join("&");
                    const qs = fromEntriedParams.length ? `?${fromEntriedParams}` : "";
                    console.log('www',window.location.pathname);
                    
                    router.push(`${location.pathname}/${qs}`);
                }}
            />
        </>
    );
}
