import { getProjectById } from "./getProjectById";
import getMessages from "@/app/db/messages/getMessages";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MessageForm from "./messageForm";
import ProjectCloser from "./projectCloser";
import Chat from "@/app/components/chat/chat";
import dayjs from "dayjs";
import { RightsManagement } from "./righsManagement/rightsManagement";
import getEmployeesByProjectId from "@/app/db/employees/getEmployeesByProjectId";
import roleTranslator from "@/app/components/translate/roleTranslator";

export default async function Page({ params }: { params: { id: number } }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");

    const { id } = params;
    const project = await getProjectById(id);
    const messages = await getMessages("project", id);

    const employees = await getEmployeesByProjectId(project.id);


    return <>
        <h1>Проект #{project.id}</h1>
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Детали задачи</h3>
                        </div>
                        <div className="card-body">
                            <table className='table table-bordered w-auto'>
                                <tbody>
                                    <tr><td>Заголовок</td><td>{project.title}</td></tr>
                                    <tr><td>Описание</td><td>{project.comment}</td></tr>
                                    <tr><td>Дедлайн</td><td>{dayjs(project.deadline).format("DD.MM.YYYY")}</td></tr>
                                    <tr><td>Дата создания</td><td>{dayjs(project.created_date).format("DD.MM.YYYY")}</td></tr>
                                    <tr><td>Дата выполнения</td><td>{project.done_at ? dayjs(project.done_at).format("DD.MM.YYYY") : "-"}</td></tr>
                                    <tr><td>Ответственные</td><td>
                                        {!employees ? null : <table className='table'>
                                            <tbody>
                                                {employees.map(employee => <tr key={employee.id}>
                                                    <td>{employee.username}</td>
                                                    <td>{roleTranslator[employee.role]}</td>
                                                </tr>)}
                                            </tbody>
                                        </table>}
                                    </td></tr>
                                    <tr><td>Ответственные</td><td>
                                        <RightsManagement
                                            project_id={project.id}
                                        />
                                    </td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Статус задачи</h3>
                        </div>
                        <div className="card-body">
                            {(() => {
                                if (project.done_at) return <>Задача закрыта</>
                                if (user.is_boss) return <ProjectCloser task_id={project.id} />
                                return <>В работе</>
                            })()}
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h3>Чат</h3>
                        </div>
                        <div className="card-body">
                            <MessageForm project_id={project.id} />
                            <Chat messages={messages} essense_type="project" essense_id={id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
