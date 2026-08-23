import { Component, ChangeDetectionStrategy, inject, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';

export interface NavChildItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
}

export interface NavItem {
  label: string;
  route?: string;
  icon: string;
  roles: string[];
  badge?: string;
  children?: NavChildItem[];
}

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
  router = inject(Router);

  isCompact = computed(() => this.lms.adminLayoutPreferences().navigationMode === 'compact_rail');
  isTopMenu = computed(() => this.lms.adminLayoutPreferences().navigationMode === 'top_menu');

  // Expanded state for nested menu items in full sidebar mode
  expandedMenus = signal<Record<string, boolean>>({
    'Organizations': true
  });

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'space_dashboard', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { 
      label: 'Organizations', 
      route: '/tenants',
      icon: 'corporate_fare', 
      roles: ['super_admin', 'tenant_admin'],
      children: [
        { label: 'Organization List', route: '/tenants', icon: 'domain' },
        { label: 'Create Organization', route: '/tenants/create', icon: 'domain_add', badge: 'Wizard' }
      ]
    },
    { 
      label: 'LMS Instances', 
      route: '/lms',
      icon: 'layers', 
      roles: ['super_admin', 'tenant_admin'],
      children: [
        { label: 'LMS Instances Grid', route: '/lms', icon: 'grid_view' },
        { label: 'Create LMS', route: '/lms/create', icon: 'add_circle', badge: 'Wizard' }
      ]
    },
    { label: 'Courses & Catalog', route: '/courses', icon: 'school', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Users & Personnel', route: '/users', icon: 'groups', roles: ['super_admin', 'tenant_admin', 'instructor'] },
    { label: 'Compliance & Analytics', route: '/analytics', icon: 'analytics', roles: ['super_admin', 'tenant_admin'] },
    { label: 'Certificates Vault', route: '/certificates', icon: 'verified', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Live Webinars', route: '/webinars', icon: 'videocam', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'My Profile', route: '/profile', icon: 'account_circle', roles: ['super_admin', 'tenant_admin', 'instructor', 'learner'] },
    { label: 'Tenant Branding', route: '/settings', icon: 'palette', roles: ['super_admin', 'tenant_admin'] },
  ];

  toggleMenu(menuLabel: string, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.expandedMenus.update(current => ({
      ...current,
      [menuLabel]: !current[menuLabel]
    }));
  }

  isMenuExpanded(menuLabel: string): boolean {
    return !!this.expandedMenus()[menuLabel];
  }

  isRouteActive(route?: string, children?: NavChildItem[]): boolean {
    const currentUrl = this.router.url;
    if (route && (currentUrl === route || (route !== '/dashboard' && currentUrl.startsWith(route)))) {
      return true;
    }
    if (children) {
      return children.some(c => c.route === currentUrl || (c.route !== '/dashboard' && currentUrl.startsWith(c.route)));
    }
    return false;
  }

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

