import { createReducer, on } from '@ngrx/store';
import { newCard } from './card.actions';

export const initialState = {
  creditCardNumber: 'Default Card Number',
  cardHolder: 'Collins Thomas',
  expirationDate: new Date().getTime() + 5 * 24 * 60 * 60 * 1000, // Adds 5 days to current date
  securityCode: '769',
  amount: 30000,
};

const _cardReducer = createReducer(
  initialState
  // on(newCard, (state) => state)
);

export function cardReducer(state, action) {
  return _cardReducer(state, action);
}
