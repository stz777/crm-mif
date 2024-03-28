"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPen } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CommentEditor(props: { comment: string, taskId: number }) {
    const { register, handleSubmit, control, reset } = useForm<{
        comment: string
    }>({
        defaultValues: {
            comment: props.comment
        }
    });

    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = (values: any) => {
        fetch(
            `/api/tasks/set_comment/${props.taskId}`, {
            method: "POST",
            body: JSON.stringify({ ...values })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                return response.json();
            })
            .then(data => {
                setIsOpen(false);
                return data;
            })
            .catch(error => {
                toast.error('Error #er84j');
                console.error('error #er84j', error);
                return null;
            });
    }

    if (!isOpen) {
        return <>
            <div className="d-flex justify-content-between">
                <div>{props.comment}</div>
                <span className="px-3" style={{ cursor: "pointer" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                ><FaPen /></span>
            </div>
        </>
    } else {
        return <>
            <form onSubmit={handleSubmit(e => onSubmit(e))}>
                <textarea {...register("comment", {
                    value: props.comment,
                })} autoComplete="off" />
                <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-dark mt-2">
                        Cохранить
                    </button>
                    <div className="btn btn-sm btn-outline-dark mt-2"
                        onClick={() => {
                            setIsOpen(false);
                            reset();
                        }}
                    >
                        отмена
                    </div>
                </div>
            </form>
        </>
    }
}