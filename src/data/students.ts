/**
 * Centralized synthetic demonstration data for WellAware.
 *
 * NOTE: ML feature names here MUST exactly match the FastAPI /predict
 * request schema (attendance_rate, attendance_change, etc.).
 */

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH";

export interface StudentFeatures {
  attendance_rate: number;
  attendance_change: number;
  assignment_completion: number;
  missed_assignments: number;
  average_grade: number;
  grade_change: number;
  late_submissions: number;
  engagement_score: number;
  engagement_change: number;
  classes_missed: number;
}

export interface Student extends StudentFeatures {
  id: string;
  name: string;
  studentId: string;
  program: string;
  year: number;
  email: string;
  initials: string;
  avatarTone: "teal" | "rose" | "amber" | "sky" | "violet" | "slate";
  keySignals: string[];
  lastUpdated: string;
  timeline: { week: string; label: string; detail: string; status: "stable" | "watch" | "active" }[];
  advisor: string;
  hostelResident: boolean;
}

/**
 * Exact feature vector from the product brief for the primary demo student.
 * The prediction for this student is NEVER hardcoded — it always comes
 * from the FastAPI ML service.
 */
export const arjun: Student = {
  id: "arjun",
  name: "Arjun Kumar",
  studentId: "23IT1042",
  program: "B.Tech • Information Technology",
  year: 2,
  email: "arjun.kumar@university.edu",
  initials: "AK",
  avatarTone: "rose",
  attendance_rate: 62,
  attendance_change: -24,
  assignment_completion: 55,
  missed_assignments: 3,
  average_grade: 68,
  grade_change: -11,
  late_submissions: 4,
  engagement_score: 35,
  engagement_change: -20,
  classes_missed: 8,
  keySignals: ["Attendance ↓ 24%", "3 missed assignments", "Engagement ↓ 20%"],
  lastUpdated: "12 min ago",
  advisor: "Dr. Meera Iyer",
  hostelResident: true,
  timeline: [
    { week: "Week 1", label: "Stable", detail: "Attendance 86% · all submissions on time", status: "stable" },
    { week: "Week 2", label: "Attendance declining", detail: "Attendance down 12 pts · 2 classes missed", status: "watch" },
    { week: "Week 3", label: "Assignments missed", detail: "3 assignments missed · 4 late submissions", status: "watch" },
    { week: "Week 4", label: "Multiple changing signals detected", detail: "Attendance ↓ 24 pts · engagement ↓ 20 pts", status: "active" },
  ],
};

