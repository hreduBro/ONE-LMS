import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';

@Component({
  selector: 'app-top-menu',
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-base-100 border-b border-base-300 px-4 lg:px-6 py-2 overflow-x-auto shadow-xs">
      <div class="flex items-center gap-1.5 min-w-max">
        @for (item of navItems; track item.label) {
          @if (isAllowed(item.roles)) {
            @if (item.children) {
              <!-- Dropdown Trigger for Organizations -->
              <div class="relative group">
                <button 
                  type="button"
                  (click)="activeDropdown.set(activeDropdown() === item.label ? null : item.label)"
                  [class]="isRouteActive(item.route, item.children) 
                    ? 'bg-tenant-50 dark:bg-tenant-500/25 text-tenant-700 dark:text-tenant-200 border border-tenant-500/30 font-semibold shadow-xs' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-base-200'"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-[0.98]">
                  <span class="material-symbols-outlined text-base">{{ item.icon }}</span>
                  <span>{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="text-[9px] px-1.5 py-0.2 rounded-full bg-tenant-100 text-tenant-700 dark:bg-tenant-950/80 dark:text-tenant-200 font-semibold">
                      {{ item.badge }}
                    </span>
                  }
                  <span class="material-symbols-outlined text-xs">arrow_drop_down</span>
                </button>

                <!-- Popover Submenu -->
                <div class="absolute left-0 mt-1 w-52 bg-base-100 rounded-2xl border border-base-300 shadow-xl p-1.5 z-50 hidden group-hover:block hover:block animate-in fade-in zoom-in-95 duration-100">
                  <div class="px-2 py-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-base-300 mb-1">
                    {{ item.label }} Management
                  </div>
                  @for (child of item.children; track child.route) {
                    <a 
                      [routerLink]="child.route"
                      routerLinkActive="bg-tenant-500 text-white font-semibold"
                      [routerLinkActiveOptions]="{ exact: true }"
                      class="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-base-200 transition-colors">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">{{ child.icon }}</span>
                        <span>{{ child.label }}</span>
                      </div>
                      @if (child.badge) {
                        <span class="text-[8px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 font-bold uppercase">
                          {{ child.badge }}
                        </span>
                      }
                    </a>
                  }
                </div>
              </div>
            } @else {
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
        }
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuComponent {
  lms = inject(LmsDataService);
  router = inject(Router);
  activeDropdown = signal<string | null>(null);

  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'space_dashboard', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { 
      label: 'Organizations', 
      route: '/tenants', 
      icon: 'corporate_fare', 
      roles: ['super_admin', 'tenant_admin'], 
      badge: 'Multi',
      children: [
        { label: 'Organization List', route: '/tenants', icon: 'domain' },
        { label: 'Create Organization', route: '/tenants/create', icon: 'domain_add', badge: 'Wizard' }
      ]
    },
    { label: 'Courses & Catalog', route: '/courses', icon: 'school', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Users & Personnel', route: '/users', icon: 'groups', roles: ['super_admin', 'tenant_admin', 'instructor'] },
    { label: 'Compliance & Analytics', route: '/analytics', icon: 'analytics', roles: ['super_admin', 'tenant_admin'] },
    { label: 'Certificates Vault', route: '/certificates', icon: 'verified', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Live Virtual Classrooms', route: '/webinars', icon: 'videocam', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Layout & Branding', route: '/settings', icon: 'palette', roles: ['super_admin', 'tenant_admin'] },
  ];

  isRouteActive(route?: string, children?: { route: string }[]): boolean {
    const currentUrl = this.router.url;
    if (route && currentUrl.startsWith(route)) return true;
    if (children) return children.some(c => currentUrl.startsWith(c.route));
    return false;
  }

  isAllowed(roles: string[]): boolean {
    const activeRole = this.lms.activeRole();
    return roles.includes(activeRole);
  }
}

