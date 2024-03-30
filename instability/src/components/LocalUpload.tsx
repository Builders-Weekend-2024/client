import React, { useState, useEffect } from "react";
import GenerateComponent from "./GenerateComponent";
import axios from "axios";

const LocalUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [rebaseImages, setRebaseImages] = useState<string[] | null>(null);

  useEffect(() => {
    if (!selectedFile || rebaseImages) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (roomId) {
      ImageSourcesFromScraper(roomId).then((sources) => {
        setRebaseImages(sources);
      });
    }
  }, [roomId]);

  useEffect(() => {
    console.log(rebaseImages);
  }, [rebaseImages]);

  const ImageSourcesFromScraper = async (roomId: string): Promise<string[]> => {
    try {
      // Make a POST request to the backend with the room ID
      const response = await axios.post<string[]>(
        "http://localhost:4000/api/rebase/", // Replace with your backend URL
        { roomId }
      );

      // Extract image sources from the response data
      const imageSources: string[] = response.data;

      return imageSources;
    } catch (error) {
      // Handle errors
      console.error("Error fetching image sources:", error);
      throw error;
    }
  };

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

  const enterTheRoomID = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const inputElement = event.currentTarget.elements.namedItem(
      "roomId"
    ) as HTMLInputElement;
    const newRoomId = inputElement.value;
    setRoomId(newRoomId);
  };

  return (
    <div>
      <form onSubmit={enterTheRoomID}>
        <input type="text" name="roomId" />
        <button type="submit">Submit</button>
      </form>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {selectedFile && <img src={preview} alt="Selected preview" />}
      <GenerateComponent image={preview} />
    </div>
  );
};

export default LocalUpload;
