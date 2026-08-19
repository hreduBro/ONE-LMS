import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LmsDataService } from '../../services/lms-data.service';
import { DashboardWidget, UserRole, CustomTenantDashboard } from '../../models/lms.model';
import { DashboardWidgetRendererComponent } from './dashboard-widget-renderer.component';
import { WidgetConfigModalComponent } from './widget-config-modal.component';
import { AddWidgetModalComponent } from './add-widget-modal.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    DashboardWidgetRendererComponent, 
    WidgetConfigModalComponent, 
    AddWidgetModalComponent
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  lms = inject(LmsDataService);

  // Builder Mode State
  isBuilderMode = signal<boolean>(false);
  editingWidget = signal<DashboardWidget | null>(null);
  showAddWidgetModal = signal<boolean>(false);
  previewRole = signal<UserRole | null>(null);
  publishSuccessMessage = signal<string | null>(null);

  // Working copy of widgets when inside builder mode
  draftWidgets = signal<DashboardWidget[]>([]);

  // Drag and Drop internal tracking
  draggedIndex = signal<number | null>(null);
  dragOverIndex = signal<number | null>(null);

  // Active tenant dashboard from data service
  activeDashboard = this.lms.activeTenantDashboard;

  // Active role
  activeRole = this.lms.activeRole;
  activeTenant = this.lms.activeTenant;

  isAdmin = computed(() => {
    const role = this.activeRole();
    return role === 'super_admin' || role === 'tenant_admin';
  });

  // Effective displayed widgets
  displayedWidgets = computed<DashboardWidget[]>(() => {
    if (this.isBuilderMode()) {
      return this.draftWidgets();
    }
    return this.activeDashboard().widgets;
  });

  // Visible widgets count for the active/preview role
  visibleCount = computed(() => {
    const role = this.previewRole() || this.activeRole();
    return this.displayedWidgets().filter(w => w.visibleForRoles.includes(role)).length;
  });

  // Enter Builder Mode
  enterBuilderMode() {
    this.draftWidgets.set(JSON.parse(JSON.stringify(this.activeDashboard().widgets)));
    this.previewRole.set(null);
    this.isBuilderMode.set(true);
  }

  // Cancel / Exit Builder Mode without saving
  exitBuilderMode() {
    this.isBuilderMode.set(false);
    this.previewRole.set(null);
    this.draftWidgets.set([]);
  }

  // Publish Dashboard for Active Tenant
  publishDashboard() {
    const tenant = this.activeTenant();
    const user = this.lms.activeUser();
    const updated = this.lms.publishTenantDashboard(tenant.id, this.draftWidgets(), user.name);
    
    this.isBuilderMode.set(false);
    this.previewRole.set(null);
    this.publishSuccessMessage.set(`Custom dashboard (v${updated.version}) published successfully for ${tenant.name}!`);
    setTimeout(() => this.publishSuccessMessage.set(null), 5000);
  }

  // Reset to Factory Default LMS Layout
  resetLayout() {
    if (confirm('Reset this tenant dashboard to default factory LMS layout?')) {
      const tenant = this.activeTenant();
      this.lms.resetTenantDashboard(tenant.id);
      this.draftWidgets.set(JSON.parse(JSON.stringify(this.lms.activeTenantDashboard().widgets)));
    }
  }

  // Add new widget from catalog
  onAddWidget(widget: DashboardWidget) {
    this.draftWidgets.update(list => [...list, widget]);
    this.showAddWidgetModal.set(false);
  }

  // Remove widget
  onRemoveWidget(id: string) {
    this.draftWidgets.update(list => list.filter(w => w.id !== id));
  }

  // Duplicate widget
  onDuplicateWidget(widget: DashboardWidget) {
    const copy: DashboardWidget = {
      ...JSON.parse(JSON.stringify(widget)),
      id: `w-${widget.type}-${Date.now().toString().slice(-4)}`,
      title: `${widget.title} (Copy)`
    };
    this.draftWidgets.update(list => {
      const index = list.findIndex(w => w.id === widget.id);
      const copyList = [...list];
      copyList.splice(index + 1, 0, copy);
      return copyList;
    });
  }

  // Move Up
  onMoveUp(id: string) {
    this.draftWidgets.update(list => {
      const index = list.findIndex(w => w.id === id);
      if (index <= 0) return list;
      const copy = [...list];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  }

  // Move Down
  onMoveDown(id: string) {
    this.draftWidgets.update(list => {
      const index = list.findIndex(w => w.id === id);
      if (index < 0 || index >= list.length - 1) return list;
      const copy = [...list];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  }

  // Change ColSpan Width
  onChangeColSpan(event: { id: string; colSpan: 1 | 2 | 3 | 4 }) {
    this.draftWidgets.update(list => 
      list.map(w => w.id === event.id ? { ...w, colSpan: event.colSpan } : w)
    );
  }

  // Save Widget Config Edit
  onSaveWidgetConfig(updated: DashboardWidget) {
    this.draftWidgets.update(list => 
      list.map(w => w.id === updated.id ? updated : w)
    );
    this.editingWidget.set(null);
  }

  // Drag and Drop Handlers
  onDragStart(event: DragEvent, index: number) {
    this.draggedIndex.set(index);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    }
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverIndex.set(index);
  }

  onDragLeave(index: number) {
    if (this.dragOverIndex() === index) {
      this.dragOverIndex.set(null);
    }
  }

  onDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    const sourceIndex = this.draggedIndex();
    
    if (sourceIndex !== null && sourceIndex !== targetIndex) {
      this.draftWidgets.update(list => {
        const copy = [...list];
        const [movedItem] = copy.splice(sourceIndex, 1);
        copy.splice(targetIndex, 0, movedItem);
        return copy;
      });
    }

    this.draggedIndex.set(null);
    this.dragOverIndex.set(null);
  }

  onDragEnd() {
    this.draggedIndex.set(null);
    this.dragOverIndex.set(null);
  }

  // Utility to determine colSpan class for 12-column or 4-column CSS grid
  getColSpanClass(span: 1 | 2 | 3 | 4): string {
    switch (span) {
      case 1:
        return 'col-span-1 sm:col-span-2 lg:col-span-3'; // 1/4 (25%) of 12 cols
      case 2:
        return 'col-span-1 sm:col-span-2 lg:col-span-6'; // 1/2 (50%) of 12 cols
      case 3:
        return 'col-span-1 sm:col-span-2 lg:col-span-9'; // 3/4 (75%) of 12 cols
      case 4:
      default:
        return 'col-span-1 sm:col-span-2 lg:col-span-12'; // 100% of 12 cols
    }
  }
}
