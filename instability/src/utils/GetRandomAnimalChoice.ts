import { Animal } from "../types";

export default function getRandomAnimalChoice(animalArray: Animal[]) {
  const randomIndex = Math.floor(Math.random() * animalArray.length);

  return animalArray[randomIndex].species;
}
