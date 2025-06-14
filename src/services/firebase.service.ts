import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import {
    getRemoteConfig,
    RemoteConfig,
    getValue,
    fetchAndActivate
} from 'firebase/remote-config';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    public app: FirebaseApp;
    public analytics: Analytics;
    public remoteConfig: RemoteConfig;

    constructor() {
        this.app = initializeApp(environment.firebase);
        this.analytics = getAnalytics(this.app);
        this.remoteConfig = getRemoteConfig(this.app);

        this.remoteConfig.settings = {
            fetchTimeoutMillis: 60000, //1 minuto
            // minimumFetchIntervalMillis: 3600000, // 1 hora
            minimumFetchIntervalMillis: 0, // modo de desarrollo
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
