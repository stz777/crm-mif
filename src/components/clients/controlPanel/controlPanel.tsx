"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import "./styles.css"; // Подключение вашего CSS файла
import SearchIcon from "./search.svg";
// import { toast } from "react-toastify";
import CreateLead from "./components/create-lead/Root";
import querystring from "querystring";

export default function ControlPanel(props: { searchParams: any }) {
  return (
    <>
      <pre>{JSON.stringify(props.searchParams, null)}</pre>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <CreateLead />
          <div className="d-flex">
            <Search />
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
          try {
            const { origin, pathname, search } = window.location;
            const queries = querystring.decode(search.replace("?", "")); //.split("&").map(string=>string.split())
            let text = "";
            if (queries.is_archive) {
              text = "скрыть архив";
              delete queries.is_archive;
            } else {
              text = "показать архив";
              queries.is_archive = "true";
            }
            const qs = querystring.encode(queries);
            const newLink = `${origin}/${pathname}?${qs}`;
            return (
              <button
                onClick={() => {
                  window.open(newLink, "_self");
                }}
                className="btn btn-outline-dark float-left"
              >
                {text}
              </button>
            );
          } catch (error) {}
        })()}
      </div>
    </>
  );
}

function Search() {
  const router = useRouter();

  return (
    <input
      type="text"
      style={{ width: 250 }}
      className="form-control"
      placeholder="Поиск"
      onChange={(e) => {
        // console.log("e", e.target.value);
        router.push(`/?keyword=${e.target.value}`);
      }}
    />
  );
}
