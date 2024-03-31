import React from "react";

interface GeneratedImagePreviewProps {
  base64Response: string; // Base64 encoded image data
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
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="max-w-3/4 h-auto">
        <img
          src={`data:image/jpeg;base64,${base64Response}`}
          alt="Preview"
          className="max-w-full max-h-full"
        />
      </div>
      <button
        onClick={closeModal}
        className="absolute top-0 right-0 m-4 text-white"
      >
        Close
      </button>
    </div>
  );
};

export default GeneratedImagePreview;
