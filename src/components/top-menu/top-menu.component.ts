import { Component, ChangeDetectionStrategy, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LmsDataService } from '../../services/lms-data.service';

interface NavChild {
  label: string;
  route: string;
  icon: string;
  badge?: string;
  description?: string;
}

interface NavItem {
  label: string;
  route?: string;
  icon: string;
  roles: string[];
  badge?: string;
  children?: NavChild[];
}

@Component({
  selector: 'app-top-menu',
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-base-100 border-b border-base-300 px-3 sm:px-6 py-1.5 shadow-xs relative z-40 overflow-visible">
      <div class="flex items-center gap-1 sm:gap-1.5 overflow-visible py-0.5">
        @for (item of navItems; track item.label) {
          @if (isAllowed(item.roles)) {
            @if (item.children && item.children.length > 0) {
              <!-- Nested Dropdown Menu Trigger -->
              <div 
                class="relative flex-shrink-0" 
                (mouseenter)="onMouseEnter(item.label)" 
                (mouseleave)="onMouseLeave()">
                <button 
                  type="button"
                  [id]="'top-menu-btn-' + item.label.toLowerCase().replace(' ', '-')"
                  (click)="toggleDropdown(item.label, $event)"
                  [class]="isParentActive(item) 
                    ? 'bg-tenant-50 dark:bg-tenant-500/20 text-tenant-700 dark:text-tenant-200 ring-1 ring-tenant-500/40 font-bold shadow-xs' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-base-200/80 font-medium'"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all select-none group cursor-pointer active:scale-[0.98]">
                  
                  <!-- Active Indicator Dot -->
                  @if (isParentActive(item)) {
                    <span class="w-1.5 h-1.5 rounded-full bg-tenant-500 shadow-xs flex-shrink-0 animate-pulse"></span>
                  }
                  
                  <span class="material-symbols-outlined text-base flex-shrink-0 group-hover:scale-105 transition-transform">{{ item.icon }}</span>
                  <span class="whitespace-nowrap">{{ item.label }}</span>
                  
                  @if (item.badge) {
                    <span class="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider"
                          [class]="isParentActive(item) ? 'bg-tenant-500 text-white' : 'bg-tenant-100 dark:bg-tenant-950/80 text-tenant-700 dark:text-tenant-300'">
                      {{ item.badge }}
                    </span>
                  }
                  
                  <span class="material-symbols-outlined text-sm transition-transform duration-200"
                        [class.rotate-180]="activeDropdown() === item.label">
                    expand_more
                  </span>
                </button>

                <!-- Popover Submenu with continuous mouse hover bridge -->
                @if (activeDropdown() === item.label) {
                  <div 
                    class="absolute left-0 top-full pt-1 w-72 z-50 animate-in fade-in zoom-in-95 duration-100"
                    (mouseenter)="keepDropdownOpen()"
                    (mouseleave)="onMouseLeave()"
                    (click)="$event.stopPropagation()">
                    
                    <div class="bg-base-100 rounded-2xl border border-base-300 shadow-2xl p-2.5 space-y-1">
                      <div class="px-2.5 py-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-base-300/80 mb-1 flex items-center justify-between">
                        <span>{{ item.label }}</span>
                        <span class="text-[9px] font-normal text-text-secondary">Select view</span>
                      </div>

                      <div class="space-y-1">
                        @for (child of item.children; track child.route) {
                          <a 
                            [routerLink]="child.route"
                            (click)="closeDropdown()"
                            routerLinkActive="bg-tenant-500 text-white font-semibold shadow-xs"
                            [routerLinkActiveOptions]="{ exact: true }"
                            #rla="routerLinkActive"
                            class="flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all group cursor-pointer"
                            [class]="rla.isActive ? 'bg-tenant-500 text-white font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-base-200'">
                            
                            <div class="flex items-center gap-2.5 min-w-0">
                              <span class="material-symbols-outlined text-base flex-shrink-0"
                                    [class]="rla.isActive ? 'text-white' : 'text-tenant-600 dark:text-tenant-400 group-hover:scale-105 transition-transform'">
                                {{ child.icon }}
                              </span>
                              <div class="min-w-0">
                                <span class="truncate block font-medium" [class.font-bold]="rla.isActive">{{ child.label }}</span>
                                @if (child.description) {
                                  <span class="text-[10px] block truncate" [class]="rla.isActive ? 'text-white/80' : 'text-text-secondary'">
                                    {{ child.description }}
                                  </span>
                                }
                              </div>
                            </div>

                            <div class="flex items-center gap-1 flex-shrink-0 ml-2">
                              @if (child.badge) {
                                <span class="text-[8px] px-1.5 py-0.2 rounded font-bold uppercase"
                                      [class]="rla.isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'">
                                  {{ child.badge }}
                                </span>
                              }
                              @if (rla.isActive) {
                                <span class="material-symbols-outlined text-sm text-white">check</span>
                              }
                            </div>
                          </a>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- Standard Direct Link Navigation Item -->
              <a 
                [routerLink]="item.route"
                [routerLinkActive]="'bg-tenant-50 dark:bg-tenant-500/20 text-tenant-700 dark:text-tenant-200 ring-1 ring-tenant-500/40 font-bold shadow-xs'"
                [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                #directRla="routerLinkActive"
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all flex-shrink-0 active:scale-[0.98] select-none cursor-pointer"
                [class]="directRla.isActive ? '' : 'text-text-secondary hover:text-text-primary hover:bg-base-200/80 font-medium'">
                
                <!-- Active Indicator Dot -->
                @if (directRla.isActive) {
                  <span class="w-1.5 h-1.5 rounded-full bg-tenant-500 shadow-xs flex-shrink-0 animate-pulse"></span>
                }

                <span class="material-symbols-outlined text-base flex-shrink-0">{{ item.icon }}</span>
                <span class="whitespace-nowrap">{{ item.label }}</span>
                
                @if (item.badge) {
                  <span class="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider"
                        [class]="directRla.isActive ? 'bg-tenant-500 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-200'">
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
  elementRef = inject(ElementRef);
  
  activeDropdown = signal<string | null>(null);
  private hoverTimeout: any = null;

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'space_dashboard', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { 
      label: 'Organizations', 
      route: '/tenants', 
      icon: 'corporate_fare', 
      roles: ['super_admin', 'tenant_admin'], 
      badge: 'Multi',
      children: [
        { label: 'Organization List', route: '/tenants', icon: 'domain', description: 'Browse and switch workspaces' },
        { label: 'Create Organization', route: '/tenants/create', icon: 'domain_add', badge: 'Wizard', description: 'Step-by-step enterprise onboarding' }
      ]
    },
    { 
      label: 'LMS Instances', 
      route: '/lms', 
      icon: 'layers', 
      roles: ['super_admin', 'tenant_admin'],
      children: [
        { label: 'LMS Instances Grid', route: '/lms', icon: 'grid_view', description: 'View organization LMS instances' },
        { label: 'Create LMS', route: '/lms/create', icon: 'add_circle', badge: 'Wizard', description: '4-step LMS creation wizard' }
      ]
    },
    { 
      label: 'Courses & Catalog', 
      route: '/courses', 
      icon: 'school', 
      roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'],
      children: [
        { label: 'Course Directory', route: '/courses', icon: 'auto_stories', description: 'Browse courses, modules & tracks' },
        { label: 'Interactive Player', route: '/courses/c1/learn', icon: 'play_lesson', badge: 'Player', description: 'Resume multimedia training session' }
      ]
    },
    { label: 'Users & Personnel', route: '/users', icon: 'groups', roles: ['super_admin', 'tenant_admin', 'instructor'] },
    { label: 'Compliance & Analytics', route: '/analytics', icon: 'analytics', roles: ['super_admin', 'tenant_admin'] },
    { label: 'Certificates Vault', route: '/certificates', icon: 'verified', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Live Virtual Classrooms', route: '/webinars', icon: 'videocam', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'My Profile', route: '/profile', icon: 'account_circle', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Layout & Branding', route: '/settings', icon: 'palette', roles: ['super_admin', 'tenant_admin'] },
  ];

  constructor() {
    // Auto-close dropdown when route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeDropdown();
    });
  }

  toggleDropdown(label: string, event: MouseEvent) {
    event.stopPropagation();
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    if (this.activeDropdown() === label) {
      this.activeDropdown.set(null);
    } else {
      this.activeDropdown.set(label);
    }
  }

  onMouseEnter(label: string) {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    this.activeDropdown.set(label);
  }

  keepDropdownOpen() {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
  }

  onMouseLeave() {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      this.activeDropdown.set(null);
    }, 200);
  }

  closeDropdown() {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    this.activeDropdown.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.closeDropdown();
  }

  isParentActive(item: NavItem): boolean {
    const currentUrl = this.router.url;
    if (item.route && currentUrl === item.route) return true;
    if (item.children) {
      return item.children.some(child => {
        if (child.route === '/tenants' || child.route === '/courses') {
          return currentUrl === child.route;
        }
        return currentUrl.startsWith(child.route);
      });
    }
    return false;
  }

  isAllowed(roles: string[]): boolean {
    const activeRole = this.lms.activeRole();
    return roles.includes(activeRole);
  }
}


