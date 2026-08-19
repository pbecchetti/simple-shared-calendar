import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Group, GroupService } from '../core/services/group.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-groups',
  imports: [FormsModule, RouterLink],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent {
  private auth = inject(Auth);
  private groupService = inject(GroupService);
  private userService = inject(UserService);

  currentUser = toSignal(user(this.auth), { initialValue: undefined });
  groups = signal<Group[]>([]);
  loading = signal(false);
  newGroupName = '';
  newGroupUnavailabilityThreshold = 1;
  joinCode = '';
  joinError = '';
  loadError = signal('');

  constructor() {
    effect(() => {
      const currentUser = this.currentUser();
      if (currentUser) {
        void this.initUser(currentUser.uid, currentUser.displayName ?? '', currentUser.email ?? '');
      }
    });
  }

  private async initUser(userId: string, name: string, email: string): Promise<void> {
    this.loading.set(true);
    try {
      await this.userService.ensureUserDoc(userId, name, email);
    } catch (error) {
      console.error('ensureUserDoc failed', error);
    }
    await this.loadGroups(userId);
  }

  async createGroup(): Promise<void> {
    const currentUser = this.currentUser();
    if (!currentUser || !this.newGroupName.trim() || this.newGroupUnavailabilityThreshold < 1) {
      return;
    }
    await this.groupService.createGroup(
      this.newGroupName.trim(),
      currentUser.uid,
      this.newGroupUnavailabilityThreshold,
    );
    this.newGroupName = '';
    this.newGroupUnavailabilityThreshold = 1;
    await this.loadGroups(currentUser.uid);
  }

  async joinGroup(): Promise<void> {
    const currentUser = this.currentUser();
    if (!currentUser || !this.joinCode.trim()) {
      return;
    }
    this.joinError = '';
    try {
      await this.groupService.joinGroup(this.joinCode.trim().toUpperCase(), currentUser.uid);
      this.joinCode = '';
      await this.loadGroups(currentUser.uid);
    } catch {
      this.joinError = 'Code invalide';
    }
  }

  private async loadGroups(userId: string): Promise<void> {
    try {
      this.loadError.set('');
      this.groups.set(await this.groupService.getUserGroups(userId));
    } catch (error) {
      console.error('loadGroups failed', error);
      this.loadError.set(`Impossible de charger vos groupes : ${(error as Error).message}`);
    } finally {
      this.loading.set(false);
    }
  }
}
