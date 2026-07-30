import { Component, computed, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent implements OnInit {
  currentMonth = signal(new Date());
  monthLabel = computed(() => format(this.currentMonth(), 'MMMM yyyy', { locale: fr }));

  public constructor() {}

  ngOnInit(): void {}

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

  onDayClick(dateStr: string) {
    console.log('Clicked', dateStr);
    // Ici tu appelleras unavailabilityService.toggle(user, dateStr)
  }
}
