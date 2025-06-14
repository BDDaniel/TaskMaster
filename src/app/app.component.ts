import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SafeArea } from "capacitor-plugin-safe-area";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() { }

  async ngOnInit() {
    const safeArea = await SafeArea.getSafeAreaInsets();
    document.documentElement.style.setProperty('--safe-area-top', `${safeArea.insets.top}px`);
    document.documentElement.style.setProperty('--safe-area-bottom', `${safeArea.insets.bottom}px`);
    document.documentElement.style.setProperty('--safe-area-left', `${safeArea.insets.left}px`);
    document.documentElement.style.setProperty('--safe-area-right', `${safeArea.insets.right}px`);
  }
}
