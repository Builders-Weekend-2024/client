import React, { useState, useEffect } from "react";
import GenerateComponent from "./GenerateComponent";
import axios from "axios";

const RebaseUpload = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [rebaseImages, setRebaseImages] = useState<string[] | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (roomId) {
      getRebaseImages(roomId).then((images) => {
        setRebaseImages(images);
      });
    }
  }, [roomId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const inputElement = event.currentTarget.elements.namedItem(
      "roomId"
    ) as HTMLInputElement;
    const newRoomId = inputElement.value;
    setRoomId(newRoomId);
  };

  const getRebaseImages = async (roomId: string): Promise<string[]> => {
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="roomId">Enter Your Rebase Room ID</label>
        <input type="text" name="roomId" />
        <button type="submit">Submit</button>
      </form>
      {rebaseImages && (
        <div className="flex flex-row">
          {rebaseImages?.map((src, i) => {
            return (
              <button
                onClick={() => {
                  setSelectedImg(src);
                }}
                key={i}
              >
                <img src={src} />
              </button>
            );
          })}
        </div>
      )}
      {rebaseImages && <GenerateComponent image={selectedImg} />}
    </div>
  );
};

export default RebaseUpload;
