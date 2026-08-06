import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { UnavailabilityService } from '../core/services/unavailability.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent {
  groupId = input.required<string>();

  private auth = inject(Auth);
  private unavailabilityService = inject(UnavailabilityService);
  private currentUser = toSignal(user(this.auth), { initialValue: undefined });

  currentMonth = signal(new Date());
  monthLabel = computed(() => format(this.currentMonth(), 'MMMM yyyy', { locale: fr }));

  daysInGrid = computed(() => {
    const monthStart = startOfMonth(this.currentMonth());
    const monthEnd = endOfMonth(this.currentMonth());
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // recule jusqu'au lundi
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 }); // avance jusqu'au dimanche

    const days = [];
    let day = gridStart;
    while (day <= gridEnd) {
      days.push({
        date: day,
        dateStr: format(day, 'yyyy-MM-dd'),
        dayNumber: format(day, 'd'),
        isCurrentMonth: isSameMonth(day, this.currentMonth()),
        isToday: isToday(day),
      });
      day = addDays(day, 1);
    }
    return days;
  });

  prevMonth() {
    this.currentMonth.update((d) => subMonths(d, 1));
  }

  nextMonth() {
    this.currentMonth.update((d) => addMonths(d, 1));
  }

  async onDayClick(dateStr: string) {
    const uid = this.currentUser()?.uid;
    if (!uid) {
      return;
    }
    await this.unavailabilityService.toggle(this.groupId(), uid, dateStr);
    const unavailableUserIds = await this.unavailabilityService.getUnavailableUserIds(
      this.groupId(),
      dateStr,
    );
    console.log('Unavailable users for', dateStr, unavailableUserIds);
  }
}
