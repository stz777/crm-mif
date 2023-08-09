"use client"

import { useForm } from "react-hook-form";

export default function CreateClientForm() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    console.log(watch("example")); // watch input value by passing the name of it

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input defaultValue="test" {...register("example")} />

            <input {...register("exampleRequired", { required: true })} />
            {errors.exampleRequired && <span>This field is required</span>}

            <input type="submit" />
        </form>
    );
}


const onSubmit = (data: any) => {
    console.log(data);
}