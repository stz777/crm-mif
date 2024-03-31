import { toast } from "react-toastify";
import { reset } from "./store/modalState";

export default async function onSubmit(data: any) {
  if (!data.phones?.length) {
    toast.error('Нужно заполнить поле "телефон"');
    return;
  } else {
    for (let index = 0; index < data.phones.length; index++) {
      const { phone } = data.phones[index]; //
      const numbers = phone.replace(/[^0-9]/gim, "");
      console.log("phone", [phone, phone.length, numbers, numbers.length]);
      if (numbers.length < 10) {
        toast.error('Нужно корректно заполнить поле "телефон"');
        return;
      }
    }
  }

  const formdata = new FormData();

  for (const key in data) {
    const element = data[key];
    if (key === "phones") {
      const upgradedPhones = element.map((x: any) => ({
        phone: "+7" + x.phone.replace(/[^+0-9]/gim, ""),
      }));
      formdata.append("phones", JSON.stringify(upgradedPhones));
      continue;
    }
    if (key === "emails") {
      formdata.append("emails", JSON.stringify(element));
      continue;
    }
    if (key === "telegram") {
      formdata.append("telegram", JSON.stringify(element));
      continue;
    }
    if (key === "image") {
      for (let i = 0; i < element.length; i++) {
        formdata.append("images", element[i]);
      }
      continue;
    }

    formdata.append(key, element);
  }

  if (!data?.phones?.length) {
    toast.error('Нужно заполнить поле "телефон"');
    return;
  }

  const leadFields = [
    data?.payment,
    data?.sum,
    data?.description,
    data.deadline,
  ];

  const leadFieldsLength = leadFields.length;
  const completedLength = leadFields.filter((x) => x).length;

  if (!(completedLength > 0 && leadFieldsLength)) {
    toast.error('Требуется заполнить все поля оплаты или оставить их пустыми"');
    return;
  }

  fetch("/api/clients/create", {
    method: "POST",
    body: formdata,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((data) => {
      if (data.success) {
        toast.success("Клиент создан");
        setTimeout(() => {
          reset();
        }, 300);
      } else {
        toast.error("Что-то пошло не так " + data.error);
      }
    })
    .catch((error) => {
      const statusText = String(error);
      fetch(`/api/bugReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: {
            err: "#admDcfck3jm",
            data: {
              statusText,
              values: data,
            },
          },
        }),
      })
        .then((x) => x.json())
        .then((x) => {
          console.log(x);
        });
    });
}
