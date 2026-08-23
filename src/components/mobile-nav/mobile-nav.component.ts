import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-mobile-nav',
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Bottom Navigation Bar (Visible only on mobile & tablet < md) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-base-100/95 backdrop-blur-lg border-t border-base-300 px-2 py-1.5 shadow-lg safe-area-bottom">
      <div class="flex items-center justify-around">
        
        <!-- 1. Dashboard -->
        <a 
          routerLink="/dashboard"
          routerLinkActive="text-tenant-600 dark:text-tenant-300 font-bold"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl text-text-secondary hover:text-text-primary transition-colors active:scale-95">
          <span class="material-symbols-outlined text-2xl">space_dashboard</span>
          <span class="text-[10px] tracking-tight mt-0.5">Home</span>
        </a>

        <!-- 2. Courses -->
        <a 
          routerLink="/courses"
          routerLinkActive="text-tenant-600 dark:text-tenant-300 font-bold"
          class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl text-text-secondary hover:text-text-primary transition-colors active:scale-95">
          <span class="material-symbols-outlined text-2xl">school</span>
          <span class="text-[10px] tracking-tight mt-0.5">Courses</span>
        </a>

        <!-- 3. Live Virtual Classroom -->
        <a 
          routerLink="/webinars"
          routerLinkActive="text-tenant-600 dark:text-tenant-300 font-bold"
          class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl text-text-secondary hover:text-text-primary transition-colors relative active:scale-95">
          <div class="relative">
            <span class="material-symbols-outlined text-2xl">videocam</span>
            @if (lms.webinars().length > 0) {
              <span class="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            }
          </div>
          <span class="text-[10px] tracking-tight mt-0.5">Live Class</span>
        </a>

        <!-- 4. Multi-Tenant or Analytics (Role-dependent) -->
        @if (lms.activeRole() === 'super_admin' || lms.activeRole() === 'tenant_admin') {
          <a 
            routerLink="/analytics"
            routerLinkActive="text-tenant-600 dark:text-tenant-300 font-bold"
            class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl text-text-secondary hover:text-text-primary transition-colors active:scale-95">
            <span class="material-symbols-outlined text-2xl">analytics</span>
            <span class="text-[10px] tracking-tight mt-0.5">Analytics</span>
          </a>
        } @else {
          <a 
            routerLink="/certificates"
            routerLinkActive="text-tenant-600 dark:text-tenant-300 font-bold"
            class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl text-text-secondary hover:text-text-primary transition-colors active:scale-95">
            <span class="material-symbols-outlined text-2xl">verified</span>
            <span class="text-[10px] tracking-tight mt-0.5">Certificates</span>
          </a>
        }

        <!-- 5. More Menu Drawer Trigger -->
        <button 
          (click)="showMoreDrawer.set(true)"
          class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl text-text-secondary hover:text-text-primary transition-colors active:scale-95">
          <span class="material-symbols-outlined text-2xl">menu</span>
          <span class="text-[10px] tracking-tight mt-0.5">More</span>
        </button>

      </div>
    </nav>

    <!-- Mobile "More" Bottom Sheet Drawer -->
    @if (showMoreDrawer()) {
      <div 
        class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end animate-in fade-in duration-200"
        (click)="showMoreDrawer.set(false)">
        
        <!-- Sheet Container -->
        <div 
          class="bg-base-100 rounded-t-3xl border-t border-base-300 p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250 shadow-2xl"
          (click)="$event.stopPropagation()">
          
          <!-- Drag Handle & Header -->
          <div class="flex items-center justify-between pb-3 border-b border-base-300">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-tenant-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {{ lms.activeTenant().name.substring(0, 1) }}
              </div>
              <div>
                <h3 class="font-bold text-sm text-text-primary">{{ lms.activeTenant().name }}</h3>
                <span class="text-[11px] text-text-secondary">{{ lms.activeUser().name }} ({{ lms.activeRole() }})</span>
              </div>
            </div>
            <button 
              (click)="showMoreDrawer.set(false)" 
              class="w-9 h-9 rounded-xl bg-base-200 hover:bg-base-300 flex items-center justify-center text-text-secondary">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Quick Navigation Links Grid -->
          <div class="grid grid-cols-2 gap-2.5">
            <a 
              routerLink="/tenants" 
              (click)="showMoreDrawer.set(false)"
              class="p-3 rounded-2xl bg-base-200 hover:bg-base-300 border border-base-300/60 flex items-center gap-3 transition-colors">
              <span class="material-symbols-outlined text-tenant-600 text-xl">corporate_fare</span>
              <div class="text-left">
                <span class="font-bold text-xs text-text-primary block">Organizations</span>
                <span class="text-[10px] text-text-secondary block">Directory & switch</span>
              </div>
            </a>

            <a 
              routerLink="/tenants/create" 
              (click)="showMoreDrawer.set(false)"
              class="p-3 rounded-2xl bg-tenant-500/10 hover:bg-tenant-500/20 border border-tenant-500/30 flex items-center gap-3 transition-colors">
              <span class="material-symbols-outlined text-tenant-600 text-xl">domain_add</span>
              <div class="text-left">
                <span class="font-bold text-xs text-text-primary block flex items-center gap-1">
                  Create Org
                  <span class="text-[8px] bg-tenant-500 text-white px-1 py-0.2 rounded font-bold">New</span>
                </span>
                <span class="text-[10px] text-text-secondary block">4-Step Wizard</span>
              </div>
            </a>

            <a 
              routerLink="/users" 
              (click)="showMoreDrawer.set(false)"
              class="p-3 rounded-2xl bg-base-200 hover:bg-base-300 border border-base-300/60 flex items-center gap-3 transition-colors">
              <span class="material-symbols-outlined text-indigo-500 text-xl">groups</span>
              <div class="text-left">
                <span class="font-bold text-xs text-text-primary block">Users & Teams</span>
                <span class="text-[10px] text-text-secondary block">Directory & roles</span>
              </div>
            </a>

            <a 
              routerLink="/certificates" 
              (click)="showMoreDrawer.set(false)"
              class="p-3 rounded-2xl bg-base-200 hover:bg-base-300 border border-base-300/60 flex items-center gap-3 transition-colors">
              <span class="material-symbols-outlined text-amber-500 text-xl">verified</span>
              <div class="text-left">
                <span class="font-bold text-xs text-text-primary block">Certificates</span>
                <span class="text-[10px] text-text-secondary block">Credentials vault</span>
              </div>
            </a>
          </div>

          <!-- Quick Theme & Role Actions -->
          <div class="p-3.5 rounded-2xl bg-base-200/70 border border-base-300 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">palette</span> Appearance
              </span>
              <div class="flex items-center gap-1 bg-base-100 p-1 rounded-xl border border-base-300">
                <button 
                  (click)="themeService.setThemeMode('light')"
                  class="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                  [class]="themeService.themeMode() === 'light' ? 'bg-tenant-500 text-white font-bold' : 'text-text-secondary'">
                  Light
                </button>
                <button 
                  (click)="themeService.setThemeMode('dark')"
                  class="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                  [class]="themeService.themeMode() === 'dark' ? 'bg-tenant-500 text-white font-bold' : 'text-text-secondary'">
                  Dark
                </button>
                <button 
                  (click)="themeService.setThemeMode('system')"
                  class="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                  [class]="themeService.themeMode() === 'system' ? 'bg-tenant-500 text-white font-bold' : 'text-text-secondary'">
                  Auto
                </button>
              </div>
            </div>

            <!-- Role Simulator -->
            <div class="flex items-center justify-between pt-2 border-t border-base-300">
              <span class="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">badge</span> Switch Role
              </span>
              <select 
                [ngModel]="lms.activeRole()"
                (ngModelChange)="lms.setActiveRole($event)"
                class="px-2.5 py-1.5 rounded-xl bg-base-100 border border-base-300 text-xs font-semibold text-text-primary focus:outline-none">
                <option value="super_admin">Super Admin</option>
                <option value="tenant_admin">Tenant Admin</option>
                <option value="instructor">Instructor</option>
                <option value="learner">Learner</option>
              </select>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-2">
            <button 
              type="button" 
              (click)="showMoreDrawer.set(false)"
              class="w-full py-3 rounded-2xl bg-base-200 hover:bg-base-300 text-text-primary text-xs font-bold transition-colors">
              Close Menu
            </button>
          </div>

        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileNavComponent {
  lms = inject(LmsDataService);
  themeService = inject(ThemeService);
  showMoreDrawer = signal<boolean>(false);
}
