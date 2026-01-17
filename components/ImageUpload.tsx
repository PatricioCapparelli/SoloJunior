"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove: (url: string) => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {

    if (value) {
        return (
            <div className="relative w-full h-40 bg-slate-100 rounded-md overflow-hidden border border-slate-200 flex items-center justify-center">
                <div className="absolute top-2 right-2 z-10">
                    <button
                        type="button"
                        onClick={() => onRemove(value)}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                        <X size={16} />
                    </button>
                </div>
                <Image
                    src={value}
                    alt="Logo de la empresa"
                    fill
                    className="object-contain p-2"
                />
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-md">
            <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    const url = res[0].url;
                    onChange(url);
                    toast.success("Logo subido correctamente");
                }}
                onUploadError={(error: Error) => {
                    toast.error(`Error al subir: ${error.message}`);
                }}
                appearance={{
                    button: "bg-blue-600 hover:bg-blue-700 text-white",
                    container: "py-8"
                }}
            />
        </div>
    );
}