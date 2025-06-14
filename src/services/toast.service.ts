import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private toastController: ToastController) { }

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
