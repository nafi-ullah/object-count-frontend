"use client";

import { backendUrl } from '@/utils/constants';
import React, { useState, useRef, Dispatch, SetStateAction } from 'react';

interface FileObject {
    [key: string]: {
      name: string;
      size: number;
      type: string;
      url: string;
      file: File; // Add the file property here
      duration: number;
    };
  }
  
  interface ApiResponse {
    counts: {
      object_count: string[];
      time: string[];
    };
    output_video_path: string;
    original_video: string;
  }

  interface SpinnerProps {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  interface PropsToBeSet {
    setResponse: React.Dispatch<React.SetStateAction<ApiResponse | null>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setTotalDuration: React.Dispatch<React.SetStateAction<number>>;
    setIsGotResponse: React.Dispatch<React.SetStateAction<boolean>>;
  }

const FileUpload: React.FC<PropsToBeSet> = ({ setResponse, setIsLoading, setTotalDuration, setIsGotResponse }) => {
    const [files, setFiles] = useState<FileObject>({});
   // const [response, setResponse] = useState<ApiResponse | null>(null); // State to store the API response
   // const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
    const galleryRef = useRef<HTMLUListElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
          const video = document.createElement('video');
          video.preload = 'metadata';
    
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
          };
    
          video.onerror = () => {
            reject(new Error('Failed to load video duration.'));
          };
    
          video.src = URL.createObjectURL(file);
        });
      };
  
      const addFile = (file: File) => {
        getVideoDuration(file)
          .then((duration) => {
            const objectURL = URL.createObjectURL(file);
            setTotalDuration(duration);
            const newFile = {
              name: file.name,
              size: file.size,
              type: file.type,
              url: objectURL,
              file: file, // Store the actual file object
              duration: duration, // Store the duration of the video
            };
    
            setFiles((prevFiles) => ({ ...prevFiles, [objectURL]: newFile }));
          })
          .catch((error) => {
            console.error('Error getting video duration:', error);
          });
      };
  
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const filesArray = Array.from(e.dataTransfer.files);
      for (const file of filesArray) {
        addFile(file);
      }
      overlayRef.current?.classList.remove("draggedover");
    };
  
    const handleDragOver = (e: React.DragEvent) => {
      if (Array.from(e.dataTransfer.types).includes("Files")) {
        e.preventDefault();
      }
    };
  
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      overlayRef.current?.classList.add("draggedover");
    };
  
    const handleDragLeave = (e: React.DragEvent) => {
      overlayRef.current?.classList.remove("draggedover");
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        for (const file of filesArray) {
          addFile(file);
        }
      }
    };
  
    const handleDelete = (objectURL: string) => {
      setFiles((prevFiles) => {
        const newFiles = { ...prevFiles };
        delete newFiles[objectURL];
        return newFiles;
      });
  
      if (Object.keys(files).length === 1) {
        const empty = document.getElementById("empty");
        if (empty) empty.classList.remove("hidden");
      }
    };
  
    const handleSubmit = async () => {
        setIsLoading(true);
        setIsGotResponse(false);
      const formData = new FormData();
  
      // Get the first file (assuming only one video is uploaded)
      const fileData = Object.values(files)[0];
      if (!fileData || !fileData.file) {
        alert("Please upload a video file before submitting.");
        return;
      }
  
    
  
      // Add the actual file object to FormData
      formData.append("video", fileData.file);
  
      try {
        const response = await fetch(`${backendUrl}/process-video`, {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload video");
        }
  
        const data = await response.json();
        setIsGotResponse(true);
        setResponse(data); // Store API response in state
        setIsLoading(false);
        console.log(data); // Show response in console
        // alert("Video processed successfully");
        
      } catch (error) {
        setIsLoading(false);
        console.error("Error:", error);
        alert("Error processing the video.");
      } finally {
        // Clear loading state
        setIsLoading(false);
      }
    };

  const handleCancel = () => {
    setFiles({});
    const empty = document.getElementById("empty");
    if (empty) empty.classList.remove("hidden");
  };


  return (
    <div className="bg-gray-500 h-full w-full  rounded-lg">
      <main className="container mx-auto max-w-full h-full">
        <article
          aria-label="File Upload Modal"
          className="relative h-full flex flex-col bg-white  rounded-md"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnter={handleDragEnter}
        >
         

          <section className="h-full overflow-auto p-8 w-full flex flex-col">
            <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
              <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                <span>Drag and drop your</span>&nbsp;<span>files anywhere or</span>
              </p>
              <input
                id="hidden-input"
                type="file"
                multiple
                className="hidden"
                ref={hiddenInputRef}
                onChange={handleFileChange}
              />
              <button
                id="button"
                className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                onClick={() => hiddenInputRef.current?.click()}
              >
                Upload a file
              </button>
            </header>

            <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">To Upload</h1>

            <ul id="gallery" className="flex flex-1 flex-wrap -m-1" ref={galleryRef}>
              {Object.keys(files).length === 0 && (
                <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center">
                  <img className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                  <span className="text-small text-gray-500">No files selected</span>
                </li>
              )}
              {Object.values(files).map(file => (
                <li key={file.url} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
                  <article tabIndex={0} className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline relative bg-gray-100 cursor-pointer relative shadow-sm">
                    {file.type.match("image.*") && (
                      <img alt="upload preview" className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" src={file.url} />
                    )}
                    <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                      <h1 className="flex-1 group-hover:text-blue-800">{file.name}</h1>
                      <div className="flex">
                        <span className="p-1 text-blue-800">
                          <i>
                            <svg className="fill-current w-4 h-4 ml-auto pt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                            </svg>
                          </i>
                        </span>
                        <p className="p-1 size text-xs text-gray-700">
                          {file.size > 1024
                            ? file.size > 1048576
                              ? `${Math.round(file.size / 1048576)}mb`
                              : `${Math.round(file.size / 1024)}kb`
                            : `${file.size}b`}
                        </p>
                        <button
                          className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                          onClick={() => handleDelete(file.url)}
                        >
                          <svg className="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                          </svg>
                        </button>
                      </div>
                    </section>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <footer className="flex justify-end px-8 pb-8 pt-4">
            <button
              id="submit"
              className="rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none mr-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              id="cancel"
              className="rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </footer>
        </article>
      </main>
    </div>
  );
};

export default FileUpload;
