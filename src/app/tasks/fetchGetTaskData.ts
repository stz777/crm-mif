import { toast } from "react-toastify";
import { SearchInterface } from "./types";

export default async function fetchGetTaskData(searchParams: SearchInterface) {
    return await fetch(
        `/api/tasks/get`,
        {
            method: "POST",
            body: JSON.stringify(searchParams)
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then((data: any) => {
        if (data.success) {
            return data.tasks;
        } else {
            toast.error("Что-то пошло не так #dmcds8s");
        }
    })
        .catch(_ => {
            toast.error("Что-то пошло не так #chd8y3");
        });
}