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
  newGroupName = '';
  joinCode = '';
  joinError = '';

  constructor() {
    effect(() => {
      const currentUser = this.currentUser();
      if (currentUser) {
        void this.userService.ensureUserDoc(currentUser.uid, currentUser.displayName ?? '');
        void this.loadGroups(currentUser.uid);
      }
    });
  }

  async createGroup(): Promise<void> {
    const currentUser = this.currentUser();
    if (!currentUser || !this.newGroupName.trim()) {
      return;
    }
    await this.groupService.createGroup(this.newGroupName.trim(), currentUser.uid);
    this.newGroupName = '';
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
    this.groups.set(await this.groupService.getUserGroups(userId));
  }
}
