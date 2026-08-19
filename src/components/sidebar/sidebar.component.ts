import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  isOpen = input<boolean>(true);
  lms = inject(LmsDataService);

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
}
