"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import SearchIcon from "./search.svg";
import CreateLead from "./components/create-lead/Root";
import querystring from "querystring";
import { useState } from "react";

export default function ControlPanel(props: { searchParams: any }) {
  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <CreateLead />
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

        {(() => {
          const { searchParams } = props;
          return (
            <button
              onClick={() => {
                if (searchParams.is_archive) {
                  delete searchParams.is_archive;
                } else {
                  searchParams.is_archive = "true";
                }
                const { pathname, origin } = window.location;
                const qs = querystring.encode(searchParams);
                const linkParts = [pathname, `?${qs}`];
                const link = `${origin}/${pathname}?${qs}`;
                window.location.href = link
              }}
              className="btn btn-outline-dark float-left"
            >
              {searchParams.is_archive ? "скрыть" : "показать"} архив
            </button>
          );
        })()}
      </div>
    </>
  );
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
          router.push(`/${qs}`);
        }}
      />
    </>
  );
}
