"use client"

import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import dayjs from "dayjs";
registerLocale('ru', ru);

type FormValues = {
    description: string,
    image: any
    price: number
    deadline: any
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
                            <div className="mb-3">
                                <h5>Описание задачи</h5>
                                <textarea className="form-control" rows={3} {...register(`description`, { required: true })} autoComplete="off" />
                            </div>
                            <div className="mb-3">
                                <h5>Изображение</h5>
                                <input type="file" {...register("image"/* , { required: true } */)} />
                            </div>
                            <div className="mb-3">
                                <h5>Цена</h5>
                                <input {...register("price", { required: true })} />
                            </div>
                            <div className="mb-3">
                                <h5>Дедлайн</h5>
                                <Controller
                                    control={control}
                                    name="deadline"
                                    render={({ field }) => (
                                        <DatePicker
                                            locale="ru"
                                            {...field}
                                            dateFormat="dd.MM.yyyy"
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            placeholderText="выберите дату"
                                            className="form-control"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <button className="btn-btn-sm">Сохранить</button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
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
        if (key === "deadline") {
            formdata.append("deadline", dayjs(element).format("YYYY-MM-DD HH:mm:ss"));
            continue;
        }
        if (key === "image") {
            for (let i = 0; i < element.length; i++) {
                formdata.append('images', element[i]);
            }
            continue;
        }

        formdata.append(key, element);
    }

    fetch(
        "/api/tasks/create",
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