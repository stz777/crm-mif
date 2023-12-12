import { useStore } from "effector-react";
import { useForm } from "react-hook-form";
import { $clients, setClients } from "./store/clientsStore";
import { setComponentState } from "./store/componentState";
import { setSelectedClient } from "./store/selectedClient";
import { useState } from "react";

export default function SearchClient() {
    const { register, setValue } = useForm<any>();
    const clients = useStore($clients);

    const [loading, setLoading] = useState(false);
    const [noClients, setNoClients] = useState(false);
    return <div>
        <div className="text-secondary">
            Поиск клиента
        </div>
        <div>
            <form style={{ maxWidth: "1000px" }}>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">+7</div>
                    </div>
                    <div className="my-2"></div>
                    <input type="text" className="form-control"
                        {...register("phone", {
                            onChange: async (e) => {
                                const newString = formatPhoneNumber(e.target.value);
                                setValue("phone", newString);
                                if (newString.length >= 3) {
                                    setLoading(true);
                                    const clients = await getClientsHints(newString.replace(/[^0-9]/igm, ""));
                                    if (clients.length) {
                                        setClients(clients)
                                        setNoClients(false);
                                    } else {
                                        setNoClients(true);
                                    }
                                    setLoading(false);
                                }
                                return newString;
                            }
                        })}
                        placeholder="000 000 00 00" autoComplete="off" />
                </div>
            </form>
            <div className="mt-3">
                {(() => {

                    if (loading) return <>Загрузка...</>

                    if (clients?.length) return clients.map((client, i) => {
                        const phone = client.meta.find(meta => meta.data_type === "phone")?.data;
                        return <div key={client.id} className={`py-2 ${(clients.length === (i - 1)) ? "border-bottom" : ""}`}>
                            <div className="d-flex justify-content-between align-items-end">
                                <div>
                                    <div className="mb-2"><strong>{client.full_name}</strong></div>
                                    <div>{phone}</div>
                                </div>
                                <div>
                                    <button className="btn btn-primary"
                                        onClick={() => {
                                            setComponentState("client_selected");
                                            setSelectedClient(client);
                                        }}
                                    >Выбрать</button>
                                </div>
                            </div>
                        </div>
                    })
                    if (noClients) return <>
                        <p>Клиент с таким телефоном не найден</p>
                        <button className="btn btn-primary">Создать</button>
                    </>
                })()}
            </div>
        </div>
    </div>
}

function formatPhoneNumber(phone: string) {
    let newStr = "";
    const onlyNumbers = phone.replace(/[^0-9]/igm, "");

    const first = onlyNumbers.slice(0, 3);
    const second = onlyNumbers.slice(3, 6);
    const third = onlyNumbers.slice(6, 8);
    const fourth = onlyNumbers.slice(8, 10);

    if (first.length) newStr += `${first}`;
    if (second.length) newStr += ` ${second}`;
    if (third.length) newStr += ` ${third}`;
    if (fourth.length) newStr += ` ${fourth}`;

    return newStr;
}



async function getClientsHints(phone: string) {
    return fetch("/api/clients/get/by-phone-number", {
        method: "POST",
        body: JSON.stringify({ phone })
    })
        .then(x => x.json())
        .then(x => x.clients)
}
