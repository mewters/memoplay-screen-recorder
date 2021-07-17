import { useState } from 'react';
import { LocalStorage } from '../services/StorageService';

type useLocalStorageResponse<T> = [T, (newValue: T) => void, () => void];

export default function useLocalStorage<T>(
    name: string,
    defaultValue: T
): useLocalStorageResponse<T> {
    const [value, setValue] = useState<T>(
        LocalStorage.get<T>(name, defaultValue)
    );

    function updateValue(newValue: T) {
        LocalStorage.set(name, newValue);
        setValue(newValue);
    }

    function clearValue() {
        LocalStorage.clear(name);
        setValue(defaultValue);
    }

    return [value, updateValue, clearValue];
}
