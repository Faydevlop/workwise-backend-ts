import mongoose, { Document, Schema } from 'mongoose';
import { IPayroll } from '../types/payrollModelTypes';


const payrollSchema: Schema<IPayroll> = new Schema({
  employee: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  payPeriodStart: { 
    type: Date, 
    required: true 
  },
  payPeriodEnd: { 
    type: Date, 
    required: true 
  },
  payPeriod: { 
    type: String, 
    required: true 
  },
  permonthsalary: { 
    type: Number, 
    required: true 
  },
  baseSalary: { 
    type: Number, 
    required: true 
  },
  bonuses: { 
    type: Number, 
    default: 0 
  },
  totalAmount: { 
    type: Number, 
    default: 0 
  },
  deductions: { 
    type: Number, 
    default: 0 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid','Overdue'], 
    default: 'Pending' 
  },
  paymentMethod: { 
    type: String, 
    default: 'Direct Deposit' 
  },
});


// Export the Payroll model
const Payroll = mongoose.model<IPayroll>('Payroll', payrollSchema);
export default Payroll;
