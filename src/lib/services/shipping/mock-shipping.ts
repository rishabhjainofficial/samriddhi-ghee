import {
  ICreateShipmentParams,
  ICreateShipmentResult,
  IShippingProvider,
  ITrackShipmentResult,
} from "./types";

export class MockShippingProvider implements IShippingProvider {
  async createShipment(params: ICreateShipmentParams): Promise<ICreateShipmentResult> {
    const timestamp = Date.now().toString().slice(-6);
    const awbCode = `MOCK-AWB-${params.shippingAddress.pincode}-${timestamp}`;
    const shipmentId = `mock_ship_${params.orderId}_${timestamp}`;

    return {
      shipmentId,
      awbCode,
      courierName: "Delhivery Surface (Simulated)",
      labelUrl: `/admin/shipping/labels/${shipmentId}`,
      rawResponse: {
        awb: awbCode,
        shipment_id: shipmentId,
        courier_name: "Delhivery Surface (Simulated)",
        weight: params.totalWeightInGrams,
        dimensions: params.dimensions,
        pickup_scheduled_date: new Date(Date.now() + 86400000).toISOString(),
      },
    };
  }

  async trackShipment(awbCode: string): Promise<ITrackShipmentResult> {
    const now = new Date();
    const createdDate = new Date(now.getTime() - 2 * 86400000);
    const inTransitDate = new Date(now.getTime() - 86400000);

    return {
      awbCode,
      courierName: "Delhivery Surface (Simulated)",
      currentStatus: "IN_TRANSIT",
      statusTimeline: [
        {
          stage: "ORDER_PLACED",
          timestamp: createdDate.toISOString(),
          location: "Sanvrit Central Facility, Udaipur, Rajasthan",
          description: "Order verified and packed in protective glass-jar transit box.",
        },
        {
          stage: "PICKED_UP",
          timestamp: createdDate.toISOString(),
          location: "Anand Courier Hub",
          description: "Package received and manifested by courier partner.",
        },
        {
          stage: "IN_TRANSIT",
          timestamp: inTransitDate.toISOString(),
          location: "Regional Sorting Facility",
          description: "Shipment in transit to destination delivery center.",
        },
        {
          stage: "OUT_FOR_DELIVERY",
          timestamp: now.toISOString(),
          location: "Local Delivery Hub",
          description: "Out for delivery with delivery executive.",
        },
      ],
    };
  }
}
