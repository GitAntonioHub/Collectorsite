/* DTOs shared by admin‑verification components & services */

export interface VerificationDTO {
  id: string;
  itemId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string | null;
  requestedAt?: string;
  verifiedAt?: string;
}
