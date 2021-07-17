const BaseStorage = {
    get<T>(storage: Storage, key: string, defaultValue: T): T {
        const value = storage.getItem(key);
        if (value === null) {
            return defaultValue;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            return defaultValue;
        }
    },
    set<T>(storage: Storage, key: string, value: T) {
        storage.setItem(key, JSON.stringify(value));
    },
    clear(storage: Storage, key: string) {
        storage.removeItem(key);
    },
    clearAll(storage: Storage) {
        storage.clear();
    },
};

export const LocalStorage = {
    get<T>(key: string, defaultValue: T): T {
        return BaseStorage.get(localStorage, key, defaultValue);
    },
    set<T>(key: string, value: T): void {
        BaseStorage.set(localStorage, key, value);
    },
    clear(key: string): void {
        BaseStorage.clear(localStorage, key);
    },
    clearAll(): void {
        BaseStorage.clearAll(localStorage);
    },
};

export const SessionStorage = {
    get<T>(key: string, defaultValue: T): T {
        return BaseStorage.get(sessionStorage, key, defaultValue);
    },
    set<T>(key: string, value: T): void {
        BaseStorage.set(sessionStorage, key, value);
    },
    clear(key: string): void {
        BaseStorage.clear(sessionStorage, key);
    },
    clearAll(): void {
        BaseStorage.clearAll(sessionStorage);
    },
};
