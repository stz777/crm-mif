import { ClientWithMetaInterface } from "@/app/components/types/clients";
import { createEvent, createStore } from "effector";

type ClientOrNull = ClientWithMetaInterface | null;

export const setSelectedClient = createEvent<ClientOrNull>();
export const $selectedClient = createStore<ClientOrNull>(null).on(setSelectedClient, (_, v) => v);