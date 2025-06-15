// src/app/services/storage.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/**
 * Servicio para manejar el almacenamiento persistente de la aplicación.
 * Utiliza Capacitor Preferences para almacenar datos en el dispositivo.
 * 
 * @class StorageService
 * @description Proporciona métodos para almacenar, recuperar y eliminar datos persistentes.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
    /**
     * Almacena un valor en el almacenamiento persistente.
     * 
     * @param {string} key - La clave bajo la cual se almacenará el valor
     * @param {any} value - El valor a almacenar (será convertido a JSON)
     * @returns {Promise<void>} Una promesa que se resuelve cuando el valor se ha almacenado
     * @throws {Error} Si hay un error al almacenar el valor
     */
    async set(key: string, value: any): Promise<void> {
        await Preferences.set({ key, value: JSON.stringify(value) });
    }

    /**
     * Recupera un valor del almacenamiento persistente.
     * 
     * @template T - El tipo de dato esperado
     * @param {string} key - La clave del valor a recuperar
     * @returns {Promise<T | null>} Una promesa que se resuelve con el valor recuperado o null si no existe
     * @throws {Error} Si hay un error al recuperar el valor o si el JSON es inválido
     */
    async get<T>(key: string): Promise<T | null> {
        const { value } = await Preferences.get({ key });
        return value ? JSON.parse(value) as T : null;
    }

    /**
     * Elimina un valor del almacenamiento persistente.
     * 
     * @param {string} key - La clave del valor a eliminar
     * @returns {Promise<void>} Una promesa que se resuelve cuando el valor se ha eliminado
     * @throws {Error} Si hay un error al eliminar el valor
     */
    async remove(key: string): Promise<void> {
        await Preferences.remove({ key });
    }

    /**
     * Limpia todo el almacenamiento persistente.
     * 
     * @returns {Promise<void>} Una promesa que se resuelve cuando el almacenamiento se ha limpiado
     * @throws {Error} Si hay un error al limpiar el almacenamiento
     */
    async clear(): Promise<void> {
        await Preferences.clear();
    }
}
