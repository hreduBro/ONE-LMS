import { Component, ChangeDetectionStrategy, inject, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents'
  }
})
export class SidebarComponent {
  isOpen = input<boolean>(true);
  close = output<void>();
  lms = inject(LmsDataService);

  isCompact = computed(() => this.lms.adminLayoutPreferences().navigationMode === 'compact_rail');
  isTopMenu = computed(() => this.lms.adminLayoutPreferences().navigationMode === 'top_menu');

  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'space_dashboard', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Multi-Tenant Hub', route: '/tenants', icon: 'corporate_fare', roles: ['super_admin', 'tenant_admin'], badge: 'Multi' },
    { label: 'Courses & Catalog', route: '/courses', icon: 'school', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Users & Departments', route: '/users', icon: 'groups', roles: ['super_admin', 'tenant_admin', 'instructor'] },
    { label: 'Compliance & Analytics', route: '/analytics', icon: 'analytics', roles: ['super_admin', 'tenant_admin'] },
    { label: 'Certificates Vault', route: '/certificates', icon: 'verified', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Live Webinars', route: '/webinars', icon: 'videocam', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Tenant Branding', route: '/settings', icon: 'palette', roles: ['super_admin', 'tenant_admin'] },
  ];

  isAllowed(roles: string[]): boolean {
    const activeRole = this.lms.activeRole();
    return roles.includes(activeRole);
  }

  onNavItemClick() {
    // Only close drawer on mobile viewports (< 1024px); keep open on desktop
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.close.emit();
    }
  }
}
