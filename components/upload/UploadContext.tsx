"use client"
import { createContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { uploadFormSchema } from "@/constants/UploadForm.forms";

type UploadContextType = {
    form: any;
    previewVideoId: string;
    previewVideoSrc: string;
    previewVideoFile: string;
    videoId: string;
    videoSrc: string;
    videoFile: string;
    setPreviewVideoId: (previewVideoId: string) => void;
    setPreviewVideoSrc: (previewVideoSrc: string) => void;
    setPreviewVideoFile: (previewVideoFile: string) => void;
    setVideoId: (videoId: string) => void;
    setVideoSrc: (videoSrc: string) => void;
    setVideoFile: (videoFile: string) => void;
}

const uploadContextInitialValue = {
    form: null,
    previewVideoId: '',
    previewVideoSrc: '',
    previewVideoFile: '',
    videoId: '',
    videoSrc: '',
    videoFile: '',
    setPreviewVideoId: () => { },
    setPreviewVideoSrc: () => { },
    setPreviewVideoFile: () => { },
    setVideoId: () => { },
    setVideoSrc: () => { },
    setVideoFile: () => { },
}

export const UploadContext = createContext<UploadContextType>(uploadContextInitialValue);


export const UploadContextProvider = ({ children }: { children: React.ReactNode }) => {

    const form = useForm<z.infer<typeof uploadFormSchema>>({
        resolver: zodResolver(uploadFormSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
    })

    // Preview Video Details
    const [previewVideoId, setPreviewVideoId] = useState<string>('');
    const [previewVideoSrc, setPreviewVideoSrc] = useState<string>('');
    const [previewVideoFile, setPreviewVideoFile] = useState<string>('');


    //Video Details
    const [videoId, setVideoId] = useState<string>('')
    const [videoSrc, setVideoSrc] = useState<string>('')
    const [videoFile, setVideoFile] = useState<string>('');

    return (
        <UploadContext.Provider value={{
            form,
            previewVideoId,
            previewVideoSrc,
            previewVideoFile,
            videoId,
            videoSrc,
            videoFile,
            setPreviewVideoId,
            setPreviewVideoSrc,
            setPreviewVideoFile,
            setVideoId,
            setVideoSrc,
            setVideoFile

        }}>
            {children}
        </UploadContext.Provider>
    )
}