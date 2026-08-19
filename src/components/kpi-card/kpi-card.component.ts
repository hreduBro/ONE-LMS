import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kpi } from '../../models/dashboard.model';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  data = input.required<Kpi>();

  isPositiveChange = computed(() => this.data().change.startsWith('+'));

  iconMap: Record<string, string> = {
    users: 'group',
    activity: 'trending_up',
    message: 'forum',
    server: 'dns',
    dollar: 'payments',
    zap: 'bolt',
    school: 'school',
    badge: 'military_tech',
    building: 'corporate_fare',
    shield: 'verified_user',
    check: 'task_alt',
    trending: 'monitoring'
  };
}
