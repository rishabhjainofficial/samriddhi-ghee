import { IShippingProvider } from "./types";
import { MockShippingProvider } from "./mock-shipping";

export * from "./types";
export * from "./mock-shipping";

let shippingProviderInstance: IShippingProvider | null = null;

export function getShippingProvider(): IShippingProvider {
  if (!shippingProviderInstance) {
    const provider = process.env.SHIPPING_PROVIDER || "MOCK";
    if (provider === "MOCK") {
      shippingProviderInstance = new MockShippingProvider();
    } else {
      // Future drop-in for Shiprocket API
      console.warn(`Shipping provider ${provider} not configured, defaulting to MockShippingProvider`);
      shippingProviderInstance = new MockShippingProvider();
    }
  }
  return shippingProviderInstance;
}
