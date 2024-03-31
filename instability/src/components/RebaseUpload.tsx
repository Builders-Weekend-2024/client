import React, { useState, useEffect } from "react";
import axios from "axios";

const RebaseUpload = ({ setPreview }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [rebaseImages, setRebaseImages] = useState<string[] | null>(null);

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
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="roomId" className="text-center">
          Or Enter Your Rebase Room ID
        </label>
        <input
          type="text"
          name="roomId"
          className="border-white text-black border-2 px-4 py-2 rounded-lg bg-transparent "
        />
        <button
          type="submit"
          className="border-white border-2 px-4 py-2 rounded-lg hover:bg-orange-500 hover:cursor-pointer"
        >
          Submit
        </button>
      </form>
      {rebaseImages && (
        <div className="flex flex-row p-12">
          {rebaseImages?.map((src, i) => {
            return (
              <button
                onClick={() => {
                  setPreview(src);
                }}
                key={i}
              >
                <img src={src} className="h-[100px] w-[100px] mx-2" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RebaseUpload;
