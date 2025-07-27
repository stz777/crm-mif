"use client"

import { createEvent, createStore, createEffect, combine, sample } from 'effector'
import { useStore } from 'effector-react';
import AuthForm from './authForm';
import ConfirmForm from './confirmForm';

export const setAuthStep = createEvent<number>()
export const $authStep = createStore(1).on(setAuthStep, (_, v) => v);

export default function StartAuth() {
    const authStep = useStore($authStep);
    return <AuthForm />
    // if (authStep === 1) {
    //     return
    // }
    // if (authStep === 2) {
    //     return <ConfirmForm />
    // }
    // return <>authStep: {authStep}</>
}