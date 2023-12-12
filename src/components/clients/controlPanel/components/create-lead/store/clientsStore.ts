import { ClientWithMetaInterface } from "@/app/components/types/clients";
import { createEvent, createStore } from "effector";

type ClientsOrNull = ClientWithMetaInterface[] | null;

export const setClients = createEvent<ClientsOrNull>();
export const $clients = createStore<ClientsOrNull>(null).on(setClients, (_, v) => v);
