import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LmsDataService } from '../../services/lms-data.service';
import { Certificate } from '../../models/lms.model';

@Component({
  selector: 'app-certificates',
  imports: [CommonModule, FormsModule],
  templateUrl: './certificates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesComponent {
  lms = inject(LmsDataService);

  searchQuery = signal<string>('');
  verificationCodeInput = signal<string>('');
  verificationResult = signal<Certificate | null | 'not_found'>(null);
  selectedCert = signal<Certificate | null>(null);

  // Filtered certificates
  filteredCertificates = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const certs = this.lms.tenantCertificates();

    // If learner role, only show their own certificates
    const isLearner = this.lms.activeRole() === 'learner';
    const user = this.lms.activeUser();

    const list = isLearner ? certs.filter(c => c.userId === user.id) : certs;

    return list.filter(c => 
      c.userName.toLowerCase().includes(q) || 
      c.courseTitle.toLowerCase().includes(q) || 
      c.verificationCode.toLowerCase().includes(q)
    );
  });

  verifyCertificate() {
    const code = this.verificationCodeInput().trim().toUpperCase();
    if (!code) return;

    const cert = this.lms.certificates().find(c => c.verificationCode.toUpperCase() === code);
    if (cert) {
      this.verificationResult.set(cert);
    } else {
      this.verificationResult.set('not_found');
    }
  }

  viewCertificate(cert: Certificate) {
    this.selectedCert.set(cert);
  }

  printCertificate() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
