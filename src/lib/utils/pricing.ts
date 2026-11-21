export interface IStorePricingSettings {
  enableTax?: boolean;
  taxRate?: number; // e.g. 5 for 5%
  enableShippingFee?: boolean;
  flatShippingRate?: number;
  freeShippingThreshold?: number;
}

export interface IOrderTotals {
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
}

export function calculateOrderTotals(
  subtotal: number,
  settings: IStorePricingSettings = {}
): IOrderTotals {
  const safeSubtotal = Math.max(0, subtotal);

  // 1. Shipping Calculation
  let shippingFee = 0;
  let isFreeShipping = true;
  let amountNeededForFreeShipping = 0;

  if (settings.enableShippingFee) {
    const threshold = settings.freeShippingThreshold ?? 999;
    const flatRate = settings.flatShippingRate ?? 70;

    if (safeSubtotal >= threshold) {
      shippingFee = 0;
      isFreeShipping = true;
      amountNeededForFreeShipping = 0;
    } else {
      shippingFee = flatRate;
      isFreeShipping = false;
      amountNeededForFreeShipping = Math.max(0, threshold - safeSubtotal);
    }
  }

  // 2. Tax Calculation (Optional, defaults to 0)
  let taxAmount = 0;
  if (settings.enableTax && settings.taxRate && settings.taxRate > 0) {
    taxAmount = Math.round(((safeSubtotal * settings.taxRate) / 100) * 100) / 100;
  }

  const totalAmount = Math.round((safeSubtotal + shippingFee + taxAmount) * 100) / 100;

  return {
    subtotal: safeSubtotal,
    shippingFee,
    taxAmount,
    totalAmount,
    isFreeShipping,
    amountNeededForFreeShipping,
  };
}
