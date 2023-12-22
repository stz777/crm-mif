import { GenerateWALink } from "../single/[id]/generateWALink";

export default function Phone(props: { phone?: string }) {
    return <div onClick={e => e.stopPropagation()} className="d-inline">
        <GenerateWALink phoneNumber={String(props.phone)} />
    </div>
}