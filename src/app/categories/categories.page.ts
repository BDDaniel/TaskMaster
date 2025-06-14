import {
  Component, OnInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonIcon,
  IonButton, IonLabel, IonAlert, IonCard, IonCardHeader, IonCardTitle,
  IonActionSheet, AlertController
} from '@ionic/angular/standalone';
import {
  searchOutline, addOutline, alertCircleOutline,
  trashOutline, createOutline
} from 'ionicons/icons';
import { StorageService } from 'src/services/storage.service';
import { ToastService } from 'src/services/toast.service';
import { FirebaseService } from 'src/services/firebase.service';

interface Form {
  name: string;
}

interface Actions {
  add: boolean,
  edit: boolean,
  delete: boolean
}

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.page.html',
  styleUrls: ['../app.component.scss', 'categories.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonIcon,
    IonButton, IonLabel, IonAlert, IonCard, IonCardHeader,
    IonCardTitle, IonActionSheet
  ]
})
export class Categories implements OnInit, OnDestroy {
  form: Form = {} as Form;
  categorySelected = '';
  isOpenActionSheet = false;
  categoriesFiltered: string[] = [];

  private _search = '';
  private _allowedActions: Actions = {
    add: true,
    edit: true,
    delete: true
  };
  private _categories: string[] = [];
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private toastService: ToastService,
    private storageService: StorageService,
    private firebaseService: FirebaseService
  ) {
    addIcons({
      searchOutline,
      addOutline,
      alertCircleOutline,
      trashOutline,
      createOutline
    });
  }

  // Getters y Setters
  get search(): string {
    return this._search;
  }

  set search(value: string) {
    this._search = value;
    this.updateFiltered();
  }

  get categories(): string[] {
    return this._categories;
  }

  set categories(value: string[]) {
    this._categories = value;
    this.updateFiltered();
  }

  get allowedActions(): Actions {
    return this._allowedActions;
  }

  set allowedActions(value: Actions) {
    this._allowedActions = value;
    this.actionSheetButtons = this.actionSheetButtons.filter((action) => {
      const permissionsMap: Record<string, boolean> = {
        'Editar': this.allowedActions.edit,
        'Eliminar': this.allowedActions.delete
      };
      return permissionsMap[action.text];
    })
  }

  // Ciclo de vida
  private async loadFromStorage() {
    const storedRemoteConfig = await this.firebaseService.getRemoteJson<Actions>("actions_categories_page");
    const stored = await this.storageService.get('categories') as string[] ?? [];
    if (storedRemoteConfig) this.allowedActions = storedRemoteConfig;
    this.categories = stored;
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        if ((event).urlAfterRedirects === '/tabs/categories') {
          await this.loadFromStorage();
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  // Búsqueda
  handleSearch(event: any): void {
    this.search = event.detail.value;
  }

  private updateFiltered(): void {
    this.categoriesFiltered = this._search
      ? this._categories.filter(c =>
        c.toLowerCase().includes(this._search.toLowerCase())
      )
      : [...this._categories];

    this.cdr.detectChanges();
  }

  // Action Sheet
  openCategoryActionSheet(category: string): void {
    this.categorySelected = category;
    this.isOpenActionSheet = true;
  }

  closeCategoryActionSheet(): void {
    this.isOpenActionSheet = false;
  }

  // Formularios
  clearForm(mode: 'add' | 'edit'): void {
    this.form = {} as Form;
    const input = document.getElementById(`${mode}-category-name`) as HTMLInputElement;
    if (input) input.value = '';
  }

  loadForm(): void {
    setTimeout(() => {
      if (this.categorySelected) {
        this.form = { name: this.categorySelected };
        const input = document.getElementById('edit-category-name') as HTMLInputElement;
        if (input) input.value = this.categorySelected;
      }
    }, 100);
  }

  // Validación
  private validateCategory(name: string, exclude?: string): string | null {
    if (!name) return '¡El nombre de la categoría es obligatorio!';
    const exists = this.categories.includes(name) && name !== exclude;
    return exists ? '¡El nombre de la categoría ya existe!' : null;
  }

  // Acciones
  async presentAlertEdit(): Promise<void> {
    const alert = await this.alertController.create({
      id: 'category-edit-form',
      header: 'Editar categoría',
      backdropDismiss: false,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Editar',
          handler: () => {
            const error = this.validateCategory(this.form.name, this.categorySelected);
            if (error) {
              this.toastService.presentToast('ERROR', error, 'danger');
              return false;
            }

            const index = this.categories.indexOf(this.categorySelected);
            this.categories[index] = this.form.name;
            this.categories = [...this.categories];
            this.storageService.set('categories', this.categories);
            return true;
          }
        }
      ],
      inputs: [{
        id: 'edit-category-name',
        name: 'name',
        placeholder: 'Nombre',
        attributes: {
          onChange: (e: any) => this.form.name = e.target.value
        }
      }]
    });

    await alert.present();
  }

  async presentAlertDelete(): Promise<void> {
    const alert = await this.alertController.create({
      id: 'category-delete-alert',
      header: 'Eliminar categoría',
      message: '¿Estás seguro que deseas eliminar la categoría?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.categories = this.categories.filter(c => c !== this.categorySelected);
            this.storageService.set('categories', this.categories);
          }
        }
      ]
    });

    await alert.present();
  }

  // Configuración UI
  public actionSheetButtons = [
    {
      text: 'Editar',
      icon: 'create-outline',
      handler: () => {
        this.loadForm();
        this.presentAlertEdit();
      }
    },
    {
      text: 'Eliminar',
      icon: 'trash-outline',
      role: 'destructive',
      handler: () => this.presentAlertDelete()
    }
  ];

  public alertButtons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Crear',
      handler: () => {
        const error = this.validateCategory(this.form.name);
        if (error) {
          this.toastService.presentToast('ERROR', error, 'danger');
          return false;
        }

        this.categories = [...this.categories, this.form.name];
        this.storageService.set('categories', this.categories);
        return true;
      }
    }
  ];

  public alertInputs = [
    {
      id: 'add-category-name',
      name: 'name',
      placeholder: 'Nombre',
      attributes: {
        onChange: (e: any) => this.form.name = e.target.value
      }
    }
  ];
}
