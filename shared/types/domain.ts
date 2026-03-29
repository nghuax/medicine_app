export type RemoteMode = "booting" | "local" | "synced" | "error";
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type ActivityType = "walk" | "bike" | "swim" | "run" | "yoga" | "stretch" | "custom";
export type NotificationType = "medicine" | "water" | "mood" | "warning" | "follow_up" | "admin";
export type MessageType = "medicine-reminder" | "follow-up" | "general" | "alert";

export interface BaseDoc {
  _id: string;
  _creationTime: number;
}

export interface SessionState {
  phone: string;
  isAuthenticated: boolean;
  otpRequested: boolean;
  otpVerified: boolean;
  profileComplete: boolean;
  demoOtpCode: string;
  lastOtpSentAt: number | null;
}

export interface User extends BaseDoc {
  phone: string;
  displayName?: string;
  role: string;
  zaloConnected: boolean;
  authProvider: string;
  createdAt: number;
  updatedAt: number;
}

export interface Profile extends BaseDoc {
  userId: string;
  fullName: string;
  heightCm: number;
  bloodType: string;
  deviceSyncEnabled: boolean;
  avatarHue: number;
  createdAt: number;
  updatedAt: number;
}

export interface Medicine extends BaseDoc {
  userId: string;
  productId?: string;
  name: string;
  strength: string;
  form: string;
  dosage: string;
  scheduleTimes: string[];
  reminderTimes: string[];
  note?: string;
  avoidItems: string[];
  status: string;
  adherenceRate: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MedicineLog extends BaseDoc {
  userId: string;
  medicineId: string;
  scheduledFor: number;
  loggedAt?: number;
  status: string;
  note?: string;
}

export interface Reminder extends BaseDoc {
  userId?: string;
  medicineId?: string;
  type: string;
  title: string;
  body: string;
  channel: string;
  dueAt: number;
  repeatRule?: string;
  isActive: boolean;
  createdAt: number;
}

export interface DailyLog extends BaseDoc {
  userId: string;
  dateKey: string;
  steps: number;
  sleepHours: number;
  waterGoal: number;
  waterCups: number;
  intakeCalories: number;
  burnedCalories: number;
  mood?: string;
  source: string;
}

export interface WaterLog extends BaseDoc {
  userId: string;
  dateKey: string;
  entries: number[];
  cups: number;
  goal: number;
  updatedAt: number;
}

export interface SleepLog extends BaseDoc {
  userId: string;
  dateKey: string;
  durationHours: number;
  quality: string;
  source: string;
  updatedAt: number;
}

export interface Activity extends BaseDoc {
  userId: string;
  dateKey: string;
  type: string;
  durationMin: number;
  caloriesBurned: number;
  distanceKm?: number;
  source: string;
}

export interface NutritionEntry extends BaseDoc {
  userId: string;
  dateKey: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  note?: string;
  source: string;
}

export interface ScannedMeal extends BaseDoc {
  userId: string;
  dateKey: string;
  title: string;
  estimatedCalories: number;
  detectedItems: string[];
  analyzer: string;
  confidence: number;
  status: string;
  photoName?: string;
  createdAt: number;
}

export interface Product extends BaseDoc {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  servingSize: string;
  calories: number;
  sugarGrams: number;
  caffeineMg: number;
  status: string;
  warningText?: string;
  alternativeText?: string;
  reminderNote?: string;
  avoidItems: string[];
  stock: number;
  source: string;
  createdAt: number;
  updatedAt: number;
}

export interface BarcodeScan extends BaseDoc {
  userId?: string;
  productId?: string;
  barcode: string;
  source: string;
  resultStatus: string;
  createdAt: number;
}

export interface AvoidItem extends BaseDoc {
  label: string;
  note?: string;
  severity: string;
  productId?: string;
  medicineId?: string;
  createdAt: number;
}

export interface AdminNote extends BaseDoc {
  userId?: string;
  productId?: string;
  medicineId?: string;
  title: string;
  body: string;
  type: string;
  createdBy: string;
  createdAt: number;
}

export interface FollowUpRule extends BaseDoc {
  name: string;
  triggerType: string;
  triggerLabel: string;
  condition: string;
  delayDays: number;
  channel: string;
  status: string;
  createdAt: number;
}

export interface HealthCheckResult extends BaseDoc {
  userId: string;
  metric: string;
  value: number;
  unit: string;
  source: string;
  observedAt: number;
  severity: string;
}

export interface AppNotification extends BaseDoc {
  userId: string;
  type: string;
  title: string;
  body: string;
  channel: string;
  dueAt: number;
  status: string;
  metadata?: Record<string, unknown>;
}

export interface DirectMessage extends BaseDoc {
  userId?: string;
  phone: string;
  type: string;
  channel: string;
  body: string;
  preview: string;
  status: string;
  sentAt: number;
  createdAt: number;
}

export interface MessageDelivery extends BaseDoc {
  directMessageId: string;
  channel: string;
  status: string;
  deliveredAt?: number;
  error?: string;
}

export interface AppState {
  session: SessionState;
  users: User[];
  profiles: Profile[];
  medicines: Medicine[];
  medicineLogs: MedicineLog[];
  reminders: Reminder[];
  dailyLogs: DailyLog[];
  waterLogs: WaterLog[];
  sleepLogs: SleepLog[];
  activities: Activity[];
  nutritionEntries: NutritionEntry[];
  scannedMeals: ScannedMeal[];
  products: Product[];
  barcodeScans: BarcodeScan[];
  avoidItems: AvoidItem[];
  adminNotes: AdminNote[];
  followUpRules: FollowUpRule[];
  healthCheckResults: HealthCheckResult[];
  notifications: AppNotification[];
  directMessages: DirectMessage[];
  messageDeliveries: MessageDelivery[];
  remoteMode: RemoteMode;
  remoteError: string | null;
  lastSyncedAt: number | null;
}
