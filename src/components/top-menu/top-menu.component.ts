import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';

@Component({
  selector: 'app-top-menu',
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-base-100 border-b border-base-300 px-4 lg:px-6 py-2 overflow-x-auto shadow-xs">
      <div class="flex items-center gap-1.5 min-w-max">
        @for (item of navItems; track item.route) {
          @if (isAllowed(item.roles)) {
            <a 
              [routerLink]="item.route"
              routerLinkActive="bg-tenant-50 dark:bg-tenant-500/25 text-tenant-700 dark:text-tenant-200 border border-tenant-500/30 font-semibold shadow-xs"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-base-200 transition-all active:scale-[0.98]">
              <span class="material-symbols-outlined text-base">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
              @if (item.badge) {
                <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-200 dark:border dark:border-indigo-800/60 font-semibold">
                  {{ item.badge }}
                </span>
              }
            </a>
          }
        }
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuComponent {
  lms = inject(LmsDataService);

  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'space_dashboard', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Multi-Tenant Hub', route: '/tenants', icon: 'corporate_fare', roles: ['super_admin', 'tenant_admin'], badge: 'Multi' },
    { label: 'Courses & Catalog', route: '/courses', icon: 'school', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Users & Personnel', route: '/users', icon: 'groups', roles: ['super_admin', 'tenant_admin', 'instructor'] },
    { label: 'Compliance & Analytics', route: '/analytics', icon: 'analytics', roles: ['super_admin', 'tenant_admin'] },
    { label: 'Certificates Vault', route: '/certificates', icon: 'verified', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Live Virtual Classrooms', route: '/webinars', icon: 'videocam', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Layout & Branding', route: '/settings', icon: 'palette', roles: ['super_admin', 'tenant_admin'] },
  ];

  isAllowed(roles: string[]): boolean {
    const activeRole = this.lms.activeRole();
    return roles.includes(activeRole);
  }
}
