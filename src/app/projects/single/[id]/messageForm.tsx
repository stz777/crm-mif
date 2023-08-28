"use client"
import Image from "next/image"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { FaChevronCircleRight, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
 
export default function MessageForm({ project_id }: { project_id: number }) {

    const [previewImages, setPreviewImages] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue

    } = useForm<Inputs>({
        defaultValues: {
            essense: "lead",
            essense_id: project_id
        }
    })

    const handleImageChange = async (e: any) => {
        setValue("images",e.target.value.files)
        const files = e.target.files;
        const newImages: any = Array.from(previewImages);
        for (let i = 0; i < files.length; i++) {
            const imageBase64 = await new Promise(r => {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = () => {
                    const previewImage = reader.result;
                    r(previewImage);
                };
                reader.readAsDataURL(file);
            });
            newImages.push(imageBase64);
        }
        setPreviewImages(newImages);
    };

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        // reset();
        sendMessage(data);
        reset();
    }
    // essense
    // essense_id
    return (
        <div className="card" >
            <div className="card-body bg-secondary">
                <form className="">
                    <div className="d-flex align-items-end" style={{ maxWidth: "500px" }}>
                        <textarea {...register("text", { required: true })} placeholder="Введите сообщение" className="form-control" />

                        <FaChevronCircleRight onClick={handleSubmit(onSubmit)} size={25} className="ms-2" />
                    </div>
                    <input {...register("essense", { required: true })} className="d-none" />
                    <input {...register("essense_id", { required: true })} className="d-none" />
                    <div className=" mt-3">
                        <input type="file" multiple {...register("images"/* , { required: true } */)}
                            // onChange={handleImageChange}
                        />
                        <div className="d-flex">
                            {previewImages.map((image, index) => (
                                <ImageWrapper key={index} index={index}>
                                    <Image
                                        loader={() => image}
                                        src={image}
                                        alt=""
                                        width={100}
                                        height={0}
                                        style={{
                                            height: "auto",
                                            // marginBottom: 5,
                                            cursor: "pointer",
                                        }}
                                    />
                                </ImageWrapper>
                            ))}
                            {previewImages.length ? <div className="btn btn-sm btn-danger ms-2" onClick={() => {
                                reset({ images: [] });
                                setPreviewImages([]);
                            }}>отмена</div> : null}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}


function ImageWrapper({ children, index }: any) {
    // const [viewDel, setViewDel] = useState(false);
    return <>
        <div
            className="position-relative"
        // onMouseOver={() => {
        //     setViewDel(true);
        // }}
        // onMouseLeave={() => {
        //     setViewDel(false);
        // }}
        >
            {children}
            {/* {viewDel && <div
                className="position-absolute top-0 w-100 h-100 bg-white d-flex justify-content-center align-items-center"
                onClick={() => {
                    console.log('delete', index);

                }}
            >
                <FaTrash color="red" />
            </div>} */}
        </div></>
}


async function sendMessage(data: any) {
    // console.log(data);
    const formdata = new FormData();
    formdata.append("text", data.text);

    formdata.append("essense", data.essense);
    formdata.append("essense_id", data.essense_id);

    const images = data.images;

    for (let i = 0; i < images.length; i++) {
        formdata.append('images', images[i]);
    }

    fetch(
        "/api/messages/send",
        {
            method: "POST",
            body: formdata
        }
    )
        .then(
            response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(response.statusText);
                }
            }
        ).then((data) => {
            if (data.success) {
                toast.success("Сообщение отправлено");
            } else {
                toast.error("Что-то пошло не так");
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
                            err: "#admcMck3jm",
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



type Inputs = {
    text: string
    essense: string
    essense_id: number
    images: any[]
}
