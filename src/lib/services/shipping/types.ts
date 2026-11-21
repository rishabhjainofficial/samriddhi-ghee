export interface IShippingOrderItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IShippingDimensions {
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
}

export interface ICreateShipmentParams {
  orderId: string;
  orderItems: IShippingOrderItem[];
  shippingAddress: IShippingAddress;
  totalWeightInGrams: number;
  dimensions: IShippingDimensions;
}

export interface ICreateShipmentResult {
  shipmentId: string;
  awbCode: string;
  courierName: string;
  labelUrl?: string;
  rawResponse?: any;
}

export interface ITrackingStage {
  stage: string;
  timestamp: string;
  location: string;
  description: string;
}

export interface ITrackShipmentResult {
  currentStatus: string;
  awbCode: string;
  courierName: string;
  statusTimeline: ITrackingStage[];
}

export interface IShippingProvider {
  createShipment(params: ICreateShipmentParams): Promise<ICreateShipmentResult>;
  trackShipment(awbCode: string): Promise<ITrackShipmentResult>;
}
