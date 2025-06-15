import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

/**
 * Servicio para mostrar notificaciones toast en la aplicación.
 * Proporciona una interfaz unificada para mostrar mensajes al usuario.
 * 
 * @class ToastService
 * @description Gestiona la presentación de notificaciones toast en la aplicación.
 */
@Injectable({
    providedIn: 'root',
})
export class ToastService {
    /**
     * Inicializa el servicio de Toast.
     * 
     * @constructor
     * @param {ToastController} toastController - El controlador de toast de Ionic
     */
    constructor(private toastController: ToastController) { }

    /**
     * Muestra una notificación toast.
     * 
     * @param {string} header - El encabezado del toast
     * @param {string} message - El mensaje a mostrar
     * @param {('danger'|'dark'|'light'|'medium'|'primary'|'secondary'|'success'|'tertiary'|'warning'|string)} color - El color del toast
     * @param {number} [duration=3000] - La duración en milisegundos que se mostrará el toast
     * @returns {Promise<void>} Una promesa que se resuelve cuando el toast se ha mostrado
     * @throws {Error} Si hay un error al mostrar el toast
     */
    async presentToast(
        header: string,
        message: string,
        color: 'danger' | 'dark' | 'light' | 'medium' | 'primary' | 'secondary' | 'success' | 'tertiary' | 'warning' | string | undefined,
        duration: number = 3000
    ) {
        const toast = await this.toastController.create({
            header: header,
            message: message,
            duration: duration,
            position: 'top',
            positionAnchor: 'header',
            color: color,
        });

        await toast.present();
    }
}
