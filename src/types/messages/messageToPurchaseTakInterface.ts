import { Media, MessageInterface } from "@/app/components/types/messages";

type Adds = {
    attachments: any;
    role: any;
    username: any;
    media: Media[]
}

export type messageToPurchaseTakInterface = MessageInterface & Adds;