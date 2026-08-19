import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LmsDataService } from '../../services/lms-data.service';
import { Tenant } from '../../models/lms.model';

@Component({
  selector: 'app-tenants',
  imports: [CommonModule, FormsModule],
  templateUrl: './tenants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantsComponent {
  lms = inject(LmsDataService);

  searchQuery = signal<string>('');
  planFilter = signal<string>('All');
  statusFilter = signal<string>('All');
  showAddModal = signal<boolean>(false);
  editingTenant = signal<Tenant | null>(null);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(4);

  // New tenant form model
  newTenantForm = {
    name: '',
    slug: '',
    domain: '',
    plan: 'Enterprise' as const,
    adminEmail: '',
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4',
    tagline: '',
    seatLimit: 1000,
    ssoProvider: 'Okta' as const
  };

  // Filtered tenants list
  filteredTenants = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const plan = this.planFilter();
    const status = this.statusFilter();

    return this.lms.tenants().filter(t => {
      const matchSearch = t.name.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
      const matchPlan = plan === 'All' || t.plan === plan;
      const matchStatus = status === 'All' || t.status === status;
      return matchSearch && matchPlan && matchStatus;
    });
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredTenants().length / this.pageSize()));
  });

  paginatedTenants = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredTenants().slice(start, start + this.pageSize());
  });

  pagesList = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  // Global telemetry
  totalLearners = computed(() => this.lms.tenants().reduce((sum, t) => sum + t.stats.totalLearners, 0));
  totalSeats = computed(() => this.lms.tenants().reduce((sum, t) => sum + t.stats.seatLimit, 0));
  totalStorage = computed(() => this.lms.tenants().reduce((sum, t) => sum + t.stats.storageUsedGb, 0));

  onSearchChange(val: string) {
    this.searchQuery.set(val);
    this.currentPage.set(1);
  }

  onFilterChange() {
    this.currentPage.set(1);
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  selectTenant(id: string) {
    this.lms.switchTenant(id);
  }

  toggleStatus(id: string, event: Event) {
    event.stopPropagation();
    this.lms.toggleTenantStatus(id);
  }

  openEditModal(tenant: Tenant, event: Event) {
    event.stopPropagation();
    this.editingTenant.set(JSON.parse(JSON.stringify(tenant)));
  }

  saveTenantEdit() {
    const tenant = this.editingTenant();
    if (tenant) {
      this.lms.updateTenant(tenant);
      this.editingTenant.set(null);
    }
  }

  openAddModal() {
    this.newTenantForm = {
      name: '',
      slug: '',
      domain: '',
      plan: 'Enterprise',
      adminEmail: '',
      primaryColor: '#4f46e5',
      accentColor: '#06b6d4',
      tagline: 'Enterprise Skill & Certification Academy',
      seatLimit: 1000,
      ssoProvider: 'Okta'
    };
    this.showAddModal.set(true);
  }

  createTenant() {
    if (!this.newTenantForm.name.trim()) return;
    const slug = this.newTenantForm.slug.trim() || this.newTenantForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const domain = this.newTenantForm.domain.trim() || `${slug}.lmscloud.io`;

    this.lms.addTenant({
      name: this.newTenantForm.name,
      slug,
      domain,
      plan: this.newTenantForm.plan,
      adminEmail: this.newTenantForm.adminEmail || `admin@${slug}.io`,
      branding: {
        primaryColor: this.newTenantForm.primaryColor,
        accentColor: this.newTenantForm.accentColor,
        tagline: this.newTenantForm.tagline,
        bannerUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        customCssEnabled: true,
        ssoProvider: this.newTenantForm.ssoProvider
      },
      stats: {
        seatLimit: Number(this.newTenantForm.seatLimit) || 500,
        seatsUsed: 1,
        totalCourses: 2,
        totalLearners: 1,
        completionRate: 0,
        complianceRate: 100,
        storageUsedGb: 2.5,
        storageLimitGb: 250
      }
    });

    this.showAddModal.set(false);
  }
}
