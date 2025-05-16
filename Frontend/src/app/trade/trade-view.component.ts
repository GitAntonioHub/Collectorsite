import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeService, TradableItem } from './trade.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trade-view',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './trade-view.component.html',
  styleUrls: ['./trade-view.component.scss']
})
export class TradeViewComponent implements OnInit {
  availableItems: TradableItem[] = [];
  cols: number = 3;
  rowHeight = '550px';
  gutterSize = '24px';

  constructor(
    private tradeService: TradeService,
    private snackBar: MatSnackBar
  ) {
    this.setGridCols(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setGridCols(event.target.innerWidth);
  }

  private setGridCols(width: number) {
    if (width <= 600) {
      this.cols = 1;
      this.rowHeight = '450px';
    } else if (width <= 960) {
      this.cols = 2;
      this.rowHeight = '500px';
    } else {
      this.cols = 3;
      this.rowHeight = '550px';
    }
  }

  ngOnInit() {
    this.loadAvailableItems();
    this.setGridCols(window.innerWidth);
  }

  loadAvailableItems() {
    this.tradeService.getAvailableItems().subscribe({
      next: (items) => {
        this.availableItems = items;
      },
      error: (error) => {
        this.snackBar.open('Error loading items. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  initiateTradeOffer(item: TradableItem) {
    // This will be implemented when we create the trade proposal dialog
    this.snackBar.open('Trade proposal feature coming soon!', 'Close', {
      duration: 2000
    });
  }
} 