import { MessageInterface, Media } from "@/app/components/types/messages";

export type MessageToLead = MessageInterface & {
    username: string;
    role: string;
    attachments: Media[]
};