import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';
import { LmsInstance, LmsDraft, LmsStatus } from '../../models/lms-instance.model';

@Component({
  selector: 'app-lms-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lms-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LmsListComponent {
  lms = inject(LmsDataService);
  private router = inject(Router);

  // Filters
  searchQuery = signal<string>('');
  typeFilter = signal<string>('All');
  statusFilter = signal<string>('All');
  deptFilter = signal<string>('All');
  viewMode = signal<'grid' | 'table'>('grid');

  // Inspection modal
  inspectingLms = signal<LmsInstance | null>(null);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  // Departments for active organization
  departments = computed(() => ['All', ...this.lms.getOrganizationDepartments()]);

  // Capacity snapshot for active organization
  capacity = computed(() => this.lms.activeOrgCapacitySnapshot());

  // Filtered LMS instances
  filteredInstances = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const type = this.typeFilter();
    const status = this.statusFilter();
    const dept = this.deptFilter();

    return this.lms.activeOrgLmsInstances().filter(instance => {
      const matchSearch = !q || 
        instance.basicInfo.lmsName.toLowerCase().includes(q) ||
        instance.basicInfo.urlDomain.toLowerCase().includes(q) ||
        instance.id.toLowerCase().includes(q) ||
        instance.basicInfo.programmeDepartment.toLowerCase().includes(q) ||
        instance.admins.some(a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.contactNumber.includes(q));

      const matchType = type === 'All' || instance.basicInfo.lmsType === type;
      const matchStatus = status === 'All' || instance.status === status;
      const matchDept = dept === 'All' || instance.basicInfo.programmeDepartment === dept;

      return matchSearch && matchType && matchStatus && matchDept;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredInstances().length / this.pageSize())));

  paginatedInstances = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredInstances().slice(start, start + this.pageSize());
  });

  pagesList = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  // Active drafts for current org
  activeDrafts = computed(() => this.lms.activeOrgLmsDrafts());

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

  openCreateWizard() {
    this.router.navigate(['/lms/create']);
  }

  resumeDraft(draftId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.router.navigate(['/lms/create'], { queryParams: { draftId } });
  }

  deleteDraft(draftId: string, event: Event) {
    event.stopPropagation();
    this.lms.deleteLmsDraft(draftId);
    this.lms.showToast(`LMS Draft ID ${draftId} removed`, 'info');
  }

  inspect(instance: LmsInstance) {
    this.inspectingLms.set(instance);
  }

  closeInspect() {
    this.inspectingLms.set(null);
  }

  activateInstance(lmsId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.lms.activateLmsInstance(lmsId);
    this.lms.showToast(`LMS Instance ${lmsId} is now Active!`, 'success');
    if (this.inspectingLms()?.id === lmsId) {
      const updated = this.lms.lmsInstances().find(l => l.id === lmsId);
      if (updated) this.inspectingLms.set(updated);
    }
  }

  getStatusBadgeClass(status: LmsStatus): string {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Under Processing':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Suspended':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'In-Progress':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  }
}
