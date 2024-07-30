"use client";
import { createContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFormSchema } from "@/constants/UploadForm.forms";
import { ActiveStateTypes } from "@/types/UploadForm.types";

type FormType = UseFormReturn<z.infer<typeof uploadFormSchema>>;

type UploadContextType = {
  form: FormType;
  previewVideoId: string;
  previewVideoSrc: string;
  previewVideoFile: string;
  videoId: string;
  videoSrc: string;
  videoFile: string;
  activeState: ActiveStateTypes;
  setPreviewVideoId: (previewVideoId: string) => void;
  setPreviewVideoSrc: (previewVideoSrc: string) => void;
  setPreviewVideoFile: (previewVideoFile: string) => void;
  setVideoId: (videoId: string) => void;
  setVideoSrc: (videoSrc: string) => void;
  setVideoFile: (videoFile: string) => void;
  setActiveState: (activeState: ActiveStateTypes) => void;
};

const uploadContextInitialValue = {
  form: {} as UseFormReturn<z.infer<typeof uploadFormSchema>>,
  previewVideoId: "",
  previewVideoSrc: "",
  previewVideoFile: "",
  videoId: "",
  videoSrc: "",
  videoFile: "",
  activeState: "add_details" as ActiveStateTypes,
  setPreviewVideoId: () => { },
  setPreviewVideoSrc: () => { },
  setPreviewVideoFile: () => { },
  setVideoId: () => { },
  setVideoSrc: () => { },
  setVideoFile: () => { },
  setActiveState: () => { },
};

export const UploadContext = createContext<UploadContextType>(
  uploadContextInitialValue
);

export const UploadContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof uploadFormSchema>>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  // Preview Video Details
  // const [previewVideoId, setPreviewVideoId] = useState<string>("video_ph8hytjnub1weqp9xfki21d8m6");
  const [previewVideoId, setPreviewVideoId] = useState<string>("");
  const [previewVideoSrc, setPreviewVideoSrc] = useState<string>("");
  const [previewVideoFile, setPreviewVideoFile] = useState<string>("");

  //Video Details
  // const [videoId, setVideoId] = useState<string>("video_ph8hytjnub1weqp9xfki21d8m6");
  const [videoId, setVideoId] = useState<string>("");
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [videoFile, setVideoFile] = useState<string>("");

  const [activeState, setActiveState] = useState<ActiveStateTypes>(
    "add_details"
  );

  return (
    <UploadContext.Provider
      value={{
        form,
        previewVideoId,
        previewVideoSrc,
        previewVideoFile,
        videoId,
        videoSrc,
        videoFile,
        activeState,
        setPreviewVideoId,
        setPreviewVideoSrc,
        setPreviewVideoFile,
        setVideoId,
        setVideoSrc,
        setVideoFile,
        setActiveState,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
