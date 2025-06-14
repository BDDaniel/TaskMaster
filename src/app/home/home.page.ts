import { ChangeDetectorRef, Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox
} from '@ionic/angular/standalone';
import {
  checkmarkDoneCircleOutline,
  searchOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';
import { filter, Subscription } from 'rxjs';
import { Task } from '../tasks/tasks.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['../app.component.scss', 'home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
    IonInput,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox
  ],
})
export class Home {
  private routerSubscription!: Subscription;

  tasksFiltered: Task[] = [];
  categories: string[] = [];

  private _search: string = '';
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

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private storageService: StorageService,
  ) {
    addIcons({
      checkmarkDoneCircleOutline,
      searchOutline,
      alertCircleOutline
    });
  }

  private async loadFromStorage() {
    const storedCategories = await this.storageService.get('categories') as string[] ?? [];
    const storedTasks = await this.storageService.get('tasks') as Task[] ?? [];
    this.categories = storedCategories;
    this.tasks = storedTasks;
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        if ((event as NavigationEnd).urlAfterRedirects === '/tabs/home') {
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

  handleCheckbox(task: Task, event: any) {
    const data: Task = { ...task, isChecked: event.detail.checked }
    const index = this.tasks.indexOf(task);

    this.tasks[index] = data;
    this.tasks = [...this.tasks];
    this.storageService.set('tasks', this.tasks);
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

  hasTasksForCategory(category: string): boolean {
    return this.tasksFiltered.some(task => task.category === category);
  }

  getTasksByCategory(category: string) {
    return this.tasksFiltered.filter(task => task.category === category);
  }

}
