export class Payment {
  public userEmail: string;
  public amount: number;
  public productName: string;

  constructor(others?: Partial<Payment>) {
    this.userEmail = others?.userEmail || "";
    this.productName = others?.productName || "";
    this.amount = others?.amount || 0;
  }
}
