import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CreditCard } from 'src/app/models/credit-card';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  card$: Observable<CreditCard>;
  card: CreditCard;
  cardSubscription: Subscription;

  constructor(private store: Store<{ card: CreditCard }>) {
    this.card$ = this.store.select('card');
  }

  ngOnInit(): void {
    this.cardSubscription = this.card$.subscribe(
      (value) => (this.card = value)
    );
  }

  ngOnDestroy(): void {
    if (this.cardSubscription) {
      this.cardSubscription.unsubscribe();
    }
  }
}
