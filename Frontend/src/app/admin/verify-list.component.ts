import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

interface VerificationDTO {
  id: string;
  itemId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  template: `
  <section class="p-6">
    <table mat-table [dataSource]="rows" class="w-full">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef> # </th>
        <td mat-cell *matCellDef="let r">{{ r.id | slice:0:8 }}</td>
      </ng-container>

      <ng-container matColumnDef="item">
        <th mat-header-cell *matHeaderCellDef> Item </th>
        <td mat-cell *matCellDef="let r">{{ r.itemId | slice:0:8 }}</td>
      </ng-container>

      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let r">
          <button mat-button color="primary" (click)="approve(r)">Approve</button>
          <button mat-button color="warn" (click)="reject(r)">Reject</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols"></tr>
    </table>
  </section>
  `
})
export class VerifyListComponent implements OnInit {
  private api = inject(ApiService);
  rows: VerificationDTO[] = [];
  cols = ['id', 'item', 'action'];

  ngOnInit() { this.load(); }

  load() {
    this.api.get<VerificationDTO[]>('/verification/pending')
      .subscribe(res => this.rows = res);
  }

  approve(r: VerificationDTO) {
    this.decision(r, 'APPROVED');
  }
  reject(r: VerificationDTO) {
    this.decision(r, 'REJECTED');
  }

  private decision(r: VerificationDTO, decision: 'APPROVED' | 'REJECTED') {
    this.api.post<VerificationDTO>('/verification/decide', {
      verificationId: r.id, decision
    }).subscribe(() => this.load());
  }
}
