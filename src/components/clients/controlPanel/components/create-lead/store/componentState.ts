import { createEvent, createStore } from "effector";

type ComponentStateType = "default" | "client_selected" | "client_not_selected";

export const setComponentState = createEvent<ComponentStateType>();
export const $componentState = createStore<ComponentStateType>("default").on(setComponentState, (_, v) => v);