import { ClientInterface } from "../components/types/clients";
import Phone from "../leads/get/Phone";
import ClientLeads from "./ClientLeads";
import Wrapper from "./wrapper";

export default function ClientDetails(props: { client: ClientInterface }) {
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3">Данные клиента</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.client.id}</span>
        </div>
        <div className="px-4">
            <Wrapper title="Наименование">
                {props.client.full_name}
            </Wrapper>
            <Wrapper title="Телефон">
                {
                    props.client.meta.filter(item => item.data_type === "phone").map((item, i) => <div key={item.id}>
                        {i > 0 && <div className="mt-2"></div>}
                        <Phone phone={item.data} />
                    </div>)
                }
            </Wrapper>
            <Wrapper title="Email">
                {
                    props.client.meta.filter(item => item.data_type === "email").map((item, i) => <div key={item.id}>
                        {i > 0 && <div className="mt-2"></div>}
                        {item.data}
                    </div>)
                }
            </Wrapper>
            <Wrapper title="Telegram">
                {
                    props.client.meta.filter(item => item.data_type === "telegram").map((item, i) => <div key={item.id}>
                        {i > 0 && <div className="mt-2"></div>}
                        {item.data}
                    </div>)
                }
            </Wrapper>
            <Wrapper title="Адрес">
                {props.client.address}
            </Wrapper>
            <div className="my-5"></div>
            <h5>Заказы</h5>
            <ClientLeads client_id={props.client.id} />
        </div>
    </>
}