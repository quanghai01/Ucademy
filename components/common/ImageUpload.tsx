"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/app/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
    allowUrlInput?: boolean;
}

export default function ImageUpload({
    value,
    onChange,
    disabled,
    className,
    allowUrlInput = true,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [urlError, setUrlError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            // Convert to base64 for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange("");
        setUrlInput("");
        setUrlError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUrlSubmit = () => {
        setUrlError("");

        if (!urlInput.trim()) {
            setUrlError("Vui lòng nhập URL ảnh");
            return;
        }

        // Basic URL validation
        try {
            const url = new URL(urlInput);

            if (!["http:", "https:"].includes(url.protocol)) {
                setUrlError("URL phải bắt đầu với http:// hoặc https://");
                return;
            }

            // Try to load the image to validate
            const img = document.createElement("img");
            img.onload = () => {
                onChange(urlInput);
                setUrlError("");
            };
            img.onerror = () => {
                setUrlError("URL không phải là ảnh hợp lệ hoặc không thể tải");
            };
            img.src = urlInput;
        } catch (error) {
            setUrlError("URL không hợp lệ");
        }
    };

    const uploadSection = (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={cn(
                "relative aspect-video w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer",
                isDragging
                    ? "border-primary bg-primary/5 scale-[0.98]"
                    : "border-gray-300 hover:border-primary hover:bg-gray-50",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                    isDragging ? "bg-primary/20" : "bg-gray-100"
                )}>
                    {isDragging ? (
                        <Upload className="w-8 h-8 text-primary animate-bounce" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                </div>
                <div>
                    <p className="font-semibold text-gray-700">
                        {isDragging ? "Thả ảnh vào đây" : "Tải ảnh lên"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Kéo thả hoặc click để chọn ảnh
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        PNG, JPG, GIF, WebP (Tối đa 5MB)
                    </p>
                </div>
            </div>
        </div>
    );

    const urlSection = (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => {
                        setUrlInput(e.target.value);
                        setUrlError("");
                    }}
                    disabled={disabled}
                    className={cn(
                        "flex-1",
                        urlError && "border-red-500 focus-visible:ring-red-500"
                    )}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleUrlSubmit();
                        }
                    }}
                />
                <Button
                    type="button"
                    onClick={handleUrlSubmit}
                    disabled={disabled || !urlInput.trim()}
                    className="gap-2"
                >
                    <Link2 className="w-4 h-4" />
                    Tải ảnh
                </Button>
            </div>
            {urlError && (
                <p className="text-sm text-red-500">{urlError}</p>
            )}
            <div className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                    <Link2 className="w-12 h-12 text-gray-400" />
                    <p className="text-sm text-gray-500">
                        Nhập URL ảnh và nhấn "Tải ảnh"
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className={cn("space-y-4", className)}>
            {value ? (
                <div className="relative group rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors">
                    <div className="relative aspect-video w-full">
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            disabled={disabled}
                            className="gap-2"
                        >
                            <X className="w-4 h-4" />
                            Xóa ảnh
                        </Button>
                    </div>
                </div>
            ) : allowUrlInput ? (
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Upload File
                        </TabsTrigger>
                        <TabsTrigger value="url" className="gap-2">
                            <Link2 className="w-4 h-4" />
                            Nhập URL
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-4">
                        {uploadSection}
                    </TabsContent>
                    <TabsContent value="url" className="mt-4">
                        {urlSection}
                    </TabsContent>
                </Tabs>
            ) : (
                uploadSection
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled}
                className="hidden"
            />
        </div>
    );
}
