import { Component, ChangeDetectionStrategy, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';
import { LmsApiService } from '../../services/lms-api.service';
import { ThemeService } from '../../services/theme.service';
import { UserRole } from '../../models/lms.model';
import { LayoutSwitcherModalComponent } from '../layout-switcher-modal/layout-switcher-modal.component';
import { BackendConsoleModalComponent } from '../backend-console-modal/backend-console-modal.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterModule, LayoutSwitcherModalComponent, BackendConsoleModalComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  lms = inject(LmsDataService);
  api = inject(LmsApiService);
  themeService = inject(ThemeService);
  toggleSidebar = output<void>();

  showTenantDropdown = signal(false);
  showUserDropdown = signal(false);
  showNewTenantModal = signal(false);
  showNotificationMenu = signal(false);
  showLayoutModal = signal(false);
  showThemeMenu = signal(false);
  showBackendConsole = signal(false);

  setTheme(mode: 'system' | 'light' | 'dark') {
    this.themeService.setThemeMode(mode);
    this.showThemeMenu.set(false);
  }

  // New tenant form model
  newOrg = {
    name: '',
    slug: '',
    plan: 'Enterprise' as const,
    primaryColor: '#EC008C', // BRAC Standard Pantone Magenta
    accentColor: '#C40072',  // BRAC Deep Magenta Accent
    adminEmail: '',
    tagline: ''
  };

  roles: { role: UserRole; label: string; icon: string }[] = [
    { role: 'super_admin', label: 'Super Admin', icon: 'shield_person' },
    { role: 'tenant_admin', label: 'Tenant Admin', icon: 'admin_panel_settings' },
    { role: 'instructor', label: 'Instructor', icon: 'school' },
    { role: 'learner', label: 'Learner', icon: 'person' },
  ];

  selectTenant(id: string) {
    this.lms.switchTenant(id);
    this.showTenantDropdown.set(false);
  }

  selectRole(role: UserRole) {
    this.lms.switchRole(role);
  }

  openNewTenantModal() {
    this.newOrg = {
      name: '',
      slug: '',
      plan: 'Enterprise',
      primaryColor: '#4f46e5',
      accentColor: '#06b6d4',
      adminEmail: '',
      tagline: ''
    };
    this.showNewTenantModal.set(true);
    this.showTenantDropdown.set(false);
  }

  createTenant() {
    if (!this.newOrg.name.trim()) return;
    const slug = this.newOrg.slug.trim() || this.newOrg.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    this.lms.addTenant({
      name: this.newOrg.name,
      slug,
      plan: this.newOrg.plan,
      adminEmail: this.newOrg.adminEmail || `admin@${slug}.io`,
      branding: {
        primaryColor: this.newOrg.primaryColor,
        accentColor: this.newOrg.accentColor,
        tagline: this.newOrg.tagline || 'Next Generation Learning Management System',
        bannerUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        customCssEnabled: true,
        ssoProvider: 'None'
      }
    });
    this.showNewTenantModal.set(false);
  }
}
