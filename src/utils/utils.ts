import { classnamePrio, DetectionClass, detectionClassesDefaultMap } from '@/detectionClasses';
import {
    format,
    isToday,
    Locale
} from 'date-fns';
import { enUS, it } from 'date-fns/locale';
import { sortBy } from 'lodash';
import { AnimalClass, Timezone } from './types';

const localeMap: Record<Timezone, Locale> = {
    [Timezone.IT]: it,
    [Timezone.EN_US]: enUS
}

export const formatTimestamp = (timestamp: number, localeCode: Timezone) => {
    const locale = localeMap[localeCode];

    const date = new Date(timestamp);

    if (isToday(date)) {
        return format(date, 'p', { locale });
    } else {
        return format(date, 'eee d p', { locale });
    }
}

export const labelTranslationMap: Record<string, string> = {
    fire_alarm: 'Fire alarm',
    speech: 'Speech',
    [DetectionClass.Animal]: 'Animal',
    [DetectionClass.Vehicle]: 'Vehicle',
    [DetectionClass.Person]: 'Person',
    [DetectionClass.Face]: 'Face',
    [DetectionClass.Plate]: 'Plate',
    [DetectionClass.Doorbell]: 'Doorbell',
    [DetectionClass.Package]: 'Package',
    [DetectionClass.Audio]: 'Audio',
    [DetectionClass.Motion]: 'Motion',
    [DetectionClass.Sensor]: 'Sensor',
}

export const getLabelText = (label: string) => {
    const value = labelTranslationMap[label];
    return value ?? label;
}

export const classBadgeColorMap: Partial<Record<DetectionClass, string>> = {
    [DetectionClass.Audio]: 'bg-blue-100 text-blue-800',
    [DetectionClass.Face]: 'bg-yellow-100 text-yellow-800',
    [DetectionClass.Plate]: 'bg-green-100 text-green-800',
}

export const getClassBadgeColor = (detectionClass: DetectionClass | AnimalClass) => {
    return classBadgeColorMap[detectionClassesDefaultMap[detectionClass]] ?? 'bg-black-100 text-black-800';
}

export const getRelevantClass = (classes: string[]) => {
    const sortedByPriorityAndScore = sortBy(classes.filter(detClass => detClass !== 'any_object'),
        (className) => [className ? classnamePrio[(detectionClassesDefaultMap[className] ?? className) as DetectionClass] : 100,
            1]
    );

    return sortedByPriorityAndScore[0] as DetectionClass | AnimalClass;
}
