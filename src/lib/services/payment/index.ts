import { IPaymentGateway } from "./types";
import { MockPaymentGateway } from "./mock-payment";

export * from "./types";
export * from "./mock-payment";

let paymentGatewayInstance: IPaymentGateway | null = null;

export function getPaymentGateway(): IPaymentGateway {
  if (!paymentGatewayInstance) {
    const provider = process.env.PAYMENT_PROVIDER || "MOCK";
    if (provider === "MOCK") {
      paymentGatewayInstance = new MockPaymentGateway();
    } else {
      // Future drop-in for Razorpay / Cashfree
      console.warn(`Provider ${provider} not configured, defaulting to MockPaymentGateway`);
      paymentGatewayInstance = new MockPaymentGateway();
    }
  }
  return paymentGatewayInstance;
}
