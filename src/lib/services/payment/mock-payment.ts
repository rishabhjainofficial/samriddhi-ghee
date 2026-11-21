import {
  ICreatePaymentOrderParams,
  ICreatePaymentOrderResult,
  IPaymentGateway,
  IVerifyPaymentParams,
  IVerifyPaymentResult,
} from "./types";

export class MockPaymentGateway implements IPaymentGateway {
  async createPaymentOrder(params: ICreatePaymentOrderParams): Promise<ICreatePaymentOrderResult> {
    const gatewayOrderId = `mock_order_${params.orderId}_${Date.now()}`;
    return {
      gatewayOrderId,
      checkoutUrl: `/payment/${params.orderId}`,
      rawResponse: {
        id: gatewayOrderId,
        amount: params.amountInPaise,
        currency: params.currency,
        status: "created",
        mode: "mock_simulation",
      },
    };
  }

  async verifyPayment(params: IVerifyPaymentParams): Promise<IVerifyPaymentResult> {
    // If paymentId contains 'fail', simulate failure for testing
    const isFailed = params.gatewayPaymentId.toLowerCase().includes("fail");

    if (isFailed) {
      return {
        isSuccessful: false,
        transactionId: params.gatewayPaymentId,
        rawResponse: {
          error: "Simulated payment failure (insufficient funds / user cancelled)",
          code: "PAYMENT_FAILED",
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      isSuccessful: true,
      transactionId: params.gatewayPaymentId || `txn_mock_${Date.now()}`,
      rawResponse: {
        status: "captured",
        method: "UPI",
        bank: "HDFC",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
