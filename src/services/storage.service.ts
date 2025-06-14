// src/app/services/storage.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
    async set(key: string, value: any): Promise<void> {
        await Storage.set({ key, value: JSON.stringify(value) });
    }

    async get<T>(key: string): Promise<T | null> {
        const { value } = await Storage.get({ key });
        return value ? JSON.parse(value) as T : null;
    }

    async remove(key: string): Promise<void> {
        await Storage.remove({ key });
    }

    async clear(): Promise<void> {
        await Storage.clear();
    }
}
