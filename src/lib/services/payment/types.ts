export interface IPaymentCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface ICreatePaymentOrderParams {
  orderId: string;
  amountInPaise: number;
  currency: string;
  customer: IPaymentCustomer;
}

export interface ICreatePaymentOrderResult {
  gatewayOrderId: string;
  checkoutUrl?: string;
  rawResponse?: any;
}

export interface IVerifyPaymentParams {
  orderId: string;
  gatewayPaymentId: string;
  gatewaySignature?: string;
}

export interface IVerifyPaymentResult {
  isSuccessful: boolean;
  transactionId: string;
  rawResponse: any;
}

export interface IPaymentGateway {
  createPaymentOrder(params: ICreatePaymentOrderParams): Promise<ICreatePaymentOrderResult>;
  verifyPayment(params: IVerifyPaymentParams): Promise<IVerifyPaymentResult>;
}
