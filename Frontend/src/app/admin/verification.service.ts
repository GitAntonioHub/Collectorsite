/* src/app/admin/verification.service.ts */
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { VerificationDTO } from './models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private api = inject(ApiService);

  pending(): Observable<VerificationDTO[]> {
    return this.api.get<VerificationDTO[]>('/verification/pending');
  }
  decide(id: string, decision: 'APPROVED'|'REJECTED', notes='') {
    return this.api.post('/verification/decide',
      { verificationId: id, decision, notes });
  }
}