export const students: Student[] = [
  arjun,
  {
    id: "sneha",
    name: "Sneha Rao",
    studentId: "23CS1088",
    program: "B.Tech • Computer Science",
    year: 2,
    email: "sneha.rao@university.edu",
    initials: "SR",
    avatarTone: "amber",
    attendance_rate: 74,
    attendance_change: -9,
    assignment_completion: 72,
    missed_assignments: 1,
    average_grade: 71,
    grade_change: -6,
    late_submissions: 2,
    engagement_score: 48,
    engagement_change: -14,
    classes_missed: 5,
    keySignals: ["Attendance ↓ 9%", "Engagement ↓ 14%", "2 late submissions"],
    lastUpdated: "32 min ago",
    advisor: "Dr. Meera Iyer",
    hostelResident: false,
    timeline: [
      { week: "Week 1", label: "Stable", detail: "Attendance 83% · engagement steady", status: "stable" },
      { week: "Week 2", label: "Slight decline", detail: "Attendance down 5 pts", status: "watch" },
      { week: "Week 3", label: "Engagement slipping", detail: "LMS activity down 14 pts", status: "watch" },
      { week: "Week 4", label: "Multiple changing signals", detail: "Attendance ↓ 9 pts · grade ↓ 6 pts", status: "active" },
    ],
  },
  {
    id: "rahul",
    name: "Rahul Mehta",
    studentId: "22EC1171",
    program: "B.Tech • Electronics",
    year: 3,
    email: "rahul.mehta@university.edu",
    initials: "RM",
    avatarTone: "teal",
    attendance_rate: 92,
    attendance_change: -2,
    assignment_completion: 95,
    missed_assignments: 0,
    average_grade: 84,
    grade_change: -1,
    late_submissions: 0,
    engagement_score: 86,
    engagement_change: -3,
    classes_missed: 1,
    keySignals: ["Stable"],
    lastUpdated: "1 hr ago",
    advisor: "Dr. Anand Rao",
    hostelResident: false,
    timeline: [
      { week: "Week 1", label: "Stable", detail: "Attendance 94% · strong engagement", status: "stable" },
      { week: "Week 2", label: "Stable", detail: "Attendance 93% · all on time", status: "stable" },
      { week: "Week 3", label: "Stable", detail: "Attendance 92% · grade steady", status: "stable" },
      { week: "Week 4", label: "Stable", detail: "No meaningful signal changes", status: "stable" },
    ],
  },
  {
    id: "priya",
    name: "Priya Nair",
    studentId: "23ME2210",
    program: "B.Tech • Mechanical",
    year: 2,
    email: "priya.nair@university.edu",
    initials: "PN",
    avatarTone: "violet",
    attendance_rate: 68,
    attendance_change: -15,
    assignment_completion: 64,
    missed_assignments: 2,
    average_grade: 66,
    grade_change: -8,
    late_submissions: 3,
    engagement_score: 42,
    engagement_change: -11,
    classes_missed: 7,
    keySignals: ["Attendance ↓ 15%", "Grade ↓ 8%", "2 missed assignments"],
    lastUpdated: "1 hr ago",
    advisor: "Dr. Kavita Menon",
    hostelResident: true,
    timeline: [
      { week: "Week 1", label: "Stable", detail: "Attendance 83%", status: "stable" },
      { week: "Week 2", label: "Attendance declining", detail: "Down 8 pts · 3 classes missed", status: "watch" },
      { week: "Week 3", label: "Grades slipping", detail: "Grade ↓ 8 pts · late submissions", status: "watch" },
      { week: "Week 4", label: "Multiple changing signals", detail: "Attendance ↓ 15 pts · engagement ↓ 11 pts", status: "active" },
    ],
  },
  {
    id: "vikram",
    name: "Vikram Singh",
    studentId: "22CE0455",
    program: "B.Tech • Civil",
    year: 3,
    email: "vikram.singh@university.edu",
    initials: "VS",
    avatarTone: "sky",
    attendance_rate: 81,
    attendance_change: -6,
    assignment_completion: 78,
    missed_assignments: 1,
    average_grade: 73,
    grade_change: -4,
    late_submissions: 2,
    engagement_score: 58,
    engagement_change: -9,
    classes_missed: 3,
    keySignals: ["Engagement ↓ 9%", "2 late submissions"],
    lastUpdated: "2 hr ago",
    advisor: "Dr. Anand Rao",
    hostelResident: false,
    timeline: [
      { week: "Week 1", label: "Stable", detail: "Attendance 87%", status: "stable" },
      { week: "Week 2", label: "Stable", detail: "Attendance 85%", status: "stable" },
      { week: "Week 3", label: "Mild decline", detail: "LMS activity down 6 pts", status: "watch" },
      { week: "Week 4", label: "Watch list", detail: "Engagement ↓ 9 pts · late submissions", status: "active" },
    ],
  },
  {
    id: "ananya",
    name: "Ananya Iyer",
    studentId: "24CS0321",
    program: "B.Tech • Computer Science",
    year: 1,
    email: "ananya.iyer@university.edu",
    initials: "AI",
    avatarTone: "rose",
    attendance_rate: 88,
    attendance_change: -4,
    assignment_completion: 91,
    missed_assignments: 0,
    average_grade: 88,
    grade_change: -2,
    late_submissions: 1,
    engagement_score: 79,
    engagement_change: -5,
    classes_missed: 2,
    keySignals: ["Engagement ↓ 5%", "Stable overall"],
    lastUpdated: "3 hr ago",
    advisor: "Dr. Meera Iyer",
    hostelResident: true,
    timeline: [
      { week: "Week 1", label: "Strong start", detail: "Attendance 92%", status: "stable" },
      { week: "Week 2", label: "Stable", detail: "Attendance 90%", status: "stable" },
      { week: "Week 3", label: "Slight dip", detail: "Engagement ↓ 4 pts", status: "watch" },
      { week: "Week 4", label: "Mild watch", detail: "Engagement ↓ 5 pts · 1 late submission", status: "watch" },
    ],
  },
  {
    id: "dev",
    name: "Dev Patel",
    studentId: "23EE0874",
    program: "B.Tech • Electrical",
    year: 2,
    email: "dev.patel@university.edu",
    initials: "DP",
    avatarTone: "amber",
    attendance_rate: 70,
    attendance_change: -12,
    assignment_completion: 61,
    missed_assignments: 2,
    average_grade: 64,
    grade_change: -7,
    late_submissions: 3,
    engagement_score: 44,
    engagement_change: -10,
    classes_missed: 6,
    keySignals: ["Attendance ↓ 12%", "Grade ↓ 7%", "3 late submissions"],
    lastUpdated: "4 hr ago",
    advisor: "Dr. Kavita Menon",
    hostelResident: false,
    timeline: [
      { week: "Week 1", label: "Stable", detail: "Attendance 82%", status: "stable" },
      { week: "Week 2", label: "Attendance declining", detail: "Down 7 pts", status: "watch" },
      { week: "Week 3", label: "Assignments slipping", detail: "2 missed · 2 late", status: "watch" },
      { week: "Week 4", label: "Multiple changing signals", detail: "Attendance ↓ 12 pts · grade ↓ 7 pts", status: "active" },
    ],
  },
  {
    id: "ishaan",
    name: "Ishaan Verma",
    studentId: "24IT0915",
    program: "B.Tech • Information Technology",
    year: 1,
    email: "ishaan.verma@university.edu",
    initials: "IV",
    avatarTone: "teal",
    attendance_rate: 94,
    attendance_change: 1,
    assignment_completion: 97,
    missed_assignments: 0,
    average_grade: 90,
    grade_change: 2,
    late_submissions: 0,
    engagement_score: 92,
    engagement_change: 1,
    classes_missed: 1,
    keySignals: ["Stable"],
    lastUpdated: "5 hr ago",
    advisor: "Dr. Anand Rao",
    hostelResident: false,
    timeline: [
      { week: "Week 1", label: "Excellent", detail: "Attendance 93%", status: "stable" },
      { week: "Week 2", label: "Stable", detail: "Attendance 94%", status: "stable" },
      { week: "Week 3", label: "Stable", detail: "Attendance 93%", status: "stable" },
      { week: "Week 4", label: "Stable", detail: "All signals steady", status: "stable" },
    ],
  },
  {
    id: "meera",
    name: "Meera Joshi",
    studentId: "22CS1140",
    program: "B.Tech • Computer Science",
    year: 4,
    email: "meera.joshi@university.edu",
    initials: "MJ",
    avatarTone: "slate",
    attendance_rate: 65,
    attendance_change: -11,
    assignment_completion: 58,
    missed_assignments: 2,
    average_grade: 62,
    grade_change: -5,
    late_submissions: 4,
    engagement_score: 39,
    engagement_change: -8,
    classes_missed: 6,
    keySignals: ["Attendance ↓ 11%", "4 late submissions"],
    lastUpdated: "6 hr ago",
    advisor: "Dr. Meera Iyer",
    hostelResident: false,
    timeline: [
      { week: "Week 1", label: "Stable", detail: "Attendance 76%", status: "stable" },
      { week: "Week 2", label: "Attendance declining", detail: "Down 6 pts", status: "watch" },
      { week: "Week 3", label: "Late submissions", detail: "4 late · 1 missed", status: "watch" },
      { week: "Week 4", label: "Multiple changing signals", detail: "Attendance ↓ 11 pts · engagement ↓ 8 pts", status: "active" },
    ],
  },
  {
    id: "kabir",
    name: "Kabir Anand",
    studentId: "23EC0533",
    program: "B.Tech • Electronics",
    year: 2,
    email: "kabir.anand@university.edu",
    initials: "KA",
    avatarTone: "sky",
    attendance_rate: 76,
    attendance_change: -7,
    assignment_completion: 82,
    missed_assignments: 1,
    average_grade: 77,
    grade_change: -3,
    late_submissions: 1,
    engagement_score: 63,
    engagement_change: -6,
    classes_missed: 4,
    keySignals: ["Attendance ↓ 7%", "Engagement ↓ 6%"],
    lastUpdated: "8 hr ago",
    advisor: "Dr. Anand Rao",
    hostelResident: true,
    timeline: [
      { week: "Week 1", label: "Stable", detail: "Attendance 83%", status: "stable" },
      { week: "Week 2", label: "Stable", detail: "Attendance 81%", status: "stable" },
      { week: "Week 3", label: "Mild decline", detail: "Attendance down 4 pts", status: "watch" },
      { week: "Week 4", label: "Watch list", detail: "Attendance ↓ 7 pts · engagement ↓ 6 pts", status: "watch" },
    ],
  },
  {
    id: "tara",
    name: "Tara Menon",
    studentId: "24ME0188",
    program: "B.Tech • Mechanical",
    year: 1,
    email: "tara.menon@university.edu",
    initials: "TM",
    avatarTone: "violet",
    attendance_rate: 90,
    attendance_change: -1,
    assignment_completion: 93,
    missed_assignments: 0,
    average_grade: 85,
    grade_change: 1,
    late_submissions: 0,
    engagement_score: 84,
    engagement_change: 2,
    classes_missed: 1,
    keySignals: ["Stable"],
    lastUpdated: "9 hr ago",
    advisor: "Dr. Kavita Menon",
    hostelResident: true,
    timeline: [
      { week: "Week 1", label: "Strong start", detail: "Attendance 91%", status: "stable" },
      { week: "Week 2", label: "Stable", detail: "Attendance 90%", status: "stable" },
      { week: "Week 3", label: "Stable", detail: "Grade ↑ 1 pt", status: "stable" },
      { week: "Week 4", label: "Stable", detail: "All signals steady", status: "stable" },
    ],
  },
  {
    id: "rohan",
    name: "Rohan Das",
    studentId: "22IT1201",
    program: "B.Tech • Information Technology",
    year: 4,
    email: "rohan.das@university.edu",
    initials: "RD",
    avatarTone: "rose",
    attendance_rate: 83,
    attendance_change: -5,
    assignment_completion: 80,
    missed_assignments: 1,
    average_grade: 75,
    grade_change: -3,
    late_submissions: 2,
    engagement_score: 66,
    engagement_change: -7,
    classes_missed: 3,
    keySignals: ["Engagement ↓ 7%", "2 late submissions"],
    lastUpdated: "10 hr ago",
    advisor: "Dr. Kavita Menon",
    hostelResident: false,
    timeline: [
      { week: "Week 1", label: "Stable", detail: "Attendance 88%", status: "stable" },
      { week: "Week 2", label: "Stable", detail: "Attendance 86%", status: "stable" },
      { week: "Week 3", label: "Mild decline", detail: "Engagement ↓ 5 pts", status: "watch" },
      { week: "Week 4", label: "Watch list", detail: "Engagement ↓ 7 pts", status: "watch" },
    ],
  },
];

