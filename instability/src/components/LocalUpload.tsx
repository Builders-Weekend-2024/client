import React, { useState, useEffect } from "react";
import GenerateComponent from "./GenerateComponent";

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
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {selectedFile && <img src={preview} alt="Selected preview" />}
      {preview && <GenerateComponent image={preview} />}
    </div>
  );
};

export default LocalUpload;
