import { DetectionClass, detectionClassesDefaultMap } from "@/detectionClasses";
import {
  AudioLines,
  Bell,
  CarFront,
  CarIcon,
  Cat,
  Dog,
  Feather,
  Package,
  PawPrint,
  PersonStanding,
  ScanFace,
  Wind,
  DoorOpen,
} from "lucide-react";
import { AnimalClass } from "./types";

export const DetectionClassIcon = (props: {
  detectionClass: DetectionClass | AnimalClass;
  small?: boolean;
}) => {
  const { detectionClass, small } = props;
  const size = small ? "16" : undefined;

  const findIcon = (detClass: string) => {
    switch (detClass) {
      case DetectionClass.Animal:
        return <PawPrint size={size} />;
      case DetectionClass.Person:
        return <PersonStanding size={size} />;
      case DetectionClass.Vehicle:
        return <CarIcon size={size} />;
      case DetectionClass.Audio:
        return <AudioLines size={size} />;
      case DetectionClass.Motion:
        return <Wind size={size} />;
      case DetectionClass.Face:
        return <ScanFace size={size} />;
      case DetectionClass.Plate:
        return <CarFront size={size} />;
      case DetectionClass.Package:
        return <Package size={size} />;
      case DetectionClass.Doorbell:
        return <Bell size={size} />;
      case DetectionClass.Sensor:
        return <DoorOpen size={size} />;
      case AnimalClass.Dog:
        return <Dog size={size} />;
      case AnimalClass.Cat:
        return <Cat size={size} />;
      case AnimalClass.Horse:
        return <PawPrint size={size} />;
      case AnimalClass.Bird:
        return <Feather size={size} />;
    }
  };

  return (
    findIcon(detectionClass) ??
    findIcon(detectionClassesDefaultMap[detectionClass])
  );
};
