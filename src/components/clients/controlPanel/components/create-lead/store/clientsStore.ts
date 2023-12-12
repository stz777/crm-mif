import { ClientWithMetaInterface } from "@/app/components/types/clients";
import { createEvent, createStore } from "effector";

export const setClients = createEvent<ClientWithMetaInterface[]>();
export const $clients = createStore<ClientWithMetaInterface[]>([]).on(setClients, (_, v) => v);
