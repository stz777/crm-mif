"use client"
import FieldWrapper from "@/app/ui/form/fieldWrapper"
import { useForm, SubmitHandler } from "react-hook-form"
import { FaChevronCircleRight } from "react-icons/fa"
export default function MessageForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset

    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        reset();
        console.log(data)
    }

    return (
        <div className="card" style={{ maxWidth: "500px" }}>
            <div className="card-body bg-secondary">
                <form className="">
                    <div className="d-flex align-items-end">
                        <textarea {...register("message", { required: true })} placeholder="Введите сообщение" className="form-control" />
                        <FaChevronCircleRight onClick={handleSubmit(onSubmit)} size={25} className="ms-2" />
                    </div>
                </form>
            </div>
        </div>
    )
}



type Inputs = {
    message: string
    images: any[]
}
