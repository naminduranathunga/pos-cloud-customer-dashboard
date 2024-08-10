export interface CustomerUsageInvoice {
    _id?: string;
    company_id: string;
    taxAmount?: number;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    isPaid: boolean;
    paymentDate?: string;
    paymentMethod?: string;
    paymentReference?: string;
    paymentNotes?: string;
    invoiceItems: Array<{
        name: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }>;

    /**
     * Used for auto-reccuring payments (if enabled)
     */
    autoReccuringPayment: boolean;
    autoReccuringPaymentMethod?: string;
    autoReccuringPaymentAttempts: number;
}
