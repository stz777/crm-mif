import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchInterface } from "./types";

export default function Filter(props: { searchParams: SearchInterface }) {
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
                    if (props.searchParams?.is_archive === "true") params.is_archive = "true";
                    const fromEntriedParams = Object.entries(params).map(x => x.join("=")).join("&");
                    const qs = fromEntriedParams.length ? `?${fromEntriedParams}` : "";
                    // console.log('www', window.location.pathname);
                    router.push(`${location.pathname}/${qs}`);
                }}
            />
        </>
    );
}