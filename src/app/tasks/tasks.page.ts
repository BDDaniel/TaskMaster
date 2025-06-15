import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonIcon,
  IonButton,
  IonLabel,
  IonAlert,
  IonPopover,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonActionSheet,
  AlertController,
} from '@ionic/angular/standalone';
import {
  searchOutline,
  addOutline,
  alertCircleOutline,
  trashOutline,
  createOutline
} from 'ionicons/icons';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';
import { ToastService } from 'src/services/toast.service';
import { FirebaseService } from 'src/services/firebase.service';

interface Form {
  name: string,
  description: string,
  category: string,
}

export interface Task {
  name: string,
  description: string,
  category: string,
  isChecked: boolean,
}

export interface Actions {
  add: boolean,
  edit: boolean,
  delete: boolean,
}

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['../app.component.scss', 'tasks.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonIcon,
    IonButton,
    IonLabel,
    IonAlert,
    IonPopover,
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonActionSheet,
  ]
})
export class Tasks {
  private routerSubscription!: Subscription;

  form: Form = {} as Form;
  tasksFiltered: Task[] = [];
  taskSelected: Task = {} as Task;
  isOpenActionSheet: boolean = false;
  isOpenAddDropdownCategory: boolean = false;
  isOpenEditDropdownCategory: boolean = false;
  categories: string[] = [];

  private _search: string = '';
  private _allowedActions: Actions = {
    add: true,
    edit: true,
    delete: true
  } as Actions;
  private _tasks: Task[] = [];

  get search(): string {
    return this._search;
  }
  set search(value: string) {
    this._search = value;
    this.updateFiltered();
  }

  get tasks(): Task[] {
    return this._tasks;
  }
  set tasks(value: Task[]) {
    this._tasks = value;
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

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private toastService: ToastService,
    private storageService: StorageService,
    private firebaseService: FirebaseService,
  ) {
    addIcons({
      searchOutline,
      addOutline,
      alertCircleOutline,
      trashOutline,
      createOutline
    });
  }

  private async loadFromStorage() {
    const storedRemoteConfig = await this.firebaseService.getRemoteJson<Actions>("actions_tasks_page");
    const storedCategories = await this.storageService.get('categories') as string[] ?? [];
    const storedTasks = await this.storageService.get('tasks') as Task[] ?? [];
    if (storedRemoteConfig) this.allowedActions = storedRemoteConfig;
    this.categories = storedCategories;
    this.tasks = storedTasks;
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        if ((event).urlAfterRedirects === '/tabs/tasks') {
          await this.loadFromStorage();
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  handleSearch(event: any) {
    this.search = event.detail.value;
  }

  openTaskActionSheet(value: Task) {
    this.isOpenActionSheet = true;
    this.taskSelected = value;
  }

  closeTaskActionSheet() {
    this.isOpenActionSheet = false;
  }

  private updateFiltered() {
    if (this._search) {
      this.tasksFiltered = [...this._tasks.filter(item =>
        item.name.toLowerCase().includes(this._search.toLowerCase())
        || item.category.toLowerCase().includes(this._search.toLowerCase())
      )];
    } else {
      this.tasksFiltered = [...this._tasks];
    }
    this.cdr.detectChanges();
  }

  private validateTask(task: Task, exclude?: Task): string | null {
    if (!task.name) return '¡El nombre de la tarea es obligatorio!';
    if (!task.description) return '¡La descripción de la tarea es obligatoria!';
    if (!task.category) return '¡La categoría de la tarea es obligatoria!';

    const exists = this.tasks.some(t =>
      t.name === task.name &&
      t.category === task.category &&
      (!exclude || t.name !== exclude.name || t.category !== exclude.category)
    );

    return exists ? '¡Ya existe una tarea con ese nombre y categoría!' : null;
  }

  loadSelectCategory(category: string, mode: "add" | "edit") {
    this.form.category = category;
    const input = document.getElementById(mode + "-task-category") as HTMLInputElement;
    if (input) {
      input.value = category;
    }
  }

  loadForm() {
    setTimeout(() => {
      if (this.taskSelected) {
        this.form = {
          ...this.form,
          name: this.taskSelected.name,
          description: this.taskSelected.description,
          category: this.taskSelected.category,
        };
        const nameInputs: string[] = ["name", "description", "category"];
        const inputs = nameInputs.map((name) => document.getElementById("edit-task-" + name) as HTMLInputElement);
        if (inputs.length > 0) {
          inputs.forEach((input: HTMLInputElement, index: number) => {
            input.value = this.taskSelected[nameInputs[index] as "name" | "description" | "category"] ?? '';
          });
        }
      }
    }, 100);
  }

  clearForm(mode: "add" | "edit") {
    this.form = {} as Form;
    const nameInputs = ["name", "description", "category"];
    const inputs = nameInputs.map((name) => document.getElementById(mode + "-task-" + name) as HTMLInputElement);
    if (inputs.length > 0) {
      inputs.forEach((input) => {
        input.value = '';
      });
    }
  }

  async presentAlertDelete() {
    const alert = await this.alertController.create({
      id: 'task-delete-alert',
      header: 'Eliminar tarea',
      message: '¿Estás seguro que deseas eliminar la tarea?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          this.tasks = this.tasks.filter(c => c !== this.taskSelected);
          this.storageService.set('tasks', this.tasks);
        }
      }],
    });

