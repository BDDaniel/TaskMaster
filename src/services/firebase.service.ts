import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import {
    getRemoteConfig,
    RemoteConfig,
    getValue,
    fetchAndActivate
} from 'firebase/remote-config';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private firebaseConfig = {
        apiKey: 'AIzaSyBaa0wUE5FLLvHSfGeJbah1zJnIN7a1g0E',
        authDomain: 'task-master-e1c2a.firebaseapp.com',
        projectId: 'task-master-e1c2a',
        storageBucket: 'task-master-e1c2a.firebasestorage.app',
        messagingSenderId: '581396721940',
        appId: '1:581396721940:web:50667b6202299e091bd201',
        measurementId: 'G-ZKVWTKJHX6',
    };

    public app: FirebaseApp;
    public analytics: Analytics;
    public remoteConfig: RemoteConfig;

    constructor() {
        this.app = initializeApp(this.firebaseConfig);
        this.analytics = getAnalytics(this.app);
        this.remoteConfig = getRemoteConfig(this.app);

        // Configuración opcional para desarrollo
        this.remoteConfig.settings = {
            fetchTimeoutMillis: 60000, //1 minuto
            minimumFetchIntervalMillis: 0, // 1 hora
        };

        this.remoteConfig.defaultConfig = {
            actions_tasks_page: JSON.stringify({
                add: true,
                edit: true,
                delete: true,
            }),
            actions_categories_page: JSON.stringify({
                add: true,
                edit: true,
                delete: true
            }),
        };
    }

    // Método para obtener un valor remoto (después de fetchAndActivate)
    public async getRemoteValue(key: string): Promise<string | number | boolean | null> {
        try {
            await fetchAndActivate(this.remoteConfig);

            const value = getValue(this.remoteConfig, key);
            return value.asString();
        } catch (error) {
            console.error('Error fetching remote config:', error);
            return '';
        }
    }

    public async getRemoteJson<T = any>(key: string): Promise<T | null> {
        try {
            await fetchAndActivate(this.remoteConfig);
            const value = getValue(this.remoteConfig, key).asString();

            return JSON.parse(value);
        } catch (error) {
            console.error('Error fetching remote config:', error);
            return null;
        }
    }
}
