import { useState, useEffect } from "react";
import axios from "axios";
import Throttle from "../utils/Throttle";
import { toast } from "react-toastify";
import { GenerateImageRequestBody, SituationDetails } from "../types";
import getRandomAnimalChoice from "../utils/GetRandomAnimalChoice";
import data from "../../data/instability.animal.json";
import { MoonLoader } from "react-spinners";
import GeneratedImagePreview from "./GenerateImagePreview";

const SITUATION = ["Business Meeting", "Romantic Date", "Yoga Class"];
const ANIMAL = ["Dog", "Cat"];
const SITUATION_MAPPING: Record<string, SituationDetails> = {
  "Business Meeting": {
    objectToReplace: "chair",
    clothing: "business attire such as a suit and tie",
    additonalPrompt: "with a laptop and coffee mug",
  },
  "Romantic Date": {
    objectToReplace: "table",
    clothing: "formal attire such as a dress or suit",
    additonalPrompt: "with a candlelit dinner",
  },
  "Yoga Class": {
    objectToReplace: "floor",
    clothing: "comfortable yoga attire",
    additonalPrompt: "with a yoga mat",
  },
};

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
  const [generatingImage, setGeneratingImage] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    if (image) {
      if (image.startsWith("data")) {
        setBase64ToSend(image.slice(image.indexOf(",") + 1));
        return;
      } else {
        blobUrlToBase64(image).then((convertedImage) =>
          setBase64ToSend(convertedImage)
        );
      }
    }
    if (base64toSend) {
      updateObjectForGeneration(base64toSend);
    }
  }, [image, base64toSend]);

  useEffect(() => {
    if (base64Response) {
      setShowModal(true);
    }
  }, [base64Response]);

  useEffect(() => {
    console.log(textForGeneration);
  }, [textForGeneration]);

  function updateObjectForGeneration(newValue: string | Blob) {
    let key: string = "";
    if (typeof newValue === "string") {
      if (SITUATION.includes(newValue)) {
        key = "typeOfSituation";
      } else if (ANIMAL.includes(newValue)) {
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
    setGeneratingImage(true);
    const response = await handleGenerateImageThrottle(
      `${import.meta.env.VITE_BACKEND_URL}/api/images/`,
      requestBody
    );

    if (response === undefined) {
      toast.error("Too many requests. Please try again later.");
      setGeneratingImage(false);
      return;
    } else if (response.data) {
      setBase64Response(response.data);
      setGeneratingImage(false);
      return;
    }
  }

  function handleRandomAnimalCick() {
    const randomAnimal = getRandomAnimalChoice(data.animals);

    const newObj = { ...textForGeneration, ["animal"]: randomAnimal };
    setTextForGeneration(newObj);
  }

  function handlePrompts() {
    const noun = textForGeneration.animal;
    const situation = textForGeneration.typeOfSituation;

    const { objectToReplace, clothing, additonalPrompt } =
      SITUATION_MAPPING[situation] || {};

    console.log({
      noun,
      situation,
      objectToReplace,
      clothing,
      additonalPrompt,
    });

    return { noun, situation, objectToReplace, clothing, additonalPrompt };
  }

  return (
    <>
      <section className="flex flex-row gap-6 text-white font-bold justify-center items-center border-white border-2 p-6 rounded-lg">
        <h1 className="text-xl">2. Choose an Animal or Randomize</h1>

        {ANIMAL.map((animal, index) => {
          return (
            <button
              onClick={clickToUpdateObject}
              key={index}
              className={`border-white border-2 px-4 py-2 rounded-lg hover:bg-orange-500 hover:cursor-pointer ${
                textForGeneration.animal === animal ? "bg-orange-500" : ""
              }`}
            >
              {animal}
            </button>
          );
        })}
        <button
          onClick={handleRandomAnimalCick}
          className="border-white border-2 px-4 py-2 rounded-lg hover:bg-orange-500 hover:cursor-pointer"
        >
          Randomize
        </button>
      </section>

      <section className="flex flex-row gap-6 text-white font-bold justify-center items-center border-white border-2 p-6 rounded-lg">
        <h1 className="text-xl">3. Choose a Situation</h1>
        {SITUATION.map((situation, index) => {
          return (
            <button
              className={`border-white border-2 px-4 py-2 rounded-lg hover:bg-orange-500 hover:cursor-pointer ${
                textForGeneration.typeOfSituation === situation
                  ? "bg-orange-500"
                  : ""
              }`}
              onClick={clickToUpdateObject}
              key={index}
            >
              {situation}
            </button>
          );
        })}
      </section>

      {image && (
        <button
          className="border-white border-2 px-4 py-2 rounded-lg hover:bg-orange-500 hover:cursor-pointer text-white font-bold"
          onClick={() => {
            // Move the window to the top of the page
            window.scrollTo(0, 0);

            const {
              noun,
              situation,
              clothing,
              objectToReplace,
              additonalPrompt,
            } = handlePrompts();

            if (base64toSend && noun && situation) {
              handleGenerateImage({
                image: base64toSend,
                prompt: `${noun}s wearing ${clothing} in a ${situation} setting ${additonalPrompt}`,
                search_prompt: objectToReplace,
              });
            }
          }}
        >
          Generate
        </button>
      )}
      {generatingImage && (
        <div className="h-full w-full bg-gray-900 bg-opacity-75 absolute inset-0 z-50 flex justify-center items-center">
          <MoonLoader />
        </div>
      )}
      {showModal && (
        <div className="h-full w-full bg-gray-900 bg-opacity-75 absolute inset-0 z-50 flex justify-center items-center">
          <GeneratedImagePreview
            base64Response={base64Response}
            setShowModal={setShowModal}
          />
        </div>
      )}
    </>
  );
};

export default GenerateComponent;
