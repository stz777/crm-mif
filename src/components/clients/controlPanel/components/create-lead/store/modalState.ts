import { createEvent, createStore } from "effector";
import { setClients } from "./clientsStore";
import { setInsertedPhone } from "./insertedPhone";
import { setSelectedClient } from "./selectedClient";
import { setComponentState } from "./componentState";

export const setModalIsOpen = createEvent<boolean>();
export const $modalIsOpen = createStore<boolean>(false)
    .on(setModalIsOpen, (_, v) => v);

export function reset() {
    setModalIsOpen(false);
}

$modalIsOpen.watch((isOpen) => {
    if (!isOpen) {
        setClients(null);
        setInsertedPhone("");
        setSelectedClient(null);
        setComponentState("default");
    }
});