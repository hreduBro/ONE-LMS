import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LmsDataService } from '../../services/lms-data.service';
import { NavigationLayoutMode, HeaderDensity, ContentWidthMode } from '../../models/lms.model';

@Component({
  selector: 'app-layout-switcher-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-base-100 rounded-2xl border border-base-300 shadow-2xl w-full max-w-xl p-6 animate-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-base-300 mb-5">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-tenant-50 dark:bg-tenant-200/10 flex items-center justify-center text-tenant-600">
              <span class="material-symbols-outlined text-xl">dashboard_customize</span>
            </div>
            <div>
              <h3 class="font-bold text-base text-text-primary">Admin Layout & Navigation Architecture</h3>
              <p class="text-xs text-text-secondary">Configure workspace menu topology and viewport layout</p>
            </div>
          </div>
          <button (click)="close.emit()" class="text-text-secondary hover:text-text-primary p-1 rounded-lg">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="space-y-5">
          <!-- 1. Navigation Mode Selection -->
          <div>
            <label class="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5">
              1. Navigation Structure & Menu Style
            </label>
            <div class="grid grid-cols-3 gap-3">
              <!-- Classic Sidebar -->
              <button
                type="button"
                (click)="setNavigationMode('sidebar')"
                class="p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28"
                [class]="prefs().navigationMode === 'sidebar' 
                  ? 'border-tenant-500 bg-tenant-50/50 dark:bg-tenant-200/10 ring-2 ring-tenant-500/30' 
                  : 'border-base-300 bg-base-200/50 hover:bg-base-200'">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="material-symbols-outlined text-lg" [class.text-tenant-600]="prefs().navigationMode === 'sidebar'">dock_to_left</span>
                    @if (prefs().navigationMode === 'sidebar') {
                      <span class="material-symbols-outlined text-sm text-tenant-600">check_circle</span>
                    }
                  </div>
                  <div class="font-bold text-xs text-text-primary">Classic Sidebar</div>
                  <div class="text-[10px] text-text-secondary leading-tight mt-0.5">Vertical expandable left navigation drawer</div>
                </div>
              </button>

              <!-- Top Menu Bar -->
              <button
                type="button"
                (click)="setNavigationMode('top_menu')"
                class="p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28"
                [class]="prefs().navigationMode === 'top_menu' 
                  ? 'border-tenant-500 bg-tenant-50/50 dark:bg-tenant-200/10 ring-2 ring-tenant-500/30' 
                  : 'border-base-300 bg-base-200/50 hover:bg-base-200'">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="material-symbols-outlined text-lg" [class.text-tenant-600]="prefs().navigationMode === 'top_menu'">horizontal_split</span>
                    @if (prefs().navigationMode === 'top_menu') {
                      <span class="material-symbols-outlined text-sm text-tenant-600">check_circle</span>
                    }
                  </div>
                  <div class="font-bold text-xs text-text-primary">Top Navigation</div>
                  <div class="text-[10px] text-text-secondary leading-tight mt-0.5">Horizontal menu with maximized canvas space</div>
                </div>
              </button>

              <!-- Compact Rail -->
              <button
                type="button"
                (click)="setNavigationMode('compact_rail')"
                class="p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28"
                [class]="prefs().navigationMode === 'compact_rail' 
                  ? 'border-tenant-500 bg-tenant-50/50 dark:bg-tenant-200/10 ring-2 ring-tenant-500/30' 
                  : 'border-base-300 bg-base-200/50 hover:bg-base-200'">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="material-symbols-outlined text-lg" [class.text-tenant-600]="prefs().navigationMode === 'compact_rail'">view_compact</span>
                    @if (prefs().navigationMode === 'compact_rail') {
                      <span class="material-symbols-outlined text-sm text-tenant-600">check_circle</span>
                    }
                  </div>
                  <div class="font-bold text-xs text-text-primary">Compact Rail</div>
                  <div class="text-[10px] text-text-secondary leading-tight mt-0.5">Slim icon sidebar with hover tooltips</div>
                </div>
              </button>
            </div>
          </div>

          <!-- 2. Viewport Density & Container Width -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Header Density
              </label>
              <div class="flex items-center gap-2 bg-base-200 p-1 rounded-xl border border-base-300">
                <button
                  type="button"
                  (click)="setHeaderDensity('comfortable')"
                  class="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all"
                  [class]="prefs().headerDensity === 'comfortable' ? 'bg-base-100 text-tenant-600 shadow-sm font-semibold' : 'text-text-secondary hover:text-text-primary'">
                  Comfortable (64px)
                </button>
                <button
                  type="button"
                  (click)="setHeaderDensity('compact')"
                  class="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all"
                  [class]="prefs().headerDensity === 'compact' ? 'bg-base-100 text-tenant-600 shadow-sm font-semibold' : 'text-text-secondary hover:text-text-primary'">
                  Compact (48px)
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Content Container Width
              </label>
              <div class="flex items-center gap-2 bg-base-200 p-1 rounded-xl border border-base-300">
                <button
                  type="button"
                  (click)="setContentWidth('fluid')"
                  class="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all"
                  [class]="prefs().contentWidth === 'fluid' ? 'bg-base-100 text-tenant-600 shadow-sm font-semibold' : 'text-text-secondary hover:text-text-primary'">
                  Fluid (Full 100%)
                </button>
                <button
                  type="button"
                  (click)="setContentWidth('constrained')"
                  class="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all"
                  [class]="prefs().contentWidth === 'constrained' ? 'bg-base-100 text-tenant-600 shadow-sm font-semibold' : 'text-text-secondary hover:text-text-primary'">
                  Standard (max-w-7xl)
                </button>
              </div>
            </div>
          </div>

          <!-- 3. Toggles: Sticky Header & Breadcrumbs -->
          <div class="grid grid-cols-2 gap-3 pt-2 border-t border-base-300">
            <label class="flex items-center justify-between p-2.5 rounded-xl bg-base-200/60 border border-base-300 cursor-pointer">
              <span class="text-xs font-medium text-text-primary flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-text-secondary">pin</span> Sticky Top Bar
              </span>
              <input 
                type="checkbox" 
                [checked]="prefs().stickyHeader"
                (change)="toggleStickyHeader()"
                class="rounded border-base-300 text-tenant-600 focus:ring-tenant-500 w-4 h-4" />
            </label>

            <label class="flex items-center justify-between p-2.5 rounded-xl bg-base-200/60 border border-base-300 cursor-pointer">
              <span class="text-xs font-medium text-text-primary flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-text-secondary">linear_scale</span> Breadcrumbs Trail
              </span>
              <input 
                type="checkbox" 
                [checked]="prefs().showBreadcrumbs"
                (change)="toggleBreadcrumbs()"
                class="rounded border-base-300 text-tenant-600 focus:ring-tenant-500 w-4 h-4" />
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-5 border-t border-base-300 mt-5">
          <span class="text-[11px] text-text-secondary flex items-center gap-1">
            <span class="material-symbols-outlined text-sm text-tenant-600">verified_user</span>
            Applies to current tenant workspace session
          </span>
          <button 
            type="button" 
            (click)="close.emit()"
            class="px-5 py-2 rounded-xl bg-tenant-500 hover:bg-tenant-600 text-white text-xs font-semibold shadow-sm transition-colors">
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutSwitcherModalComponent {
  lms = inject(LmsDataService);
  close = output<void>();

  prefs = this.lms.adminLayoutPreferences;

  setNavigationMode(mode: NavigationLayoutMode) {
    this.lms.updateLayoutPreferences({ navigationMode: mode });
  }

  setHeaderDensity(density: HeaderDensity) {
    this.lms.updateLayoutPreferences({ headerDensity: density });
  }

  setContentWidth(width: ContentWidthMode) {
    this.lms.updateLayoutPreferences({ contentWidth: width });
  }

  toggleStickyHeader() {
    this.lms.updateLayoutPreferences({ stickyHeader: !this.prefs().stickyHeader });
  }

  toggleBreadcrumbs() {
    this.lms.updateLayoutPreferences({ showBreadcrumbs: !this.prefs().showBreadcrumbs });
  }
}