export function getStudentById(id: string | undefined): Student | undefined {
  return students.find((s) => s.id === id);
}

/** Directory snapshot values used for directory tables (still predicted live on profile pages). */
export const directoryPriorities: Record<string, PriorityLevel> = {
  arjun: "HIGH",
  sneha: "MEDIUM",
  rahul: "LOW",
  priya: "HIGH",
  vikram: "MEDIUM",
  ananya: "LOW",
  dev: "MEDIUM",
  ishaan: "LOW",
  meera: "HIGH",
  kabir: "LOW",
  tara: "LOW",
  rohan: "MEDIUM",
};

export interface SupportAction {
  id: string;
  studentId: string;
  type: "check-in" | "follow-up";
  status: "pending" | "completed";
  recommended: string;
  due: string;
  assignee: string;
  priority: PriorityLevel;
  completedOn?: string;
  notes?: string;
}

export const supportActions: SupportAction[] = [
  { id: "act-1", studentId: "arjun", type: "check-in", status: "pending", recommended: "Advisor check-in", due: "Today", assignee: "Support Team", priority: "HIGH" },
  { id: "act-2", studentId: "priya", type: "check-in", status: "pending", recommended: "Advisor check-in", due: "Today", assignee: "Support Team", priority: "HIGH" },
  { id: "act-3", studentId: "meera", type: "check-in", status: "pending", recommended: "Advisor check-in", due: "Tomorrow", assignee: "Support Team", priority: "HIGH" },
  { id: "act-4", studentId: "sneha", type: "check-in", status: "pending", recommended: "Wellbeing review call", due: "Tomorrow", assignee: "Support Team", priority: "MEDIUM" },
  { id: "act-5", studentId: "dev", type: "check-in", status: "pending", recommended: "Academic assistance referral", due: "In 2 days", assignee: "Support Team", priority: "MEDIUM" },
  { id: "act-6", studentId: "vikram", type: "check-in", status: "pending", recommended: "Engagement follow-up", due: "In 3 days", assignee: "Support Team", priority: "MEDIUM" },
  { id: "act-7", studentId: "rohan", type: "check-in", status: "pending", recommended: "Brief check-in", due: "This week", assignee: "Support Team", priority: "MEDIUM" },
  { id: "act-8", studentId: "rahul", type: "check-in", status: "completed", recommended: "No action needed", due: "Last week", assignee: "Support Team", priority: "LOW", completedOn: "Aug 22", notes: "Routine check-in. Student stable, no concerns raised." },
  { id: "act-9", studentId: "ananya", type: "check-in", status: "completed", recommended: "Welcome check-in", due: "Last week", assignee: "Support Team", priority: "LOW", completedOn: "Aug 21", notes: "First-year onboarding check-in. Adjusting well." },
  { id: "act-10", studentId: "kabir", type: "follow-up", status: "pending", recommended: "Attendance plan follow-up", due: "In 2 days", assignee: "Dr. Meera Iyer", priority: "LOW" },
  { id: "act-11", studentId: "tara", type: "follow-up", status: "pending", recommended: "Scholarship paperwork follow-up", due: "This week", assignee: "Dr. Anand Rao", priority: "LOW" },
  { id: "act-12", studentId: "vikram", type: "follow-up", status: "completed", recommended: "Counselling referral follow-up", due: "Last month", assignee: "Dr. Kavita Menon", priority: "MEDIUM", completedOn: "Aug 12", notes: "Attended first counselling session. Follow-up scheduled." },
];

export const checkInLog: { id: string; count: number }[] = [
  { id: "week-1", count: 14 },
  { id: "week-2", count: 16 },
  { id: "week-3", count: 15 },
  { id: "week-4", count: 18 },
];

export const priorityDistribution = [
  { name: "Low", value: 247, color: "#059669" },
  { name: "Medium", value: 31, color: "#D97706" },
  { name: "High", value: 12, color: "#E11D48" },
];

export const signalTrends = [
  { week: "W1", attendance: 22, assignments: 18, grades: 12, engagement: 26 },
  { week: "W2", attendance: 25, assignments: 20, grades: 14, engagement: 29 },
  { week: "W3", attendance: 27, assignments: 23, grades: 15, engagement: 31 },
  { week: "W4", attendance: 31, assignments: 26, grades: 17, engagement: 34 },
];

export const MODEL_STATUS = {
  name: "Support Priority Model",
  state: "Active" as const,
  note: "Assistive model • Human review required",
  lastEvaluated: "Today, 8:42 AM",
};
