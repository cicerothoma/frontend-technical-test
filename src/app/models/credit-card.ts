export interface CreditCard {
  creditCardNumber: string;
  cardHolder: string;
  expirationDate: number;
  securityCode?: string;
  amount: number;
}
