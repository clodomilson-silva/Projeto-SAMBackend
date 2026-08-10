export interface UserAuthPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
  active?: boolean;
  status?: string;
  mustChangePassword?: boolean;
  resetRequested?: boolean;
  crp?: string | null;
  workUnit?: string | null;
  allowedUnits?: string[];
}
