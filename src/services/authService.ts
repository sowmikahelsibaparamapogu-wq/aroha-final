import { AuthUser, UserRole } from '../types/scholarship';

export const DEMO_STUDENTS: AuthUser[] = [
  {
    id: 'user_sowmika',
    role: 'student',
    name: 'Sowmika Helsiba Paramapogu',
    email: 'sowmikahelsibaparamapogu@gmail.com',
    identifier: 'NFST/2025/0812',
    community: 'Gond',
    state: 'Telangana',
    designation: 'Ph.D. Scholar in Biotechnology, Univ. of Hyderabad',
    scheme: 'NFST',
    associatedAppId: 'app_nfst_001',
    avatarType: 'scholar_female',
    department: 'Tribal Pharmacognosy & Indigenous Medicine',
  },
  {
    id: 'user_birsa',
    role: 'student',
    name: 'Birsa Dev Munda',
    email: 'birsa.munda.nos@gov.in',
    identifier: 'NOS/2025/0419',
    community: 'Munda',
    state: 'Jharkhand',
    designation: 'M.Sc. Scholar (University of Oxford, QS #3)',
    scheme: 'NOS',
    associatedAppId: 'app_nos_002',
    avatarType: 'scholar_male',
    department: 'Advanced Materials & Sustainable Mining',
  },
  {
    id: 'user_fresh',
    role: 'student',
    name: 'Arjun Oraon',
    email: 'arjun.oraon.st@gmail.com',
    identifier: 'ST-REG-2025-009',
    community: 'Oraon',
    state: 'Odisha',
    designation: 'Prospective M.Phil / Ph.D. Candidate',
    scheme: 'NFST',
    avatarType: 'scholar_fresh',
    department: 'Tribal Agroforestry & Ecology',
  },
];

export const DEMO_OFFICERS: AuthUser[] = [
  {
    id: 'officer_soren',
    role: 'officer',
    name: 'Dr. Rajeshwar Soren, IES',
    email: 'soren.r@mota.gov.in',
    identifier: 'MOTA-DESK4-092',
    designation: 'Senior Scrutiny & Verification Officer',
    department: 'Desk-IV Scrutiny Division, MoTA, New Delhi',
    avatarType: 'officer_senior',
  },
  {
    id: 'officer_toppo',
    role: 'officer',
    name: 'Ananya Toppo',
    email: 'toppo.a@mota.gov.in',
    identifier: 'MOTA-FIELD-044',
    designation: 'Field Verification & Document Authenticator',
    department: 'Central Tribal Research Institute, Ranchi',
    avatarType: 'officer_field',
  },
];

export const DEMO_ADMINS: AuthUser[] = [
  {
    id: 'admin_lakra',
    role: 'admin',
    name: 'Deepa Lakra, Director',
    email: 'lakra.d@tribal.gov.in',
    identifier: 'MOTA-MERIT-DIR',
    designation: 'Director of Scholarships & National Merit Board',
    department: 'Tribal Welfare Division, MoTA, New Delhi',
    avatarType: 'officer_director',
  },
  {
    id: 'admin_rathod',
    role: 'admin',
    name: 'Vikram Rathod, Joint Secy',
    email: 'rathod.v@pfms.gov.in',
    identifier: 'PFMS-MOTA-DBT',
    designation: 'PFMS Direct Benefit Transfer Comptroller',
    department: 'Public Financial Management System (PFMS)',
    avatarType: 'officer_finance',
  },
];

export const DEMO_SUPERVISORS: AuthUser[] = [
  {
    id: 'supervisor_meena',
    role: 'supervisor',
    name: 'Dr. Hemant Kumar Meena, IAS',
    email: 'meena.hk@gov.in',
    identifier: 'MOTA-JS-001',
    designation: 'Joint Secretary (Tribal Development & Policy)',
    department: 'Ministry of Tribal Affairs, Shastri Bhawan',
    avatarType: 'officer_ias',
  },
  {
    id: 'supervisor_suniti',
    role: 'supervisor',
    name: 'Prof. Suniti Soren',
    email: 'suniti.soren@tribalcouncil.org',
    identifier: 'MOTA-APEX-CHAIR',
    designation: 'National Screening Committee Chairperson',
    department: 'National Apex Evaluation Council for Tribal Higher Ed',
    avatarType: 'officer_chair',
  },
];

// Backward compatibility export
export const DEMO_APPLICANTS = DEMO_STUDENTS;

const AUTH_STORAGE_KEY = 'aroha_current_auth_user';

export class AuthService {
  public static getCurrentUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const user = JSON.parse(raw);
        // Normalize role if legacy applicant
        if (user.role === 'applicant') user.role = 'student';
        return user;
      }
    } catch {
      // ignore
    }
    return DEMO_STUDENTS[0];
  }

  public static setCurrentUser(user: AuthUser | null): void {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }

  public static loginAs(user: AuthUser): void {
    this.setCurrentUser(user);
  }

  public static logout(): void {
    this.setCurrentUser(null);
  }

  public static getDemoUsersForRole(role: UserRole): AuthUser[] {
    switch (role) {
      case 'student':
      case 'applicant':
        return DEMO_STUDENTS;
      case 'officer':
        return DEMO_OFFICERS;
      case 'admin':
        return DEMO_ADMINS;
      case 'supervisor':
        return DEMO_SUPERVISORS;
      default:
        return DEMO_STUDENTS;
    }
  }
}
