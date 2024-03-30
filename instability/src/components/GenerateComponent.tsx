import { useState } from "react";

const typeOfSituation = [
  "Business",
  "Formal",
  "Causal",
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
      image: image,
      animal: "Human",
      typeOfSituation: "Business",
    });

  return (
    <div>
      <div>
        {animalType.map((animal) => {
          return <button>{animal}</button>;
        })}
      </div>
      <div>
        {typeOfSituation.map((situation) => {
          return <button>{situation}</button>;
        })}
      </div>
      {image && (
        <div>
          <button>Generate</button>
        </div>
      )}
    </div>
  );
};

export default GenerateComponent;
