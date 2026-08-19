import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LmsDataService } from '../../services/lms-data.service';
import { Tenant, NavigationLayoutMode, HeaderDensity, ContentWidthMode } from '../../models/lms.model';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  lms = inject(LmsDataService);

  savedNotification = signal<boolean>(false);
  layoutPrefs = this.lms.adminLayoutPreferences;

  // Editable settings copy
  settingsForm = {
    name: '',
    domain: '',
    tagline: '',
    logoUrl: '',
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4',
    ssoProvider: 'Okta' as 'Okta' | 'SAML 2.0' | 'Azure AD' | 'Google Workspace' | 'None',
    enforceMfa: true,
    scormEnabled: true,
    certAutoIssue: true,
    sessionTimeoutMins: 60,
    escalationDays: 7
  };

  constructor() {
    effect(() => {
      const t = this.lms.activeTenant();
      this.settingsForm = {
        name: t.name,
        domain: t.domain,
        tagline: t.branding.tagline,
        logoUrl: t.branding.logoUrl,
        primaryColor: t.branding.primaryColor,
        accentColor: t.branding.accentColor,
        ssoProvider: t.branding.ssoProvider,
        enforceMfa: true,
        scormEnabled: true,
        certAutoIssue: true,
        sessionTimeoutMins: 60,
        escalationDays: 7
      };
    });
  }

  setNavMode(mode: NavigationLayoutMode) {
    this.lms.updateLayoutPreferences({ navigationMode: mode });
  }

  setHeaderDensity(density: HeaderDensity) {
    this.lms.updateLayoutPreferences({ headerDensity: density });
  }

  setContentWidth(width: ContentWidthMode) {
    this.lms.updateLayoutPreferences({ contentWidth: width });
  }

  saveSettings() {
    const current = this.lms.activeTenant();
    const updated: Tenant = {
      ...current,
      name: this.settingsForm.name,
      domain: this.settingsForm.domain,
      branding: {
        ...current.branding,
        tagline: this.settingsForm.tagline,
        logoUrl: this.settingsForm.logoUrl,
        primaryColor: this.settingsForm.primaryColor,
        accentColor: this.settingsForm.accentColor,
        ssoProvider: this.settingsForm.ssoProvider
      }
    };

    this.lms.updateTenant(updated);
    this.savedNotification.set(true);
    setTimeout(() => this.savedNotification.set(false), 3500);
  }
}