    await alert.present();
  }

  public actionSheetButtons = [
    {
      id: 'task-edit-form',
      text: 'Editar',
      icon: 'create-outline',
      handler: () => {
        this.loadForm();
      }
    },
    {
      text: 'Eliminar',
      icon: 'trash-outline',
      role: 'destructive',
      handler: () => this.presentAlertDelete()
    }
  ];


  public alertButtons = [{
    text: 'Cancelar',
    role: 'cancel',
  },
  {
    text: 'Crear',
    handler: () => {
      const data: Task = { ...this.form, isChecked: false };
      const error = this.validateTask(data);
      if (error) {
        this.toastService.presentToast('ERROR', error, 'danger');
        return false;
      }

      this.tasks = [...this.tasks, data];
      this.storageService.set('tasks', this.tasks);
      return true;
    }
  }];

  public alertButtonsEdit = [{
    text: 'Cancelar',
    role: 'cancel',
  },
  {
    text: 'Editar',
    handler: () => {
      const data: Task = { ...this.form, isChecked: this.taskSelected.isChecked }
      const error = this.validateTask(data, this.taskSelected);
      if (error) {
        this.toastService.presentToast('ERROR', error, 'danger');
        return false;
      }

      const index = this.tasks.indexOf(this.taskSelected);
      this.tasks[index] = data;
      this.tasks = [...this.tasks];
      this.storageService.set('tasks', this.tasks);
      return true;
    }
  }];

  public alertInputs = [
    {
      id: 'add-task-name',
      name: 'name',
      placeholder: 'Nombre',
      attributes: {
        onChange: (e: any) => {
          this.form.name = e.target.value;
        }
      }
    },
    {
      id: 'add-task-description',
      name: 'description',
      type: 'textarea',
      placeholder: 'Descripción',
      attributes: {
        onChange: (e: any) => {
          this.form.description = e.target.value;
        }
      }
    },
    {
      id: 'add-task-category',
      name: 'category',
      placeholder: 'Seleccionar categoría',
      attributes: {
        ["readonly"]: true,
      }
    },
  ];

  public alertInputsEdit = [
    {
      id: 'edit-task-name',
      name: 'name',
      placeholder: 'Nombre',
      attributes: {
        onChange: (e: any) => {
          this.form.name = e.target.value;
        }
      }
    },
    {
      id: 'edit-task-description',
      name: 'description',
      type: 'textarea',
      placeholder: 'Descripción',
      attributes: {
        onChange: (e: any) => {
          this.form.description = e.target.value;
        }
      }
    },
    {
      id: 'edit-task-category',
      name: 'category',
      placeholder: 'Seleccionar categoría',
      attributes: {
        ["readonly"]: true,
      }
    },
  ];
}
