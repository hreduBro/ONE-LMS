import { Injectable, signal, computed, effect } from '@angular/core';
import {
  Tenant,
  User,
  Course,
  CourseEnrollment,
  Certificate,
  LiveWebinar,
  AuditLog,
  UserRole,
  DepartmentMetric,
  AdminLayoutPreferences,
  NavigationLayoutMode,
  DashboardWidget,
  DashboardWidgetType,
  CustomTenantDashboard
} from '../models/lms.model';

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-acme',
    name: 'Acme Global Enterprise',
    slug: 'acme-corp',
    domain: 'academy.acme.com',
    plan: 'Enterprise',
    status: 'Active',
    adminEmail: 'clara.admin@acme.com',
    createdAt: '2024-01-15',
    renewalDate: '2027-01-15',
    branding: {
      primaryColor: '#4f46e5', // Indigo
      accentColor: '#06b6d4',  // Cyan
      tagline: 'Empowering Next-Generation Workforce Skills',
      bannerUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      customCssEnabled: true,
      ssoProvider: 'Okta'
    },
    departments: ['Engineering', 'Cloud & Security', 'Sales & Growth', 'Product Management', 'People & HR'],
    stats: {
      seatLimit: 1200,
      seatsUsed: 945,
      totalCourses: 18,
      totalLearners: 945,
      completionRate: 84.6,
      complianceRate: 96.2,
      storageUsedGb: 142.5,
      storageLimitGb: 500
    },
    features: {
      scormSupport: true,
      aiTutor: true,
      liveWebinars: true,
      customCertificates: true,
      whiteLabel: true,
      customDomain: true
    }
  },
  {
    id: 'tenant-stanford',
    name: 'Stanford Tech Institute',
    slug: 'stanford-tech',
    domain: 'learn.stanfordtech.edu',
    plan: 'Enterprise',
    status: 'Active',
    adminEmail: 'provost@stanfordtech.edu',
    createdAt: '2023-08-01',
    renewalDate: '2027-08-01',
    branding: {
      primaryColor: '#b91c1c', // Deep Crimson
      accentColor: '#d97706',  // Amber
      tagline: 'Pioneering Excellence in Research & Computing',
      bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80',
      customCssEnabled: true,
      ssoProvider: 'SAML 2.0'
    },
    departments: ['Computer Science', 'AI Research Lab', 'Robotics & Hardware', 'Bioinformatics', 'Data Analytics'],
    stats: {
      seatLimit: 5000,
      seatsUsed: 4280,
      totalCourses: 42,
      totalLearners: 4280,
      completionRate: 91.4,
      complianceRate: 98.8,
      storageUsedGb: 412.0,
      storageLimitGb: 1000
    },
    features: {
      scormSupport: true,
      aiTutor: true,
      liveWebinars: true,
      customCertificates: true,
      whiteLabel: true,
      customDomain: true
    }
  },
  {
    id: 'tenant-apexhealth',
    name: 'Apex Health System',
    slug: 'apex-health',
    domain: 'training.apexhealth.org',
    plan: 'Enterprise',
    status: 'Active',
    adminEmail: 'chief.medical.officer@apexhealth.org',
    createdAt: '2024-03-10',
    renewalDate: '2027-03-10',
    branding: {
      primaryColor: '#059669', // Emerald
      accentColor: '#0284c7',  // Sky Blue
      tagline: 'Clinical Clinical Training, HIPAA & Patient Safety Hub',
      bannerUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80',
      customCssEnabled: true,
      ssoProvider: 'Azure AD'
    },
    departments: ['Emergency Medicine', 'Surgical Staff', 'Nursing & ICU', 'Pharmacy', 'Clinical Compliance'],
    stats: {
      seatLimit: 2500,
      seatsUsed: 2120,
      totalCourses: 26,
      totalLearners: 2120,
      completionRate: 88.9,
      complianceRate: 99.4,
      storageUsedGb: 285.4,
      storageLimitGb: 750
    },
    features: {
      scormSupport: true,
      aiTutor: true,
      liveWebinars: true,
      customCertificates: true,
      whiteLabel: true,
      customDomain: true
    }
  },
  {
    id: 'tenant-finedge',
    name: 'FinEdge Compliance Academy',
    slug: 'finedge-bank',
    domain: 'learn.finedgecapital.com',
    plan: 'Pro',
    status: 'Active',
    adminEmail: 'compliance.head@finedgecapital.com',
    createdAt: '2024-06-01',
    renewalDate: '2026-06-01',
    branding: {
      primaryColor: '#2563eb', // Royal Blue
      accentColor: '#ca8a04',  // Gold
      tagline: 'Global Regulatory, AML & Financial Risk Certification',
      bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&q=80',
      customCssEnabled: false,
      ssoProvider: 'Azure AD'
    },
    departments: ['Investment Banking', 'AML Compliance', 'Risk Management', 'Wealth Advisors', 'Retail Banking'],
    stats: {
      seatLimit: 600,
      seatsUsed: 490,
      totalCourses: 14,
      totalLearners: 490,
      completionRate: 79.2,
      complianceRate: 94.0,
      storageUsedGb: 88.0,
      storageLimitGb: 250
    },
    features: {
      scormSupport: true,
      aiTutor: false,
      liveWebinars: true,
      customCertificates: true,
      whiteLabel: false,
      customDomain: true
    }
  },
  {
    id: 'tenant-innovate',
    name: 'Innovate AI Labs',
    slug: 'innovate-ai',
    domain: 'academy.innovate-ai.io',
    plan: 'Pro',
    status: 'Active',
    adminEmail: 'founder@innovate-ai.io',
    createdAt: '2024-11-20',
    renewalDate: '2026-11-20',
    branding: {
      primaryColor: '#7c3aed', // Purple
      accentColor: '#db2777',  // Pink
      tagline: 'Advanced Neural Architectures & GenAI Systems',
      bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      customCssEnabled: true,
      ssoProvider: 'Google Workspace'
    },
    departments: ['Deep Learning', 'Prompt Engineering', 'MLOps Infrastructure', 'Autonomous Agents'],
    stats: {
      seatLimit: 250,
      seatsUsed: 185,
      totalCourses: 9,
      totalLearners: 185,
      completionRate: 86.5,
      complianceRate: 91.2,
      storageUsedGb: 64.2,
      storageLimitGb: 200
    },
    features: {
      scormSupport: false,
      aiTutor: true,
      liveWebinars: true,
      customCertificates: true,
      whiteLabel: false,
      customDomain: true
    }
  }
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-sec-101',
    tenantId: 'tenant-acme',
    title: 'Cybersecurity & Zero Trust Architecture (2026)',
    subtitle: 'Mandatory enterprise security protocol, phishing defense & access token protection',
    description: 'Learn modern security principles including Zero Trust defense-in-depth, credential governance, multi-factor hardware keys, social engineering mitigation, and cloud infrastructure access management.',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    category: 'Compliance & Security',
    level: 'Intermediate',
    durationMinutes: 90,
    isMandatory: true,
    complianceDeadlineDays: 14,
    instructorName: 'Marcus Vance, CISSP',
    instructorTitle: 'Principal Security Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    reviewCount: 312,
    enrolledCount: 840,
    certificateEnabled: true,
    status: 'Published',
    tags: ['Security', 'Zero Trust', 'Compliance', 'SOC-2'],
    createdAt: '2025-01-10',
    targetDepartments: ['Engineering', 'Cloud & Security', 'Sales & Growth', 'Product Management', 'People & HR'],
    modules: [
      {
        id: 'mod-1',
        title: 'Core Zero Trust Architecture & Defense in Depth',
        durationMinutes: 30,
        lessons: [
          {
            id: 'les-1-1',
            title: '1.1 The Death of the Perimeter & Micro-segmentation',
            type: 'video',
            durationMinutes: 12,
            summary: 'Understanding why perimeter-based security fails in distributed cloud environments and how identity becomes the primary firewall perimeter.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: [
              { title: 'Zero_Trust_Implementation_Framework.pdf', size: '2.4 MB', url: '#', type: 'PDF' },
              { title: 'Enterprise_Credential_Matrix.xlsx', size: '640 KB', url: '#', type: 'Spreadsheet' }
            ]
          },
          {
            id: 'les-1-2',
            title: '1.2 Phishing, Session Hijacking & Hardware MFA',
            type: 'article',
            durationMinutes: 18,
            summary: 'Deep-dive into modern spear-phishing attack vectors, browser session cookie stealing, and why FIDO2/WebAuthn hardware security keys provide phishing-resistant authentication.',
            contentHtml: `
              <h3 class="text-xl font-bold mb-3 text-tenant-700 dark:text-tenant-200">The Modern Phishing Landscape</h3>
              <p class="mb-4 text-text-secondary leading-relaxed">Traditional SMS and TOTP authenticator app codes are increasingly vulnerable to Adversary-in-the-Middle (AitM) reverse proxy kits such as Evilginx. Attackers proxy legitimate login pages, intercepting both passwords and session session tokens in real time.</p>
              
              <div class="p-4 rounded-xl bg-tenant-50 dark:bg-tenant-200/10 border border-tenant-200 dark:border-tenant-200/20 mb-4">
                <h4 class="font-semibold text-tenant-600 dark:text-tenant-200 mb-1 flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">shield</span> Key Takeaway: FIDO2 / WebAuthn
                </h4>
                <p class="text-sm text-text-secondary">Hardware keys cryptographically bind the authentication signature to the exact origin domain (e.g. <code>academy.acme.com</code>), making phishing mathematically impossible even if the user clicks a deceptive link.</p>
              </div>

              <h3 class="text-xl font-bold mb-3 mt-6 text-tenant-700 dark:text-tenant-200">Emergency Protocol: Compromised Session</h3>
              <ul class="list-disc pl-6 space-y-2 text-text-secondary mb-4">
                <li>Immediately revoke all active OAuth & SSO sessions via the security dashboard.</li>
                <li>Trigger an emergency password rotation and register a new security key.</li>
                <li>Report the incident to <code>security-ops@acme.com</code> with complete browser header dumps.</li>
              </ul>
            `,
            resources: [
              { title: 'Phishing_Incident_Response_Playbook.pdf', size: '1.1 MB', url: '#', type: 'PDF' }
            ]
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Interactive Assessment & Certification Quiz',
        durationMinutes: 60,
        lessons: [
          {
            id: 'les-2-1',
            title: '2.1 Security & Zero Trust Knowledge Assessment',
            type: 'quiz',
            durationMinutes: 20,
            summary: 'Mandatory 4-question assessment. You must score at least 75% to achieve certification and maintain organizational compliance.',
            passingScorePercent: 75,
            quizQuestions: [
              {
                id: 'q1',
                question: 'What is the fundamental tenet of a Zero Trust Architecture (ZTA)?',
                options: [
                  'Trust all internal network traffic once behind the corporate VPN',
                  'Never trust, always verify every request regardless of origin',
                  'Only encrypt external communications while leaving internal APIs unauthenticated',
                  'Rely strictly on 8-character alphanumeric passwords changed monthly'
                ],
                correctAnswerIndex: 1,
                explanation: 'Zero Trust assumes the network is hostile and mandates strict identity verification, least privilege, and continuous telemetry on every single transaction.',
                points: 25
              },
              {
                id: 'q2',
                question: 'Why are FIDO2/WebAuthn hardware tokens resistant to reverse-proxy phishing attacks (e.g. AitM)?',
                options: [
                  'They produce a 12-digit PIN that changes every 10 seconds',
                  'They cryptographically bind challenge responses to the verified browser origin URL',
                  'They block all incoming traffic at the operating system firewall level',
                  'They require manual approval from a security administrator for every login'
                ],
                correctAnswerIndex: 1,
                explanation: 'WebAuthn protocol binds the cryptographic assertion to the browser-verified origin, preventing deceptive phishing proxies from reusing credentials.',
                points: 25
              },
              {
                id: 'q3',
                question: 'If you receive an urgent Slack message from an executive asking for a gift card purchase or confidential API token, what should you do?',
                options: [
                  'Fulfill the request immediately to avoid delaying company operations',
                  'Post the API credentials in a private Slack channel with auto-delete enabled',
                  'Verify through a secondary out-of-band communication channel and notify SecOps',
                  'Reply with dummy credentials to see if they are a real executive'
                ],
                correctAnswerIndex: 2,
                explanation: 'Executive impersonation via business email/chat compromise requires out-of-band verification and prompt incident escalation.',
                points: 25
              },
              {
                id: 'q4',
                question: 'What is the recommended protocol when an engineer detects an accidental API secret commit to a Git repository?',
                options: [
                  'Delete the commit with git push --force and tell no one',
                  'Immediately rotate/revoke the compromised secret in the cloud provider, then audit logs',
                  'Wait until the end of the sprint to rotate credentials in production',
                  'Change the file name in the repository so scanners cannot find it'
                ],
                correctAnswerIndex: 1,
                explanation: 'Secrets exposed in version control must be treated as instantly compromised. Immediate revocation and log audit are non-negotiable.',
                points: 25
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-cloud-202',
    tenantId: 'tenant-acme',
    title: 'Cloud Native Microservices & Kubernetes in Production',
    subtitle: 'Container orchestration, Service Mesh, CI/CD pipelines and resilience patterns',
    description: 'Master Kubernetes orchestration, Istio service mesh, distributed tracing with OpenTelemetry, Helm chart package management, and zero-downtime blue/green deployment strategies.',
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    category: 'Engineering',
    level: 'Advanced',
    durationMinutes: 240,
    isMandatory: false,
    instructorName: 'Dr. Elena Rostova',
    instructorTitle: 'VP of Cloud Infrastructure',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    rating: 4.85,
    reviewCount: 184,
    enrolledCount: 420,
    certificateEnabled: true,
    status: 'Published',
    tags: ['Kubernetes', 'Cloud', 'DevOps', 'Go'],
    createdAt: '2025-02-01',
    targetDepartments: ['Engineering', 'Cloud & Security'],
    modules: [
      {
        id: 'mod-c1',
        title: 'Container Orchestration & Pod Lifecycle',
        durationMinutes: 60,
        lessons: [
          {
            id: 'les-c1-1',
            title: '1.1 Pod Scheduling, Affinity & Topology Spread',
            type: 'video',
            durationMinutes: 25,
            summary: 'Detailed inspection of the kube-scheduler, node affinity rules, and balancing workloads across multi-region availability zones.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          {
            id: 'les-c1-2',
            title: '1.2 Helm 3 & GitOps Workflow with ArgoCD',
            type: 'article',
            durationMinutes: 35,
            summary: 'Declarative Kubernetes continuous deployment utilizing ArgoCD, repository webhooks, and automated drift reconciliation.',
            contentHtml: `
              <h3 class="text-xl font-bold mb-3 text-tenant-700 dark:text-tenant-200">The GitOps Operating Model</h3>
              <p class="mb-4 text-text-secondary leading-relaxed">GitOps treats Git as the single source of truth for declarative infrastructure and applications. ArgoCD runs in-cluster and continuously compares desired state against live cluster status.</p>
              <div class="p-4 bg-base-300 rounded-xl font-mono text-sm mb-4">
                apiVersion: argoproj.io/v1alpha1<br>
                kind: Application<br>
                metadata:<br>
                &nbsp;&nbsp;name: production-microservices<br>
                spec:<br>
                &nbsp;&nbsp;destination:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;server: https://kubernetes.default.svc
              </div>
            `
          }
        ]
      }
    ]
  },
  {
    id: 'course-hipaa-303',
    tenantId: 'tenant-apexhealth',
    title: 'HIPAA & Clinical Patient Data Privacy Standards',
    subtitle: 'Comprehensive compliance protocol for clinicians, EHR data handlers & nurses',
    description: 'Mandatory clinical training covering HIPAA Privacy Rule, Security Rule, Protected Health Information (PHI) safeguards, breach notification procedures, and telehealth encryption standards.',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    category: 'Healthcare',
    level: 'Beginner',
    durationMinutes: 75,
    isMandatory: true,
    complianceDeadlineDays: 7,
    instructorName: 'Dr. Sarah Jenkins, MD',
    instructorTitle: 'Chief Compliance & Patient Safety Officer',
    instructorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
    rating: 4.95,
    reviewCount: 890,
    enrolledCount: 1980,
    certificateEnabled: true,
    status: 'Published',
    tags: ['HIPAA', 'Healthcare', 'Compliance', 'Patient Privacy'],
    createdAt: '2024-12-01',
    targetDepartments: ['Emergency Medicine', 'Surgical Staff', 'Nursing & ICU', 'Pharmacy', 'Clinical Compliance'],
    modules: [
      {
        id: 'mod-h1',
        title: 'HIPAA Essentials & PHI Identifiers',
        durationMinutes: 45,
        lessons: [
          {
            id: 'les-h1-1',
            title: '1.1 The 18 Direct Identifiers of Protected Health Information',
            type: 'article',
            durationMinutes: 20,
            summary: 'Recognizing all 18 identifiers under HIPAA including medical record numbers, biometric identifiers, device serial numbers, and geographic subdivisions.',
            contentHtml: `<p class="text-text-secondary">Never share patient records over unencrypted communication channels...</p>`
          },
          {
            id: 'les-h1-2',
            title: '1.2 Clinical HIPAA Mastery Assessment',
            type: 'quiz',
            durationMinutes: 25,
            summary: 'Evaluate clinical compliance scenarios and breach reporting rules.',
            passingScorePercent: 80,
            quizQuestions: [
              {
                id: 'qh1',
                question: 'Which of the following is considered Protected Health Information (PHI) under HIPAA?',
                options: [
                  'De-identified aggregate statistical health trends without patient markers',
                  'Patient discharge summary containing medical record number and admission date',
                  'Hospital cafeteria menu schedule',
                  'Public medical dictionary definitions'
                ],
                correctAnswerIndex: 1,
                explanation: 'Any health data linked with patient identifiers (dates, MRNs, names) constitutes PHI.',
                points: 50
              },
              {
                id: 'qh2',
                question: 'Under the HIPAA Breach Notification Rule, within what timeframe must covered entities notify affected individuals following discovery of a major breach?',
                options: [
                  'Within 60 calendar days without unreasonable delay',
                  'Within 1 year during annual audit review',
                  'Notification is not required if fewer than 10,000 individuals are impacted',
                  'Only if requested by local news agencies'
                ],
                correctAnswerIndex: 0,
                explanation: 'Covered entities must notify affected individuals within 60 calendar days of breach discovery.',
                points: 50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-ai-404',
    tenantId: 'tenant-innovate',
    title: 'Generative AI Architecture & Autonomous Agents',
    subtitle: 'Building production LLM pipelines, RAG systems, Tool Calling & Multi-Agent Teams',
    description: 'Practical engineering guide to designing scalable generative AI systems: vector indexing with hybrid search, context compression, function-calling workflows, and self-correcting agent loops.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    category: 'AI & Data',
    level: 'Advanced',
    durationMinutes: 180,
    isMandatory: false,
    instructorName: 'Prof. Alex Chen, PhD',
    instructorTitle: 'AI Research Director',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.98,
    reviewCount: 142,
    enrolledCount: 165,
    certificateEnabled: true,
    status: 'Published',
    tags: ['LLM', 'AI Agents', 'RAG', 'Python', 'Vector DB'],
    createdAt: '2025-01-22',
    targetDepartments: ['Deep Learning', 'Prompt Engineering', 'MLOps Infrastructure', 'Autonomous Agents'],
    modules: [
      {
        id: 'mod-ai-1',
        title: 'Retrieval Augmented Generation (RAG) Architecture',
        durationMinutes: 90,
        lessons: [
          {
            id: 'les-ai-1-1',
            title: '1.1 Chunking Strategies & Vector Indexing',
            type: 'video',
            durationMinutes: 30,
            summary: 'Comparing recursive character splitting vs semantic AST chunking for high recall in domain-specific technical corpora.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'course-aml-505',
    tenantId: 'tenant-finedge',
    title: 'Anti-Money Laundering (AML) & Financial Crime Prevention',
    subtitle: 'BSA/AML regulatory compliance, suspicious activity reporting (SAR) & KYC audits',
    description: 'Learn regulatory compliance frameworks, detecting illicit financial structuring, international transaction sanctions screening, customer due diligence (CDD), and FinCEN SAR filing protocols.',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    category: 'Finance',
    level: 'Intermediate',
    durationMinutes: 110,
    isMandatory: true,
    complianceDeadlineDays: 10,
    instructorName: 'Victoria Sterling, CAMS',
    instructorTitle: 'Chief Anti-Money Laundering Officer',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 4.88,
    reviewCount: 340,
    enrolledCount: 470,
    certificateEnabled: true,
    status: 'Published',
    tags: ['Finance', 'AML', 'Banking', 'FinCEN', 'Compliance'],
    createdAt: '2025-01-05',
    targetDepartments: ['Investment Banking', 'AML Compliance', 'Risk Management', 'Wealth Advisors', 'Retail Banking'],
    modules: [
      {
        id: 'mod-aml-1',
        title: 'AML Red Flags & Transaction Monitoring',
        durationMinutes: 60,
        lessons: [
          {
            id: 'les-aml-1-1',
            title: '1.1 Structuring & Layering Detection Techniques',
            type: 'article',
            durationMinutes: 25,
            summary: 'Identifying suspicious smurfing patterns, rapid account movement, and shell company transaction indicators.',
            contentHtml: `<p class="text-text-secondary">Financial institutions must file a Suspicious Activity Report (SAR) whenever suspicious transaction anomalies are identified...</p>`
          }
        ]
      }
    ]
  }
];

const INITIAL_USERS: User[] = [
  // Acme Corp Users
  {
    id: 'usr-acme-1',
    tenantId: 'tenant-acme',
    name: 'Clara Oswald',
    email: 'clara.admin@acme.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'tenant_admin',
    department: 'People & HR',
    enrolledCourses: ['course-sec-101'],
    completedCourses: ['course-sec-101'],
    earnedCertificates: ['cert-101'],
    points: 1250,
    badges: ['Security Champion', 'Tenant Admin Ace'],
    lastActive: '10 mins ago',
    status: 'Active',
    complianceStatus: 'Compliant'
  },
  {
    id: 'usr-acme-2',
    tenantId: 'tenant-acme',
    name: 'David Kim',
    email: 'david.kim@acme.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'learner',
    department: 'Engineering',
    enrolledCourses: ['course-sec-101', 'course-cloud-202'],
    completedCourses: ['course-sec-101'],
    earnedCertificates: ['cert-102'],
    points: 840,
    badges: ['Cloud Architect', 'Early Finisher'],
    lastActive: '1 hour ago',
    status: 'Active',
    complianceStatus: 'Compliant'
  },
  {
    id: 'usr-acme-3',
    tenantId: 'tenant-acme',
    name: 'Sophia Rodriguez',
    email: 'sophia.r@acme.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    role: 'learner',
    department: 'Sales & Growth',
    enrolledCourses: ['course-sec-101'],
    completedCourses: [],
    earnedCertificates: [],
    points: 210,
    badges: ['New Explorer'],
    lastActive: '3 days ago',
    status: 'Active',
    complianceStatus: 'At Risk'
  },
  {
    id: 'usr-acme-4',
    tenantId: 'tenant-acme',
    name: 'Marcus Vance',
    email: 'marcus.vance@acme.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'instructor',
    department: 'Cloud & Security',
    enrolledCourses: ['course-sec-101'],
    completedCourses: ['course-sec-101'],
    earnedCertificates: [],
    points: 3400,
    badges: ['Master Instructor', 'Content Creator'],
    lastActive: '25 mins ago',
    status: 'Active',
    complianceStatus: 'Compliant'
  },
  // Apex Health Users
  {
    id: 'usr-apex-1',
    tenantId: 'tenant-apexhealth',
    name: 'Dr. Sarah Jenkins',
    email: 'dr.jenkins@apexhealth.org',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
    role: 'tenant_admin',
    department: 'Clinical Compliance',
    enrolledCourses: ['course-hipaa-303'],
    completedCourses: ['course-hipaa-303'],
    earnedCertificates: ['cert-301'],
    points: 2800,
    badges: ['HIPAA Master', 'Clinical Safety Lead'],
    lastActive: '5 mins ago',
    status: 'Active',
    complianceStatus: 'Compliant'
  },
  {
    id: 'usr-apex-2',
    tenantId: 'tenant-apexhealth',
    name: 'Nurse Emily Watson',
    email: 'e.watson@apexhealth.org',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    role: 'learner',
    department: 'Nursing & ICU',
    enrolledCourses: ['course-hipaa-303'],
    completedCourses: ['course-hipaa-303'],
    earnedCertificates: ['cert-302'],
    points: 920,
    badges: ['Patient Guardian'],
    lastActive: '2 hours ago',
    status: 'Active',
    complianceStatus: 'Compliant'
  },
  {
    id: 'usr-apex-3',
    tenantId: 'tenant-apexhealth',
    name: 'Dr. Robert Torres',
    email: 'r.torres@apexhealth.org',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    role: 'learner',
    department: 'Emergency Medicine',
    enrolledCourses: ['course-hipaa-303'],
    completedCourses: [],
    earnedCertificates: [],
    points: 100,
    badges: [],
    lastActive: '6 days ago',
    status: 'Active',
    complianceStatus: 'Overdue'
  },
  // Stanford Tech Users
  {
    id: 'usr-stanford-1',
    tenantId: 'tenant-stanford',
    name: 'Prof. Katherine Bell',
    email: 'kbell@stanfordtech.edu',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    role: 'tenant_admin',
    department: 'Computer Science',
    enrolledCourses: [],
    completedCourses: [],
    earnedCertificates: [],
    points: 4100,
    badges: ['Academic Dean'],
    lastActive: '12 mins ago',
    status: 'Active',
    complianceStatus: 'Compliant'
  }
];

const INITIAL_ENROLLMENTS: CourseEnrollment[] = [
  {
    id: 'enr-1',
    tenantId: 'tenant-acme',
    userId: 'usr-acme-2', // David Kim
    courseId: 'course-sec-101',
    progressPercent: 100,
    completedLessonIds: ['les-1-1', 'les-1-2', 'les-2-1'],
    quizScores: { 'les-2-1': 100 },
    status: 'completed',
    startedAt: '2025-02-10T09:00:00Z',
    completedAt: '2025-02-10T10:45:00Z'
  },
  {
    id: 'enr-2',
    tenantId: 'tenant-acme',
    userId: 'usr-acme-2', // David Kim
    courseId: 'course-cloud-202',
    progressPercent: 50,
    completedLessonIds: ['les-c1-1'],
    quizScores: {},
    status: 'in_progress',
    startedAt: '2025-02-14T14:30:00Z',
    lastAccessedLessonId: 'les-c1-2'
  },
  {
    id: 'enr-3',
    tenantId: 'tenant-acme',
    userId: 'usr-acme-3', // Sophia Rodriguez
    courseId: 'course-sec-101',
    progressPercent: 33,
    completedLessonIds: ['les-1-1'],
    quizScores: {},
    status: 'in_progress',
    startedAt: '2025-02-12T11:20:00Z',
    dueDate: '2025-02-26T23:59:59Z'
  }
];

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-101',
    tenantId: 'tenant-acme',
    tenantName: 'Acme Global Enterprise',
    tenantLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    userId: 'usr-acme-1',
    userName: 'Clara Oswald',
    userEmail: 'clara.admin@acme.com',
    courseId: 'course-sec-101',
    courseTitle: 'Cybersecurity & Zero Trust Architecture (2026)',
    category: 'Compliance & Security',
    issuedDate: '2025-02-08',
    verificationCode: 'ACM-SEC-2026-98421',
    gradeScore: 98,
    instructorName: 'Marcus Vance, CISSP',
    expiryDate: '2027-02-08'
  },
  {
    id: 'cert-102',
    tenantId: 'tenant-acme',
    tenantName: 'Acme Global Enterprise',
    tenantLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    userId: 'usr-acme-2',
    userName: 'David Kim',
    userEmail: 'david.kim@acme.com',
    courseId: 'course-sec-101',
    courseTitle: 'Cybersecurity & Zero Trust Architecture (2026)',
    category: 'Compliance & Security',
    issuedDate: '2025-02-10',
    verificationCode: 'ACM-SEC-2026-41908',
    gradeScore: 100,
    instructorName: 'Marcus Vance, CISSP',
    expiryDate: '2027-02-10'
  },
  {
    id: 'cert-301',
    tenantId: 'tenant-apexhealth',
    tenantName: 'Apex Health System',
    tenantLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80',
    userId: 'usr-apex-1',
    userName: 'Dr. Sarah Jenkins',
    userEmail: 'dr.jenkins@apexhealth.org',
    courseId: 'course-hipaa-303',
    courseTitle: 'HIPAA & Clinical Patient Data Privacy Standards',
    category: 'Healthcare',
    issuedDate: '2025-01-18',
    verificationCode: 'APX-MED-2025-11042',
    gradeScore: 100,
    instructorName: 'Dr. Sarah Jenkins, MD',
    expiryDate: '2026-01-18'
  }
];

const INITIAL_WEBINARS: LiveWebinar[] = [
  {
    id: 'web-1',
    tenantId: 'tenant-acme',
    title: 'Zero-Day Incident Response & Live Threat Hunting',
    description: 'Interactive live simulation investigating malware persistence mechanisms and live memory forensics.',
    instructor: 'Marcus Vance',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    scheduledAt: '2025-03-05T18:00:00Z',
    durationMinutes: 60,
    attendeeCount: 142,
    maxAttendees: 500,
    platform: 'Built-in WebRTC',
    status: 'Upcoming',
    joinUrl: '#'
  },
  {
    id: 'web-2',
    tenantId: 'tenant-acme',
    title: 'Q1 2026 Engineering All-Hands: AI Agent Integration',
    description: 'Quarterly review of production microservices migration and enterprise AI tooling.',
    instructor: 'Dr. Elena Rostova',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    scheduledAt: '2025-03-12T17:00:00Z',
    durationMinutes: 90,
    attendeeCount: 285,
    maxAttendees: 1000,
    platform: 'Zoom',
    status: 'Upcoming',
    joinUrl: '#'
  },
  {
    id: 'web-3',
    tenantId: 'tenant-apexhealth',
    title: 'Clinical Telehealth Security & EHR Audit Updates',
    description: 'Mandatory clinical safety session for hospital department heads and senior nursing supervisors.',
    instructor: 'Dr. Sarah Jenkins',
    instructorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
    scheduledAt: '2025-03-08T15:00:00Z',
    durationMinutes: 45,
    attendeeCount: 410,
    maxAttendees: 1000,
    platform: 'Teams',
    status: 'Upcoming',
    joinUrl: '#'
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    tenantId: 'tenant-acme',
    tenantName: 'Acme Global Enterprise',
    actor: 'Clara Oswald',
    actorRole: 'Tenant Admin',
    action: 'Mandatory Course Assignment',
    target: 'Cybersecurity & Zero Trust Architecture (2026) -> Sales Dept',
    timestamp: '15 mins ago',
    severity: 'info',
    ipAddress: '192.0.2.45'
  },
  {
    id: 'log-2',
    tenantId: 'tenant-acme',
    tenantName: 'Acme Global Enterprise',
    actor: 'David Kim',
    actorRole: 'Learner',
    action: 'Certificate Earned (Grade: 100%)',
    target: 'Cybersecurity & Zero Trust (ACM-SEC-2026-41908)',
    timestamp: '1 hour ago',
    severity: 'success',
    ipAddress: '198.51.100.12'
  },
  {
    id: 'log-3',
    tenantId: 'tenant-acme',
    tenantName: 'Acme Global Enterprise',
    actor: 'Super Admin',
    actorRole: 'Platform Super Admin',
    action: 'Tenant Quota Expansion',
    target: 'Seats increased 1000 -> 1200',
    timestamp: '4 hours ago',
    severity: 'warning',
    ipAddress: '203.0.113.88'
  },
  {
    id: 'log-4',
    tenantId: 'tenant-apexhealth',
    tenantName: 'Apex Health System',
    actor: 'Dr. Sarah Jenkins',
    actorRole: 'Tenant Admin',
    action: 'Automated Compliance Reminder Sent',
    target: '34 Overdue Hospital Personnel',
    timestamp: '6 hours ago',
    severity: 'info',
    ipAddress: '198.51.100.74'
  }
];

export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'w-announcement-1',
    type: 'announcement_banner',
    title: 'Tenant Skill & Compliance Directive',
    colSpan: 4,
    visibleForRoles: ['super_admin', 'tenant_admin', 'instructor', 'learner'],
    config: {
      bannerText: 'Annual Mandatory Cybersecurity & Regulatory Certification cycle is in effect. All personnel must complete assignments before the due date.',
      bannerType: 'indigo'
    }
  },
  {
    id: 'w-kpi-grid-1',
    type: 'kpi_grid',
    title: 'High-Level Operational Key Performance Indicators',
    subtitle: 'Real-time telemetry aggregated for active tenant and role',
    colSpan: 4,
    visibleForRoles: ['super_admin', 'tenant_admin', 'instructor', 'learner']
  },
  {
    id: 'w-learner-courses-1',
    type: 'learner_in_progress',
    title: 'Continue Active Learning',
    subtitle: 'Enrolled interactive curricula & mandatory certification modules',
    colSpan: 3,
    visibleForRoles: ['learner']
  },
  {
    id: 'w-gamification-1',
    type: 'gamification_leaderboard',
    title: 'Skill Mastery & XP Leaderboard',
    subtitle: 'Top achievers and credential badge showcase',
    colSpan: 1,
    visibleForRoles: ['learner', 'instructor']
  },
  {
    id: 'w-dept-matrix-1',
    type: 'chart_department_matrix',
    title: 'Department Progress & Compliance Matrix',
    subtitle: 'Aggregated progress across operational units',
    colSpan: 2,
    visibleForRoles: ['super_admin', 'tenant_admin', 'instructor']
  },
  {
    id: 'w-enrollment-trends-1',
    type: 'chart_enrollment_trends',
    title: 'Enrollment & Completion Velocity',
    subtitle: 'Monthly progression trends across active cohorts',
    colSpan: 2,
    visibleForRoles: ['super_admin', 'tenant_admin']
  },
  {
    id: 'w-escalation-queue-1',
    type: 'escalation_queue',
    title: 'Compliance Risk & Escalation Queue',
    subtitle: 'Personnel requiring immediate remediation',
    colSpan: 2,
    visibleForRoles: ['super_admin', 'tenant_admin', 'instructor']
  },
  {
    id: 'w-live-audit-1',
    type: 'live_audit_feed',
    title: 'Real-Time Security & Audit Stream',
    subtitle: 'Live tamper-proof event logs and compliance traces',
    colSpan: 2,
    visibleForRoles: ['super_admin', 'tenant_admin']
  },
  {
    id: 'w-upcoming-webinars-1',
    type: 'upcoming_webinars',
    title: 'Upcoming Live Virtual Classrooms',
    subtitle: 'Interactive instructor-led sessions and workshops',
    colSpan: 2,
    visibleForRoles: ['super_admin', 'tenant_admin', 'instructor', 'learner']
  },
  {
    id: 'w-quick-actions-1',
    type: 'quick_actions',
    title: 'Executive LMS Dispatcher',
    subtitle: 'Quick operational actions and escalation alerts',
    colSpan: 2,
    visibleForRoles: ['super_admin', 'tenant_admin']
  }
];

export const CATALOG_WIDGET_TEMPLATES: { type: DashboardWidgetType; name: string; description: string; defaultColSpan: 1 | 2 | 3 | 4; icon: string; category: string }[] = [
  {
    type: 'kpi_grid',
    name: 'Dynamic KPI Metrics Grid',
    description: '4-card responsive KPI matrix adapting to active role (Learners, Compliance, Completed, Certificates).',
    defaultColSpan: 4,
    icon: 'speed',
    category: 'KPIs & Summary'
  },
  {
    type: 'kpi_highlight',
    name: 'Compliance Health Focus Gauge',
    description: 'High-impact circular radial progress metric displaying tenant target compliance score.',
    defaultColSpan: 1,
    icon: 'donut_large',
    category: 'KPIs & Summary'
  },
  {
    type: 'announcement_banner',
    name: 'Broadcast Announcement Banner',
    description: 'Customizable alert banner for tenant-wide announcements, deadlines, or welcome notices.',
    defaultColSpan: 4,
    icon: 'campaign',
    category: 'Operational'
  },
  {
    type: 'chart_department_matrix',
    name: 'Department Completion & Compliance Matrix',
    description: 'Detailed horizontal progress bar matrix showing completion rates and overdue counts by department.',
    defaultColSpan: 2,
    icon: 'bar_chart',
    category: 'Analytics & Charts'
  },
  {
    type: 'chart_enrollment_trends',
    name: 'Enrollment & Completion Velocity Trend',
    description: 'Smooth SVG area chart visualizing monthly cohort enrollment growth and completions.',
    defaultColSpan: 2,
    icon: 'show_chart',
    category: 'Analytics & Charts'
  },
  {
    type: 'chart_compliance_gauge',
    name: 'Regulatory Compliance vs Risk Breakdown',
    description: 'Visual breakdown of Compliant vs At-Risk vs Overdue learners with percentage indicators.',
    defaultColSpan: 2,
    icon: 'pie_chart',
    category: 'Analytics & Charts'
  },
  {
    type: 'chart_activity_heatmap',
    name: '7-Day Learning Activity Heatmap',
    description: 'Daily activity heatmap visualizing peak learning hours across the organization.',
    defaultColSpan: 2,
    icon: 'calendar_view_week',
    category: 'Analytics & Charts'
  },
  {
    type: 'learner_in_progress',
    name: 'In-Progress Learning Path Carousel',
    description: 'Resume active lessons, view progress percentage, and launch interactive course players.',
    defaultColSpan: 3,
    icon: 'play_circle',
    category: 'Courseware'
  },
  {
    type: 'escalation_queue',
    name: 'Overdue Compliance Escalation Queue',
    description: 'Personnel roster at risk of missing compliance deadlines with 1-click reminder triggers.',
    defaultColSpan: 2,
    icon: 'priority_high',
    category: 'Operational'
  },
  {
    type: 'live_audit_feed',
    name: 'Live Tamper-Proof Audit Feed',
    description: 'Real-time security log stream of all tenant actions, certificate issuances, and enrollments.',
    defaultColSpan: 2,
    icon: 'history_toggle_off',
    category: 'Security & Audit'
  },
  {
    type: 'upcoming_webinars',
    name: 'Upcoming Live Virtual Classrooms',
    description: 'Scheduled instructor webinars, attendee counters, platform badges, and direct Join links.',
    defaultColSpan: 2,
    icon: 'videocam',
    category: 'Live Sessions'
  },
  {
    type: 'gamification_leaderboard',
    name: 'Skill Mastery Leaderboard & Badges',
    description: 'Top organizational learners ranked by XP points, earned badges, and milestone awards.',
    defaultColSpan: 1,
    icon: 'military_tech',
    category: 'Gamification'
  },
  {
    type: 'quick_actions',
    name: 'Executive LMS Dispatcher',
    description: 'Quick-access action hub for sending reminders, adding learners, creating courses, and downloading audit reports.',
    defaultColSpan: 2,
    icon: 'bolt',
    category: 'Operational'
  },
  {
    type: 'certificates_ticker',
    name: 'Verified Certificates Issuance Ticker',
    description: 'Live ticker of recently earned tamper-proof credentials with verification codes.',
    defaultColSpan: 2,
    icon: 'verified',
    category: 'Credentials'
  }
];

@Injectable({
  providedIn: 'root'
})
export class LmsDataService {
  // Core reactive signals
  tenants = signal<Tenant[]>(INITIAL_TENANTS);
  activeTenantId = signal<string>('tenant-acme');
  activeRole = signal<UserRole>('tenant_admin');
  courses = signal<Course[]>(INITIAL_COURSES);
  users = signal<User[]>(INITIAL_USERS);
  enrollments = signal<CourseEnrollment[]>(INITIAL_ENROLLMENTS);
  certificates = signal<Certificate[]>(INITIAL_CERTIFICATES);
  webinars = signal<LiveWebinar[]>(INITIAL_WEBINARS);
  auditLogs = signal<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Admin Layout Preferences Signal
  adminLayoutPreferences = signal<AdminLayoutPreferences>({
    navigationMode: 'sidebar', // 'sidebar' | 'top_menu' | 'compact_rail'
    headerDensity: 'comfortable', // 'comfortable' | 'compact'
    showBreadcrumbs: true,
    stickyHeader: true,
    contentWidth: 'fluid',
    accentMode: 'brand'
  });

  // Multi-Tenant Customizable Dashboards Store
  tenantDashboards = signal<Record<string, CustomTenantDashboard>>({
    'tenant-acme': {
      tenantId: 'tenant-acme',
      isPublished: true,
      publishedAt: '2025-02-18 10:30 AM',
      publishedBy: 'Clara Oswald (Tenant Admin)',
      version: 1,
      widgets: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_WIDGETS))
    },
    'tenant-stanford': {
      tenantId: 'tenant-stanford',
      isPublished: true,
      publishedAt: '2025-02-15 02:15 PM',
      publishedBy: 'Provost Admin',
      version: 1,
      widgets: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_WIDGETS))
    },
    'tenant-apexhealth': {
      tenantId: 'tenant-apexhealth',
      isPublished: true,
      publishedAt: '2025-02-10 09:00 AM',
      publishedBy: 'Dr. Sarah Jenkins',
      version: 1,
      widgets: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_WIDGETS))
    },
    'tenant-finedge': {
      tenantId: 'tenant-finedge',
      isPublished: true,
      publishedAt: '2025-02-12 11:45 AM',
      publishedBy: 'Victoria Sterling',
      version: 1,
      widgets: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_WIDGETS))
    }
  });

  // Active Tenant Dashboard Computed
  activeTenantDashboard = computed<CustomTenantDashboard>(() => {
    const tenantId = this.activeTenantId();
    const dashboards = this.tenantDashboards();
    if (dashboards[tenantId]) {
      return dashboards[tenantId];
    }
    return {
      tenantId,
      isPublished: false,
      publishedAt: 'Not published yet',
      publishedBy: 'System Default',
      version: 1,
      widgets: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_WIDGETS))
    };
  });

  // Search & Filter state
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');
  selectedDepartment = signal<string>('All');

  // Currently active tenant computed
  activeTenant = computed<Tenant>(() => {
    const list = this.tenants();
    const current = list.find(t => t.id === this.activeTenantId());
    return current || list[0];
  });

  // Currently active user based on activeTenant and activeRole
  activeUser = computed<User>(() => {
    const currentTenantId = this.activeTenantId();
    const currentRole = this.activeRole();
    const tenantUsers = this.users().filter(u => u.tenantId === currentTenantId);

    // Look for matching user role in tenant
    const matched = tenantUsers.find(u => u.role === currentRole);
    if (matched) return matched;

    if (currentRole === 'super_admin') {
      return {
        id: 'usr-super-admin',
        tenantId: 'global',
        name: 'Alexandre Sterling',
        email: 'superadmin@omnilearn-cloud.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'super_admin',
        department: 'Global Platform Operations',
        enrolledCourses: [],
        completedCourses: [],
        earnedCertificates: [],
        points: 9999,
        badges: ['Super Admin', 'Platform Architect'],
        lastActive: 'Just now',
        status: 'Active',
        complianceStatus: 'Compliant'
      };
    }

    // Default fallback
    return tenantUsers[0] || {
      id: 'usr-default',
      tenantId: currentTenantId,
      name: 'Default User',
      email: 'user@tenant.io',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: currentRole,
      department: 'General',
      enrolledCourses: [],
      completedCourses: [],
      earnedCertificates: [],
      points: 500,
      badges: [],
      lastActive: 'Just now',
      status: 'Active',
      complianceStatus: 'Compliant'
    };
  });

  // Filtered courses for active tenant
  tenantCourses = computed<Course[]>(() => {
    const tenantId = this.activeTenantId();
    const role = this.activeRole();
    const all = this.courses();

    // If super admin, they can see all courses or filter
    if (role === 'super_admin') {
      return all;
    }
    return all.filter(c => c.tenantId === tenantId || c.tenantId === 'global');
  });

  // Filtered users for active tenant
  tenantUsers = computed<User[]>(() => {
    const tenantId = this.activeTenantId();
    const role = this.activeRole();
    if (role === 'super_admin') {
      return this.users();
    }
    return this.users().filter(u => u.tenantId === tenantId);
  });

  // Filtered certificates for active tenant
  tenantCertificates = computed<Certificate[]>(() => {
    const tenantId = this.activeTenantId();
    const role = this.activeRole();
    if (role === 'super_admin') {
      return this.certificates();
    }
    return this.certificates().filter(c => c.tenantId === tenantId);
  });

  // Department metrics for active tenant
  departmentMetrics = computed<DepartmentMetric[]>(() => {
    const tenant = this.activeTenant();
    const users = this.tenantUsers();
    
    return tenant.departments.map(dept => {
      const deptUsers = users.filter(u => u.department === dept);
      const learnersCount = deptUsers.length;
      const overdueCount = deptUsers.filter(u => u.complianceStatus === 'Overdue').length;
      const compliantCount = deptUsers.filter(u => u.complianceStatus === 'Compliant').length;
      const complianceRate = learnersCount > 0 ? Math.round((compliantCount / learnersCount) * 100) : 100;
      
      const avgCompletionRate = learnersCount > 0 
        ? Math.round(deptUsers.reduce((sum, u) => sum + (u.completedCourses.length > 0 ? 100 : 45), 0) / learnersCount) 
        : 85;

      return {
        department: dept,
        learnersCount: learnersCount || 1,
        avgCompletionRate,
        complianceRate,
        overdueCount
      };
    });
  });

  constructor() {
    // Dynamic CSS theme injection effect whenever active tenant changes
    effect(() => {
      const tenant = this.activeTenant();
      if (tenant && tenant.branding) {
        this.applyTenantTheme(tenant.branding.primaryColor, tenant.branding.accentColor);
      }
    });
  }

  // Switch tenant
  switchTenant(tenantId: string) {
    this.activeTenantId.set(tenantId);
    this.logAction('Tenant Switch', `Switched active workspace to: ${this.activeTenant().name}`, 'info');
  }

  // Switch role
  switchRole(role: UserRole) {
    this.activeRole.set(role);
  }

  // Apply tenant branding CSS custom properties
  private applyTenantTheme(primary: string, accent: string) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--tenant-primary', primary);
    root.style.setProperty('--tenant-primary-hover', this.adjustColor(primary, -20));
    root.style.setProperty('--tenant-primary-dark', this.adjustColor(primary, -40));
    root.style.setProperty('--tenant-accent', accent);
    root.style.setProperty('--tenant-50', this.hexToRgba(primary, 0.08));
    root.style.setProperty('--tenant-100', this.hexToRgba(primary, 0.15));
    root.style.setProperty('--tenant-200', this.hexToRgba(primary, 0.25));
  }

  private hexToRgba(hex: string, alpha: number): string {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private adjustColor(color: string, amount: number): string {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  // Add new tenant
  addTenant(newTenant: Partial<Tenant>): Tenant {
    const id = `tenant-${newTenant.slug || 'org-' + Date.now()}`;
    const tenant: Tenant = {
      id,
      name: newTenant.name || 'New Organization Academy',
      slug: newTenant.slug || 'new-org',
      domain: newTenant.domain || `${newTenant.slug}.lmscloud.io`,
      plan: newTenant.plan || 'Starter',
      status: 'Active',
      adminEmail: newTenant.adminEmail || 'admin@neworg.io',
      createdAt: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      branding: {
        primaryColor: newTenant.branding?.primaryColor || '#4f46e5',
        accentColor: newTenant.branding?.accentColor || '#06b6d4',
        tagline: newTenant.branding?.tagline || 'Custom Enterprise Learning Experience',
        bannerUrl: newTenant.branding?.bannerUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        logoUrl: newTenant.branding?.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        customCssEnabled: true,
        ssoProvider: newTenant.branding?.ssoProvider || 'None'
      },
      departments: newTenant.departments && newTenant.departments.length > 0 
        ? newTenant.departments 
        : ['Engineering', 'Marketing', 'Sales', 'Operations'],
      stats: {
        seatLimit: newTenant.stats?.seatLimit || 500,
        seatsUsed: 1,
        totalCourses: 2,
        totalLearners: 1,
        completionRate: 0,
        complianceRate: 100,
        storageUsedGb: 5.0,
        storageLimitGb: 200
      },
      features: {
        scormSupport: true,
        aiTutor: true,
        liveWebinars: true,
        customCertificates: true,
        whiteLabel: newTenant.plan === 'Enterprise',
        customDomain: true
      }
    };

    this.tenants.update(list => [tenant, ...list]);
    this.activeTenantId.set(tenant.id);
    this.logAction('Tenant Provisioned', `New tenant created: ${tenant.name} (${tenant.plan} Plan)`, 'success');
    return tenant;
  }

  // Update existing tenant settings & branding
  updateTenant(updatedTenant: Tenant) {
    this.tenants.update(list => list.map(t => t.id === updatedTenant.id ? updatedTenant : t));
    this.logAction('Tenant Settings Updated', `Updated branding & config for ${updatedTenant.name}`, 'info');
  }

  // Toggle tenant status
  toggleTenantStatus(tenantId: string) {
    this.tenants.update(list => list.map(t => {
      if (t.id === tenantId) {
        const nextStatus = t.status === 'Active' ? 'Suspended' : 'Active';
        this.logAction('Tenant Status Changed', `${t.name} status updated to ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'danger');
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  }

  // Add course
  addCourse(newCourse: Partial<Course>): Course {
    const tenantId = this.activeRole() === 'super_admin' ? (newCourse.tenantId || 'global') : this.activeTenantId();
    const course: Course = {
      id: `course-${Date.now()}`,
      tenantId,
      title: newCourse.title || 'Untitled Course',
      subtitle: newCourse.subtitle || '',
      description: newCourse.description || '',
      coverImage: newCourse.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      category: newCourse.category || 'Engineering',
      level: newCourse.level || 'Beginner',
      durationMinutes: newCourse.durationMinutes || 60,
      isMandatory: newCourse.isMandatory || false,
      complianceDeadlineDays: newCourse.complianceDeadlineDays,
      instructorName: newCourse.instructorName || this.activeUser().name,
      instructorTitle: newCourse.instructorTitle || 'Course Instructor',
      instructorAvatar: newCourse.instructorAvatar || this.activeUser().avatar,
      rating: 5.0,
      reviewCount: 1,
      enrolledCount: 0,
      certificateEnabled: newCourse.certificateEnabled ?? true,
      status: 'Published',
      tags: newCourse.tags || ['Training'],
      createdAt: new Date().toISOString().split('T')[0],
      targetDepartments: newCourse.targetDepartments || this.activeTenant().departments,
      modules: newCourse.modules || [
        {
          id: `mod-${Date.now()}-1`,
          title: 'Module 1: Introduction & Fundamentals',
          durationMinutes: 30,
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: '1.1 Course Overview & Key Objectives',
              type: 'article',
              durationMinutes: 10,
              summary: 'Welcome to this comprehensive course. Review objectives and roadmap.',
              contentHtml: '<p class="text-text-secondary">Welcome to this course module. Complete all lessons and knowledge checks to earn your verified certificate.</p>'
            }
          ]
        }
      ]
    };

    this.courses.update(list => [course, ...list]);
    this.logAction('Course Created', `New course published: ${course.title}`, 'success');
    return course;
  }

  // Enroll in course
  enrollInCourse(courseId: string, userId: string): CourseEnrollment {
    const existing = this.enrollments().find(e => e.courseId === courseId && e.userId === userId);
    if (existing) return existing;

    const newEnrollment: CourseEnrollment = {
      id: `enr-${Date.now()}`,
      tenantId: this.activeTenantId(),
      userId,
      courseId,
      progressPercent: 0,
      completedLessonIds: [],
      quizScores: {},
      status: 'in_progress',
      startedAt: new Date().toISOString()
    };

    this.enrollments.update(list => [newEnrollment, ...list]);
    
    // Update user enrolled courses
    this.users.update(list => list.map(u => {
      if (u.id === userId && !u.enrolledCourses.includes(courseId)) {
        return { ...u, enrolledCourses: [...u.enrolledCourses, courseId] };
      }
      return u;
    }));

    // Increment course enrolled count
    this.courses.update(list => list.map(c => {
      if (c.id === courseId) {
        return { ...c, enrolledCount: c.enrolledCount + 1 };
      }
      return c;
    }));

    this.logAction('Course Enrolled', `User enrolled in course (${courseId})`, 'info');
    return newEnrollment;
  }

  // Mark lesson completed and update progress / certificate trigger
  completeLesson(courseId: string, lessonId: string, userId: string, quizScore?: number) {
    let enrollment = this.enrollments().find(e => e.courseId === courseId && e.userId === userId);
    if (!enrollment) {
      enrollment = this.enrollInCourse(courseId, userId);
    }

    const course = this.courses().find(c => c.id === courseId);
    if (!course) return;

    // Total lessons count
    let allLessons: string[] = [];
    course.modules.forEach(m => m.lessons.forEach(l => allLessons.push(l.id)));
    const totalLessons = allLessons.length;

    const completedIds = Array.from(new Set([...enrollment.completedLessonIds, lessonId]));
    const progressPercent = Math.min(100, Math.round((completedIds.length / totalLessons) * 100));
    const isCompleted = progressPercent === 100;

    const updatedQuizScores = { ...enrollment.quizScores };
    if (quizScore !== undefined) {
      updatedQuizScores[lessonId] = quizScore;
    }

    this.enrollments.update(list => list.map(e => {
      if (e.id === enrollment!.id) {
        return {
          ...e,
          completedLessonIds: completedIds,
          progressPercent,
          quizScores: updatedQuizScores,
          status: isCompleted ? 'completed' : 'in_progress',
          completedAt: isCompleted ? new Date().toISOString() : e.completedAt
        };
      }
      return e;
    }));

    // If 100% completed, award certificate and user points
    if (isCompleted && !this.certificates().some(c => c.courseId === courseId && c.userId === userId)) {
      this.issueCertificate(course, userId);
    }
  }

  // Issue dynamic certificate
  issueCertificate(course: Course, userId: string): Certificate {
    const user = this.users().find(u => u.id === userId) || this.activeUser();
    const tenant = this.activeTenant();

    const certId = `cert-${Date.now().toString().slice(-5)}`;
    const verificationCode = `${tenant.slug.slice(0, 3).toUpperCase()}-${course.category.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newCert: Certificate = {
      id: certId,
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantLogo: tenant.branding.logoUrl,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      courseId: course.id,
      courseTitle: course.title,
      category: course.category,
      issuedDate: new Date().toISOString().split('T')[0],
      verificationCode,
      gradeScore: 98,
      instructorName: course.instructorName,
      expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    this.certificates.update(list => [newCert, ...list]);

    // Update user achievements
    this.users.update(list => list.map(u => {
      if (u.id === userId) {
        const completedCourses = Array.from(new Set([...u.completedCourses, course.id]));
        const earnedCertificates = Array.from(new Set([...u.earnedCertificates, certId]));
        const newPoints = u.points + 250;
        return {
          ...u,
          completedCourses,
          earnedCertificates,
          points: newPoints,
          complianceStatus: 'Compliant'
        };
      }
      return u;
    }));

    this.logAction('Certificate Issued', `Earned verified certificate for "${course.title}" (${verificationCode})`, 'success');
    return newCert;
  }

  // Add user to tenant
  addUser(newUser: Partial<User>): User {
    const tenantId = newUser.tenantId || this.activeTenantId();
    const user: User = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      tenantId,
      name: newUser.name || 'New Learner',
      email: newUser.email || 'learner@domain.io',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: newUser.role || 'learner',
      department: newUser.department || this.activeTenant().departments[0] || 'General',
      enrolledCourses: [],
      completedCourses: [],
      earnedCertificates: [],
      points: 100,
      badges: ['Welcome'],
      lastActive: 'Just now',
      status: 'Active',
      complianceStatus: 'Compliant'
    };

    this.users.update(list => [user, ...list]);
    
    // Update tenant seat stats
    this.tenants.update(list => list.map(t => {
      if (t.id === tenantId) {
        return {
          ...t,
          stats: {
            ...t.stats,
            seatsUsed: Math.min(t.stats.seatLimit, t.stats.seatsUsed + 1),
            totalLearners: t.stats.totalLearners + 1
          }
        };
      }
      return t;
    }));

    this.logAction('User Invited', `Added user: ${user.name} (${user.email}) -> ${user.department}`, 'success');
    return user;
  }

  // Trigger automated compliance reminder
  sendComplianceReminders(department?: string): number {
    const overdueUsers = this.tenantUsers().filter(u => 
      u.complianceStatus === 'Overdue' || u.complianceStatus === 'At Risk'
    );
    const count = department ? overdueUsers.filter(u => u.department === department).length : overdueUsers.length;
    this.logAction('Compliance Reminders Dispatched', `Sent automated email notifications to ${count} personnel at risk`, 'warning');
    return count;
  }

  // Schedule Live Webinar
  addWebinar(newWebinar: Partial<LiveWebinar>): LiveWebinar {
    const webinar: LiveWebinar = {
      id: `web-${Date.now().toString().slice(-5)}`,
      tenantId: this.activeTenantId(),
      title: newWebinar.title || 'Live Virtual Classroom',
      description: newWebinar.description || 'Live instructor session',
      instructor: newWebinar.instructor || this.activeUser().name,
      instructorAvatar: newWebinar.instructorAvatar || this.activeUser().avatar,
      scheduledAt: newWebinar.scheduledAt || new Date(Date.now() + 86400000).toISOString(),
      durationMinutes: newWebinar.durationMinutes || 60,
      attendeeCount: 1,
      maxAttendees: newWebinar.maxAttendees || 250,
      platform: newWebinar.platform || 'Built-in WebRTC',
      status: 'Upcoming',
      joinUrl: '#'
    };

    this.webinars.update(list => [webinar, ...list]);
    this.logAction('Webinar Scheduled', `Live session created: "${webinar.title}"`, 'info');
    return webinar;
  }

  // Log system actions
  private logAction(action: string, target: string, severity: 'info' | 'warning' | 'success' | 'danger') {
    const tenant = this.activeTenant();
    const user = this.activeUser();
    const newLog: AuditLog = {
      id: `log-${Date.now().toString().slice(-6)}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      actor: user.name,
      actorRole: user.role === 'super_admin' ? 'Super Admin' : user.role === 'tenant_admin' ? 'Tenant Admin' : user.role,
      action,
      target,
      timestamp: 'Just now',
      severity,
      ipAddress: '192.168.1.1'
    };

    this.auditLogs.update(list => [newLog, ...list.slice(0, 49)]);
  }

  // Update Admin Layout Preferences
  updateLayoutPreferences(prefs: Partial<AdminLayoutPreferences>) {
    this.adminLayoutPreferences.update(current => ({
      ...current,
      ...prefs
    }));
    this.logAction('Layout Customization Changed', `Switched layout to navigation mode: ${prefs.navigationMode || this.adminLayoutPreferences().navigationMode}`, 'info');
  }

  // Publish / Save Custom Tenant Dashboard
  publishTenantDashboard(tenantId: string, widgets: DashboardWidget[], publishedByName?: string): CustomTenantDashboard {
    const user = this.activeUser();
    const current = this.tenantDashboards()[tenantId];
    const newVersion = current ? current.version + 1 : 1;

    const published: CustomTenantDashboard = {
      tenantId,
      isPublished: true,
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      publishedBy: publishedByName || `${user.name} (${user.role === 'super_admin' ? 'Super Admin' : 'Tenant Admin'})`,
      version: newVersion,
      widgets: JSON.parse(JSON.stringify(widgets))
    };

    this.tenantDashboards.update(map => ({
      ...map,
      [tenantId]: published
    }));

    this.logAction('Custom Dashboard Published', `Published v${newVersion} dashboard layout with ${widgets.length} modular widgets for tenant ${this.activeTenant().name}`, 'success');
    return published;
  }

  // Reset Tenant Dashboard to standard default widgets
  resetTenantDashboard(tenantId: string): CustomTenantDashboard {
    const user = this.activeUser();
    const defaults: CustomTenantDashboard = {
      tenantId,
      isPublished: true,
      publishedAt: 'Reset to System Default',
      publishedBy: user.name,
      version: 1,
      widgets: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_WIDGETS))
    };

    this.tenantDashboards.update(map => ({
      ...map,
      [tenantId]: defaults
    }));

    this.logAction('Dashboard Reset', `Reset dashboard layout to factory template for ${this.activeTenant().name}`, 'warning');
    return defaults;
  }
}

