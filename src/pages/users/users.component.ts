import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LmsDataService } from '../../services/lms-data.service';
import { User, UserRole } from '../../models/lms.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  lms = inject(LmsDataService);

  searchQuery = signal<string>('');
  selectedDepartment = signal<string>('All');
  selectedRole = signal<string>('All');
  selectedCompliance = signal<string>('All');

  showAddModal = signal<boolean>(false);
  selectedUser = signal<User | null>(null);

  // Invite user form
  newUser = {
    name: '',
    email: '',
    role: 'learner' as UserRole,
    department: '',
    assignCourseId: ''
  };

  // Filtered users
  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const dept = this.selectedDepartment();
    const role = this.selectedRole();
    const comp = this.selectedCompliance();
    const users = this.lms.tenantUsers();

    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchDept = dept === 'All' || u.department === dept;
      const matchRole = role === 'All' || u.role === role;
      const matchComp = comp === 'All' || u.complianceStatus === comp;
      return matchSearch && matchDept && matchRole && matchComp;
    });
  });

  openAddModal() {
    this.newUser = {
      name: '',
      email: '',
      role: 'learner',
      department: this.lms.activeTenant().departments[0] || 'General',
      assignCourseId: ''
    };
    this.showAddModal.set(true);
  }

  inviteUser() {
    if (!this.newUser.name.trim() || !this.newUser.email.trim()) return;

    const user = this.lms.addUser({
      name: this.newUser.name,
      email: this.newUser.email,
      role: this.newUser.role,
      department: this.newUser.department,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?auto=format&fit=crop&w=150&q=80`
    });

    if (this.newUser.assignCourseId) {
      this.lms.enrollInCourse(this.newUser.assignCourseId, user.id);
    }

    this.showAddModal.set(false);
  }

  viewUser(user: User) {
    this.selectedUser.set(user);
  }

  sendSingleReminder(user: User, event: Event) {
    event.stopPropagation();
    this.lms.sendComplianceReminders(user.department);
  }
}
