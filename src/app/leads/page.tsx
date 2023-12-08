import ControlPanel from "@/components/clients/controlPanel/controlPanel"
import PageTmp from "../ui/tmp/page/PageTmp"

export default function Page() {
    return <>
        <PageTmp text="Заказы">
            <ControlPanel />
        </PageTmp>
    </>
}