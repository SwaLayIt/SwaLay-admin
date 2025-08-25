"use client";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDropzone } from "react-dropzone";
import { apiFormData } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";

const platforms = [
  "amazonmusic",
  "appleMusic",
  "facebook",
  "ganna",
  "jiosavan",
  "spotify",
  "tiktok",
  "youtube",
];

const Page = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlatform || !selectedMonth || files.length === 0) {
      alert("Please fill all fields and upload an Excel file.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("platform", selectedPlatform);
    formData.append("month", selectedMonth);
    formData.append("file", files[0]);

    try {
      toast.loading("Uploading data...");
      const res: any = await apiFormData("/api/royalty/upload-data", formData);
      toast.success(res.message || "Uploaded successfully!");
      setFiles([]);
      setSelectedPlatform("");
      setSelectedMonth("");
    } catch (err: any) {
      toast.error(err.message || "Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="w-full h-full p-6 bg-white rounded-sm"
      style={{ minHeight: "90vh" }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Payments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 text-blue-500">
          Upload Royalty Data
        </h3>
      </div>

      {isUploading && (
        <div
          className="mt-4 flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
          role="alert"
        >
          <svg
            className="shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Dont Reload the Page!</span> Large
            filed take times to upload. dont reload the page.
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded shadow  mt-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Platform Select */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Platform</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              required
            >
              <option value="">Select Platform</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          {/* Month/Year Picker */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Month & Year</label>
            <input
              type="month"
              className="w-full border rounded px-2 py-1"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              required
            />
          </div>

          {/* Excel Sheet Upload */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Excel Sheet</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded px-4 py-6 text-center cursor-pointer ${
                isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {files.length > 0 ? (
                <span>{files[0].name}</span>
              ) : (
                <span>Drag & drop Excel file here, or click to select</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
