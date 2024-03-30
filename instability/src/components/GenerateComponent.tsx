import { useState, useEffect } from "react";
import axios from "axios";
import Throttle from "../utils/Throttle";
import { toast } from "react-toastify";
import { GenerateImageRequestBody } from "../types";

const typeOfSituation = [
  "Business",
  "Formal",
  "Casual",
  "Romantic",
  "Athletic",
];
const animalType = ["Human", "Animal"];

interface GenerateProps {
  image: string | undefined;
}

interface ObjectForGeneration {
  image: string | undefined;
  animal: string;
  typeOfSituation: string;
}
const GenerateComponent: React.FC<GenerateProps> = ({ image }) => {
  const [textForGeneration, setTextForGeneration] =
    useState<ObjectForGeneration>({
      image: undefined,
      animal: "Human",
      typeOfSituation: "Business",
    });
  const [base64toSend, setBase64ToSend] = useState<string | null>(null);
  const [base64Response, setBase64Response] = useState<string | null>(null);
  const handleGenerateImageThrottle = Throttle(axios.post, 60000);

  useEffect(() => {
    if (image) {
      blobUrlToBase64(image).then((convertedImage) =>
        setBase64ToSend(convertedImage)
      );
    }
    if (base64toSend) {
      updateObjectForGeneration(base64toSend);
    }
  }, [image, base64toSend]);

  useEffect(() => {
    if (base64Response) {
      // Convert base64 to image
      const img = document.createElement("img");
      img.src = "data:image/jpeg;base64," + base64Response;
      document.body.appendChild(img);
    }
  }, [base64Response]);

  function updateObjectForGeneration(newValue: string | Blob) {
    let key: string = "";
    if (typeof newValue === "string") {
      if (typeOfSituation.includes(newValue)) {
        key = "typeOfSituation";
      } else if (animalType.includes(newValue)) {
        key = "animal";
      } else {
        key = "image";
      }
    }

    const newObj = { ...textForGeneration, [key]: newValue };
    setTextForGeneration(newObj);
  }

  async function blobUrlToBase64(blobUrl: string): Promise<string> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]); // Extracting base64 string from data URL
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }

  function clickToUpdateObject(event: React.MouseEvent<HTMLButtonElement>) {
    let buttonText = "";
    const clickText = event.currentTarget.textContent;
    if (typeof clickText === "string") {
      buttonText = clickText;
    }

    updateObjectForGeneration(buttonText);
  }

  async function handleGenerateImage(requestBody: GenerateImageRequestBody) {
    const response = await handleGenerateImageThrottle(
      `${import.meta.env.VITE_BACKEND_URL}/api/images/`,
      requestBody
    );

    if (response === undefined) {
      toast.error("Too many requests. Please try again later.");
      return;
    }

    else if (response.data) {
      setBase64Response(response.data);
      return;
    }
  }

  return (
    <div>
      <div>
        {animalType.map((animal, index) => {
          return (
            <button onClick={clickToUpdateObject} key={index}>
              {animal}
            </button>
          );
        })}
      </div>
      <div>
        {typeOfSituation.map((situation, index) => {
          return (
            <button onClick={clickToUpdateObject} key={index}>
              {situation}
            </button>
          );
        })}
      </div>
      {image && (
        <div>
          <button
            onClick={() => {
              if (
                base64toSend &&
                textForGeneration.animal &&
                textForGeneration.typeOfSituation
              ) {
                handleGenerateImage({
                  image: base64toSend,
                  prompt:
                    textForGeneration.animal +
                    " in " +
                    textForGeneration.typeOfSituation +
                    " clothing",
                  search_prompt: "chair",
                });
              }
            }}
          >
            Generate
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateComponent;
