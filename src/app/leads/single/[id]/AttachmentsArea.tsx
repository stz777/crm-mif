"use client"
import { Media } from '@/app/components/types/messages';
import Image from 'next/image';
import { useState } from 'react';


export default function AttachmentsArea({ attachments }: { attachments?: Media[] }) {
    if (!attachments) return null;
    return <>
        {attachments.map(attachment => <div key={attachment.id}>
            <ImageWrapper url={`/images/${attachment.name}`} />
        </div>)}
    </>
}


function ImageWrapper({ url }: { url: string }) {
    const [open, setOpen] = useState(false);
    return <>
        <Image
            loader={() => url}
            src={url}
            alt=""

            width={0}
            height={0}
            style={{
                height: "auto",
                width: "auto",
                maxWidth: open ? "100%" : "100px",
                // marginBottom: 5,
                cursor: "pointer",
            }}
            className='shadow p-3'
            onClick={() => setOpen(!open)}
        />
    </>
}