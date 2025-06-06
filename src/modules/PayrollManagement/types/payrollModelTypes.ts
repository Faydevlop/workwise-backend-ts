import mongoose from 'mongoose';

export interface IPayroll extends mongoose.Document {
  employee: mongoose.Schema.Types.ObjectId | string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payPeriod: string;
  baseSalary: number;
  bonuses: number;
  totalAmount: number;
  deductions: number;
  paymentStatus: any;
  paymentMethod: string;
  permonthsalary: number;
}
