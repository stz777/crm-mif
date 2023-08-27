import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ProjectInterface } from "@/app/components/types/projects";

interface SearchParametersInterface {
    id?: number
    is_archive?: "true" | boolean
}

export async function getProjectsFn(searchParams
    ?: SearchParametersInterface
): Promise<ProjectInterface[]> {

    const whereArr: string[] = [];

    if (searchParams?.id) {
        whereArr.push(`id = ${searchParams.id}`)
    }
    if (searchParams?.is_archive) {
        whereArr.push(`done_at IS NOT NULL`)
    } else {
        whereArr.push(`done_at IS NULL`)
    }

    const whereString = whereArr.length ? "WHERE " + whereArr.join(" AND ") : "";

    const qs = `SELECT * FROM projects ${whereString}`;

    const projects: ProjectInterface[] = await new Promise(r => {
        pool.query(
            qs,
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#asdkdsa8yT",
                                error: err,
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            }
        )
    });

    return projects;
}
