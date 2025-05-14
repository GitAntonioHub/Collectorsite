import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import { ListingDTO } from './models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import {ListingService} from './listing.service';

interface Page<T> {
  content: T[];
  totalElements: number;
}

@Component({
  standalone: true,
  selector: 'app-listings',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatTableModule
  ],
  template: `
  <section class="p-6">
    <mat-form-field appearance="outline" class="w-60 mr-4">
      <mat-label>Search</mat-label>
      <input matInput [formControl]="q">
    </mat-form-field>

    <table mat-table [dataSource]="data" class="w-full mt-4">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef> Title </th>
        <td mat-cell *matCellDef="let r">{{ r.title }}</td>
      </ng-container>

      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef> Price </th>
        <td mat-cell *matCellDef="let r">{{ r.price | currency:r.currency }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols"></tr>
    </table>

    <mat-paginator [length]="total"
                   [pageSize]="12"
                   [pageSizeOptions]="[12,24,48]"
                   showFirstLastButtons>
    </mat-paginator>
  </section>
  `
})
export class ListingsComponent implements OnInit {
  private api = inject(ApiService);

  cols = ['title', 'price'];
  data = new MatTableDataSource<ListingDTO>([]);
  total = 0;
  q = new FormControl('');

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  private listSvc = inject(ListingService);

  ngOnInit() {
    merge(this.q.valueChanges, this.paginator.page)
      .pipe(
        startWith(''),
        switchMap(()=> this.listSvc.feed(this.q.value ?? '', this.paginator.pageIndex, this.paginator.pageSize))
      )
      .subscribe(res => {
        this.data.data = res.content;
        this.total = res.totalElements;
      });
  }
}
