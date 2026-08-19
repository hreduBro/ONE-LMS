import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { Kpi } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, KpiCardComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  lms = inject(LmsDataService);
  reminderSentMessage = signal<string | null>(null);

  // Dynamic KPIs computed based on active role and active tenant
  kpis = computed<Kpi[]>(() => {
    const tenant = this.lms.activeTenant();
    const role = this.lms.activeRole();
    const courses = this.lms.tenantCourses();
    const users = this.lms.tenantUsers();
    const certs = this.lms.tenantCertificates();

    if (role === 'super_admin') {
      const allTenants = this.lms.tenants();
      const totalLearners = allTenants.reduce((acc, t) => acc + t.stats.totalLearners, 0);
      const totalSeats = allTenants.reduce((acc, t) => acc + t.stats.seatLimit, 0);
      const avgCompliance = Math.round(allTenants.reduce((acc, t) => acc + t.stats.complianceRate, 0) / allTenants.length);

      return [
        { title: 'Total Active Tenants', value: allTenants.length.toString(), change: '+2 this month', icon: 'building', color: 'indigo', subtext: 'Multi-Tenant platform' },
        { title: 'Global Enrolled Learners', value: totalLearners.toLocaleString(), change: '+14.2%', icon: 'users', color: 'sky', subtext: `${Math.round((totalLearners/totalSeats)*100)}% capacity` },
        { title: 'Global Compliance Health', value: `${avgCompliance}%`, change: '+3.1%', icon: 'shield', color: 'emerald', subtext: 'Target: >95%' },
        { title: 'Certificates Awarded', value: certs.length.toString(), change: '+28%', icon: 'badge', color: 'amber', subtext: 'Verified tamper-proof' }
      ];
    }

    if (role === 'learner') {
      const user = this.lms.activeUser();
      const enrolled = this.lms.enrollments().filter(e => e.userId === user.id);
      const completed = enrolled.filter(e => e.status === 'completed');

      return [
        { title: 'My Enrolled Courses', value: enrolled.length.toString(), change: 'Active', icon: 'school', color: 'indigo', subtext: 'In your learning path' },
        { title: 'Completed Courses', value: completed.length.toString(), change: '+100%', icon: 'check', color: 'emerald', subtext: 'Great progress!' },
        { title: 'Earned Certificates', value: user.earnedCertificates.length.toString(), change: 'Verified', icon: 'badge', color: 'amber', subtext: 'Available for download' },
        { title: 'Skill Mastery Points', value: `${user.points} XP`, change: '+250 XP', icon: 'zap', color: 'violet', subtext: 'Level 4 Learner' }
      ];
    }

    // Default Tenant Admin / Instructor
    return [
      { title: 'Active Learners', value: users.length.toString(), change: '+8.4%', icon: 'users', color: 'indigo', subtext: `${tenant.stats.seatsUsed} / ${tenant.stats.seatLimit} seats` },
      { title: 'Mandatory Compliance', value: `${tenant.stats.complianceRate}%`, change: '+2.1%', icon: 'shield', color: 'emerald', subtext: 'SOC2 / HIPAA / ISO' },
      { title: 'Course Catalog', value: courses.length.toString(), change: 'Published', icon: 'school', color: 'sky', subtext: 'Curriculum units' },
      { title: 'Certificates Issued', value: certs.length.toString(), change: '+18.5%', icon: 'badge', color: 'amber', subtext: 'Verified credentials' }
    ];
  });

  // Learner's active enrollments with course details
  myEnrollments = computed(() => {
    const user = this.lms.activeUser();
    const enrollments = this.lms.enrollments().filter(e => e.userId === user.id);
    const courses = this.lms.courses();

    return enrollments.map(enr => {
      const course = courses.find(c => c.id === enr.courseId);
      return {
        enrollment: enr,
        course
      };
    }).filter(item => !!item.course);
  });

  // Quick dispatch compliance reminder
  dispatchReminders() {
    const count = this.lms.sendComplianceReminders();
    this.reminderSentMessage.set(`Automated reminders dispatched to ${count} personnel at risk.`);
    setTimeout(() => this.reminderSentMessage.set(null), 4000);
  }
}
