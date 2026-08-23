import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { OrganizationCreateComponent } from './pages/organization-create/organization-create.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CoursePlayerComponent } from './pages/course-player/course-player.component';
import { UsersComponent } from './pages/users/users.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { CertificatesComponent } from './pages/certificates/certificates.component';
import { WebinarsComponent } from './pages/webinars/webinars.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Multi-Tenant LMS' },
  { path: 'profile', component: ProfileComponent, title: 'User Profile | Multi-Tenant LMS' },
  { path: 'tenants', component: TenantsComponent, title: 'Organizations | Multi-Tenant LMS' },
  { path: 'tenants/create', component: OrganizationCreateComponent, title: 'Create Organization | Multi-Tenant LMS' },
  { path: 'organization/create', component: OrganizationCreateComponent, title: 'Create Organization | Multi-Tenant LMS' },
  { path: 'courses', component: CoursesComponent, title: 'Courses | Multi-Tenant LMS' },
  { path: 'courses/:id/learn', component: CoursePlayerComponent, title: 'Classroom Player | Multi-Tenant LMS' },
  { path: 'users', component: UsersComponent, title: 'Personnel Directory | Multi-Tenant LMS' },
  { path: 'analytics', component: AnalyticsComponent, title: 'Compliance Analytics | Multi-Tenant LMS' },
  { path: 'certificates', component: CertificatesComponent, title: 'Certificates Vault | Multi-Tenant LMS' },
  { path: 'webinars', component: WebinarsComponent, title: 'Live Virtual Classrooms | Multi-Tenant LMS' },
  { path: 'settings', component: SettingsComponent, title: 'Branding & Security | Multi-Tenant LMS' },
  { path: '**', redirectTo: 'dashboard' },
];
