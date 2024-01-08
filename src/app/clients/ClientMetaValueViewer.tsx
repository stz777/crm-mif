import Phone from "../leads/get/Phone"

export default function ClientMetaValueViewer(props: { type: string, data: string }) {
    if (props.type === "phone") return <Phone phone={props.data} />
    return props.data;
}
