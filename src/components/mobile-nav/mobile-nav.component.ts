import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LmsDataService } from '../../services/lms-data.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-mobile-nav',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Bottom Navigation Bar (Visible only on mobile & tablet < md) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-base-100/95 backdrop-blur-lg border-t border-base-300 px-2 py-1.5 shadow-lg safe-area-bottom">
      <div class="flex items-center justify-around gap-1">
        
        <!-- 1. Dashboard -->
        <a 
          routerLink="/dashboard"
          routerLinkActive="bg-tenant-500/15 dark:bg-tenant-500/25 text-tenant-700 dark:text-tenant-200 ring-1 ring-tenant-500/40 font-bold"
          [routerLinkActiveOptions]="{ exact: true }"
          #homeRla="routerLinkActive"
          class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl transition-all active:scale-95 flex-1 relative"
          [class]="homeRla.isActive ? '' : 'text-text-secondary hover:text-text-primary hover:bg-base-200/50 font-medium'">
          
          <div class="relative flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">{{ homeRla.isActive ? 'space_dashboard' : 'space_dashboard' }}</span>
            @if (homeRla.isActive) {
              <span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-tenant-500"></span>
            }
          </div>
          <span class="text-[10px] tracking-tight mt-0.5">Home</span>
        </a>

        <!-- 2. Courses -->
        <a 
          routerLink="/courses"
          routerLinkActive="bg-tenant-500/15 dark:bg-tenant-500/25 text-tenant-700 dark:text-tenant-200 ring-1 ring-tenant-500/40 font-bold"
          #coursesRla="routerLinkActive"
          class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl transition-all active:scale-95 flex-1 relative"
          [class]="coursesRla.isActive ? '' : 'text-text-secondary hover:text-text-primary hover:bg-base-200/50 font-medium'">
          
          <div class="relative flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">school</span>
            @if (coursesRla.isActive) {
              <span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-tenant-500"></span>
            }
          </div>
          <span class="text-[10px] tracking-tight mt-0.5">Courses</span>
        </a>

        <!-- 3. Live Virtual Classroom -->
        <a 
          routerLink="/webinars"
          routerLinkActive="bg-tenant-500/15 dark:bg-tenant-500/25 text-tenant-700 dark:text-tenant-200 ring-1 ring-tenant-500/40 font-bold"
          #webinarsRla="routerLinkActive"
          class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl transition-all active:scale-95 flex-1 relative"
          [class]="webinarsRla.isActive ? '' : 'text-text-secondary hover:text-text-primary hover:bg-base-200/50 font-medium'">
          
          <div class="relative flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">videocam</span>
            @if (lms.webinars().length > 0 && !webinarsRla.isActive) {
              <span class="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            }
            @if (webinarsRla.isActive) {
              <span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-tenant-500"></span>
            }
          </div>
          <span class="text-[10px] tracking-tight mt-0.5">Live Class</span>
        </a>

        <!-- 4. Multi-Tenant or Analytics (Role-dependent) -->
        @if (lms.activeRole() === 'super_admin' || lms.activeRole() === 'tenant_admin') {
          <a 
            routerLink="/analytics"
            routerLinkActive="bg-tenant-500/15 dark:bg-tenant-500/25 text-tenant-700 dark:text-tenant-200 ring-1 ring-tenant-500/40 font-bold"
            #analyticsRla="routerLinkActive"
            class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl transition-all active:scale-95 flex-1 relative"
            [class]="analyticsRla.isActive ? '' : 'text-text-secondary hover:text-text-primary hover:bg-base-200/50 font-medium'">
            
            <div class="relative flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">analytics</span>
              @if (analyticsRla.isActive) {
                <span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-tenant-500"></span>
              }
            </div>
            <span class="text-[10px] tracking-tight mt-0.5">Analytics</span>
          </a>
        } @else {
          <a 
            routerLink="/certificates"
            routerLinkActive="bg-tenant-500/15 dark:bg-tenant-500/25 text-tenant-700 dark:text-tenant-200 ring-1 ring-tenant-500/40 font-bold"
            #certsRla="routerLinkActive"
            class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl transition-all active:scale-95 flex-1 relative"
            [class]="certsRla.isActive ? '' : 'text-text-secondary hover:text-text-primary hover:bg-base-200/50 font-medium'">
            
            <div class="relative flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">verified</span>
              @if (certsRla.isActive) {
                <span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-tenant-500"></span>
              }
            </div>
            <span class="text-[10px] tracking-tight mt-0.5">Certificates</span>
          </a>
        }

        <!-- 5. More Menu Drawer Trigger -->
        <button 
          (click)="showMoreDrawer.set(true)"
          class="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-xl text-text-secondary hover:text-text-primary hover:bg-base-200/50 transition-colors active:scale-95 flex-1">
          <span class="material-symbols-outlined text-2xl">menu</span>
          <span class="text-[10px] tracking-tight mt-0.5 font-medium">More</span>
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
          class="bg-base-100 rounded-t-3xl border-t border-base-300 p-5 space-y-4 max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom duration-250 shadow-2xl"
          (click)="$event.stopPropagation()">
          
          <!-- Drag Handle & Header -->
          <div class="flex items-center justify-between pb-3 border-b border-base-300">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-2xl bg-tenant-500 text-white flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0">
                {{ lms.activeTenant().name.substring(0, 1) }}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-sm text-text-primary truncate">{{ lms.activeTenant().name }}</h3>
                <span class="text-[11px] text-text-secondary truncate block">{{ lms.activeUser().name }} ({{ lms.activeRole() }})</span>
              </div>
            </div>
            <button 
              (click)="showMoreDrawer.set(false)" 
              class="w-9 h-9 rounded-xl bg-base-200 hover:bg-base-300 flex items-center justify-center text-text-secondary flex-shrink-0">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Section: Organization Management (Nested Sub-items) -->
          @if (lms.activeRole() === 'super_admin' || lms.activeRole() === 'tenant_admin') {
            <div class="space-y-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Organizations</span>
              <div class="grid grid-cols-2 gap-2.5">
                <a 
                  routerLink="/tenants" 
                  (click)="showMoreDrawer.set(false)"
                  routerLinkActive="bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30"
                  [routerLinkActiveOptions]="{ exact: true }"
                  #orgsRla="routerLinkActive"
                  class="p-3 rounded-2xl border transition-all flex items-center gap-2.5"
                  [class]="orgsRla.isActive ? 'bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30' : 'bg-base-200/70 hover:bg-base-300/70 border-base-300/60'">
                  <span class="material-symbols-outlined text-tenant-600 text-xl flex-shrink-0">corporate_fare</span>
                  <div class="text-left min-w-0 flex-1">
                    <span class="font-bold text-xs text-text-primary block truncate">Org Directory</span>
                    <span class="text-[10px] text-text-secondary block truncate">Browse workspaces</span>
                  </div>
                  @if (orgsRla.isActive) {
                    <span class="material-symbols-outlined text-xs text-tenant-600 dark:text-tenant-300 flex-shrink-0">check_circle</span>
                  }
                </a>

                <a 
                  routerLink="/tenants/create" 
                  (click)="showMoreDrawer.set(false)"
                  routerLinkActive="bg-tenant-500/20 border-tenant-500 ring-1 ring-tenant-500/40"
                  #createOrgRla="routerLinkActive"
                  class="p-3 rounded-2xl border transition-all flex items-center gap-2.5"
                  [class]="createOrgRla.isActive ? 'bg-tenant-500/20 border-tenant-500 ring-1 ring-tenant-500/40' : 'bg-tenant-500/10 hover:bg-tenant-500/20 border-tenant-500/30'">
                  <span class="material-symbols-outlined text-tenant-600 text-xl flex-shrink-0">domain_add</span>
                  <div class="text-left min-w-0 flex-1">
                    <span class="font-bold text-xs text-text-primary flex items-center gap-1">
                      Create Org
                      <span class="text-[8px] bg-tenant-500 text-white px-1 py-0.2 rounded font-bold">Wizard</span>
                    </span>
                    <span class="text-[10px] text-text-secondary block truncate">4-Step setup</span>
                  </div>
                  @if (createOrgRla.isActive) {
                    <span class="material-symbols-outlined text-xs text-tenant-600 dark:text-tenant-300 flex-shrink-0">check_circle</span>
                  }
                </a>
              </div>
            </div>
          }

          <!-- Quick Navigation Links Grid -->
          <div class="space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Workspace Modules</span>
            <div class="grid grid-cols-2 gap-2.5">
              <a 
                routerLink="/users" 
                (click)="showMoreDrawer.set(false)"
                routerLinkActive="bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30"
                #usersRla="routerLinkActive"
                class="p-3 rounded-2xl border transition-all flex items-center gap-3"
                [class]="usersRla.isActive ? 'bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30' : 'bg-base-200/70 hover:bg-base-300/70 border-base-300/60'">
                <span class="material-symbols-outlined text-indigo-500 text-xl flex-shrink-0">groups</span>
                <div class="text-left min-w-0 flex-1">
                  <span class="font-bold text-xs text-text-primary block truncate">Users & Teams</span>
                  <span class="text-[10px] text-text-secondary block truncate">Directory & roles</span>
                </div>
                @if (usersRla.isActive) {
                  <span class="material-symbols-outlined text-xs text-tenant-600 dark:text-tenant-300 flex-shrink-0">check_circle</span>
                }
              </a>

              <a 
                routerLink="/certificates" 
                (click)="showMoreDrawer.set(false)"
                routerLinkActive="bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30"
                #certsMoreRla="routerLinkActive"
                class="p-3 rounded-2xl border transition-all flex items-center gap-3"
                [class]="certsMoreRla.isActive ? 'bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30' : 'bg-base-200/70 hover:bg-base-300/70 border-base-300/60'">
                <span class="material-symbols-outlined text-amber-500 text-xl flex-shrink-0">verified</span>
                <div class="text-left min-w-0 flex-1">
                  <span class="font-bold text-xs text-text-primary block truncate">Certificates</span>
                  <span class="text-[10px] text-text-secondary block truncate">Credentials vault</span>
                </div>
                @if (certsMoreRla.isActive) {
                  <span class="material-symbols-outlined text-xs text-tenant-600 dark:text-tenant-300 flex-shrink-0">check_circle</span>
                }
              </a>

              <a 
                routerLink="/analytics" 
                (click)="showMoreDrawer.set(false)"
                routerLinkActive="bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30"
                #analyticsMoreRla="routerLinkActive"
                class="p-3 rounded-2xl border transition-all flex items-center gap-3"
                [class]="analyticsMoreRla.isActive ? 'bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30' : 'bg-base-200/70 hover:bg-base-300/70 border-base-300/60'">
                <span class="material-symbols-outlined text-emerald-500 text-xl flex-shrink-0">analytics</span>
                <div class="text-left min-w-0 flex-1">
                  <span class="font-bold text-xs text-text-primary block truncate">Analytics</span>
                  <span class="text-[10px] text-text-secondary block truncate">KPIs & reporting</span>
                </div>
                @if (analyticsMoreRla.isActive) {
                  <span class="material-symbols-outlined text-xs text-tenant-600 dark:text-tenant-300 flex-shrink-0">check_circle</span>
                }
              </a>

              <a 
                routerLink="/settings" 
                (click)="showMoreDrawer.set(false)"
                routerLinkActive="bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30"
                #settingsRla="routerLinkActive"
                class="p-3 rounded-2xl border transition-all flex items-center gap-3"
                [class]="settingsRla.isActive ? 'bg-tenant-50 dark:bg-tenant-500/20 border-tenant-500/40 ring-1 ring-tenant-500/30' : 'bg-base-200/70 hover:bg-base-300/70 border-base-300/60'">
                <span class="material-symbols-outlined text-purple-500 text-xl flex-shrink-0">palette</span>
                <div class="text-left min-w-0 flex-1">
                  <span class="font-bold text-xs text-text-primary block truncate">Branding</span>
                  <span class="text-[10px] text-text-secondary block truncate">Theme customizer</span>
                </div>
                @if (settingsRla.isActive) {
                  <span class="material-symbols-outlined text-xs text-tenant-600 dark:text-tenant-300 flex-shrink-0">check_circle</span>
                }
              </a>
            </div>
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
                  [class]="themeService.themeMode() === 'light' ? 'bg-tenant-500 text-white font-bold shadow-xs' : 'text-text-secondary'">
                  Light
                </button>
                <button 
                  (click)="themeService.setThemeMode('dark')"
                  class="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                  [class]="themeService.themeMode() === 'dark' ? 'bg-tenant-500 text-white font-bold shadow-xs' : 'text-text-secondary'">
                  Dark
                </button>
                <button 
                  (click)="themeService.setThemeMode('system')"
                  class="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                  [class]="themeService.themeMode() === 'system' ? 'bg-tenant-500 text-white font-bold shadow-xs' : 'text-text-secondary'">
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
                (ngModelChange)="lms.switchRole($event)"
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

