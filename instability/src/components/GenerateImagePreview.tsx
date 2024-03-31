import React from "react";

interface GeneratedImagePreviewProps {
  base64Response: string | null; // Base64 encoded image data
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle modal display
}

const GeneratedImagePreview: React.FC<GeneratedImagePreviewProps> = ({
  base64Response,
  setShowModal,
}) => {
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-75 flex-col">
      <div className="max-w-3/4 h-[75%] flex gap-2 flex-col justify-center items-center">
        <p className="text-white font-bold">Your Generated Image</p>
        <img
          src={`data:image/jpeg;base64,${base64Response}`}
          alt="Preview"
          className="max-w-full max-h-full border-white border-2 border-md"
        />
      </div>
      <button
        onClick={closeModal}
        className="absolute top-0 right-0 m-4 text-white"
      >
        X
      </button>
    </div>
  );
};

export default GeneratedImagePreview;
