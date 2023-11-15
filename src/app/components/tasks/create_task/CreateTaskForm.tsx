"use client"

import { useStore } from "effector-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


type FormValues = {
    description: string,
    image: any
};

export default function CreateTaskForm() {
    const { register, handleSubmit, control, reset } = useForm<FormValues>();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <>
        <>
            <button className="btn btn-sm btn-outline-dark"
                onClick={handleShow}
            >Создать задачу</button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Создаем задачу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form
                        onSubmit={handleSubmit(e => onSubmit(e, reset))}
                        style={{ maxWidth: "1000px" }}
                    >
                        <div>
                            <textarea className="form-control" rows={3} placeholder="Описание задачи" {...register(`description`, { required: true })} autoComplete="off" />
                            <input type="file" {...register("image"/* , { required: true } */)} />
                        </div>
                        <button className="btn-btn-sm">Сохранить</button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    </>;
}


const onSubmit = (data: any, resetForm: any) => {

    const formdata = new FormData();

    for (const key in data) {
        const element = data[key];
        if (key === "description") {
            formdata.append("description", element);
            continue;
        }
        // if (key === "emails") {
        //     formdata.append("emails", JSON.stringify(element));
        //     continue;
        // }
        // if (key === "telegram") {
        //     formdata.append("telegram", JSON.stringify(element));
        //     continue;
        // }

        if (key === "image") {
            console.log('image');
            
            for (let i = 0; i < element.length; i++) {
                formdata.append('images', element[i]);
            }
            continue;
        }

        formdata.append(key, element);
    }

    // if (!data?.phones?.length) {
    //     toast.error('Нужно заполнить поле "телефон"');
    //     return;
    // }

    // if (
    //     (data.deadline || data.description || data.sum)
    //     &&
    //     !(data.deadline && data.description && data.sum)
    // ) {
    //     toast.error('Чтобы создать заказ, нужно заполнить все поля');
    //     return;
    // }

    fetch(
        "/api/tasks/create",
        // String(process.env.TASK_MANAGES_URL) + "/api/tasks/create",
        {
            method: "POST",
            body: formdata
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then(data => {
        if (data.success) {
            toast.success("Клиент создан");
            resetForm();
        } else {
            toast.error("Что-то пошло не так " + data.error);
        }
    })
        .catch(error => {
            const statusText = String(error);
            fetch(
                `/api/bugReport`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: {
                            err: "#djvf7d",
                            data: {
                                statusText,
                                values: data
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
                .then(x => {
                    console.log(x);
                })
        })
}