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

/**
 * Servicio para manejar la integración con Firebase.
 * Proporciona funcionalidades para analytics y configuración remota.
 * 
 * @class FirebaseService
 * @description Gestiona la inicialización y operaciones de Firebase en la aplicación.
 */
@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    /** Instancia de la aplicación Firebase */
    public app: FirebaseApp;
    /** Instancia de Analytics de Firebase */
    public analytics: Analytics;
    /** Instancia de Remote Config de Firebase */
    public remoteConfig: RemoteConfig;

    /**
     * Inicializa el servicio de Firebase.
     * Configura la aplicación, analytics y remote config con valores por defecto.
     * 
     * @constructor
     * @throws {Error} Si hay un error al inicializar Firebase
     */
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

    /**
     * Obtiene un valor de la configuración remota.
     * 
     * @param {string} key - La clave del valor a obtener
     * @returns {Promise<string | number | boolean | null>} Una promesa que se resuelve con el valor obtenido
     * @throws {Error} Si hay un error al obtener el valor remoto
     */
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

    /**
     * Obtiene un valor JSON de la configuración remota.
     * 
     * @template T - El tipo de dato esperado
     * @param {string} key - La clave del valor JSON a obtener
     * @returns {Promise<T | null>} Una promesa que se resuelve con el objeto JSON parseado
     * @throws {Error} Si hay un error al obtener o parsear el valor JSON
     */
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
