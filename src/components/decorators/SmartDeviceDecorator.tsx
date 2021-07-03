import {
  DecorateContext,
  Decorator,
  Marker,
} from "@bentley/imodeljs-frontend";
import { UiFramework } from "@bentley/ui-framework";
import SmartDeviceAPI from "../../SmartDeviceAPI";
import { SmartDeviceMarker } from "../markers/SmartDeviceMarker";

export default class SmartDeviceDecorator implements Decorator {
  private readonly id: string= "SmartDeviceDecorator";
  private _markerSet: Marker[];

  constructor() {
    this._markerSet = [];

    this.addMarkers();
  }

  public static async getSmartDeviceData() {
    const query = `SELECT SmartDeviceId, SmartDeviceType, ECInstanceId, Origin 
            FROM DgnCustomItemTypes_HouseSchema.SmartDevice
            WHERE Origin IS NOT NULL ORDER BY SmartDeviceType`;

    const results = UiFramework.getIModelConnection()!.query(query);
    const values = [];

    for await (const row of results) {
      values.push(row);
    }

    return values;
  }

  private async addMarkers() {
    const values = await SmartDeviceDecorator.getSmartDeviceData();
    const cloudData = await SmartDeviceAPI.getData();

    values.forEach((value) => {
      const smartDeviceMarker = new SmartDeviceMarker(
        { x: value.origin.x, y: value.origin.y, z: value.origin.z },
        { x: 20, y: 20 },
        value.id,
        value.smartDeviceId,
        value.smartDeviceType,
        cloudData[value.smartDeviceId]
      );

      this._markerSet.push(smartDeviceMarker);
    });
  }

  decorate(context: DecorateContext): void {
    this._markerSet.forEach((marker) => {
      marker.addDecoration(context);
    });
  }
}
