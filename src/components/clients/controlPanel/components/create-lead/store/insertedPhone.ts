import { createEvent, createStore } from "effector";

export const setInsertedPhone = createEvent<string>();
export const $insertedPhone = createStore("").on(setInsertedPhone, (_, v) => v);