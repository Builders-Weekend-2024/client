import React, { useState, useEffect } from "react";
import GenerateComponent from "./GenerateComponent";
import RebaseUpload from "./RebaseUpload";

const LocalUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      window.alert("wrong file type!!!!!");
      return;
    }

    setSelectedFile(file);
  };

  return (
    <>
      <section className="flex flex-col gap-6 text-white font-bold justify-center items-center border-white border-2 p-6 rounded-lg">
        <div className="flex flex-row gap-6 justify-center items-center">
          <h1 className="text-xl">1. Choose an Image</h1>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="border-white border-2 px-4 py-2 rounded-lg hover:bg-orange-500 hover:cursor-pointer"
          >
            {selectedFile ? "Change Image" : "Upload Image"}
          </label>
        </div>
        <RebaseUpload setPreview={setPreview} />

        {selectedFile && (
          <div className="flex flex-col gap-6 text-white font-bold justify-center items-center">
            <h2 className="text-xl">Selected Image:</h2>
            <img
              src={preview}
              alt="Selected Preview"
              className="w-[33%] border-white border-2 rounded-lg object-cover"
            />
          </div>
        )}
      </section>

      <GenerateComponent image={preview} />
    </>
  );
};

export default LocalUpload;
