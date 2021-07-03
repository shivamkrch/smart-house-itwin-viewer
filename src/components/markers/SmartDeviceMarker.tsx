import { XAndY, XYAndZ } from "@bentley/geometry-core";
import {
  BeButtonEvent,
  IModelApp,
  Marker,
  NotifyMessageDetails,
  OutputMessagePriority,
  StandardViewId,
} from "@bentley/imodeljs-frontend";

export class SmartDeviceMarker extends Marker {
  private elementId: string;
  private _smartDeviceId: string;
  private _smartDeviceType: string;

  constructor(
    location: XYAndZ,
    size: XAndY,
    elementId: string,
    smartDeviceId: string,
    smartDeviceType: string,
    cloudData: any
  ) {
    super(location, size);
    this.elementId = elementId;
    this._smartDeviceId = smartDeviceId;
    this._smartDeviceType = smartDeviceType;

    this.setImageUrl(`/${this._smartDeviceType}.png`);
    this.title = this.populateTitle(cloudData);
  }

  private populateTitle(cloudData: any) {
    const smartTableDiv = document.createElement("div");

    let smartTable = "";
    for (const [key, value] of Object.entries(cloudData)) {
      smartTable += `
            <tr>
                <th>${key}</th>
                <th>${value}</th>
            </tr>
        `;
    }
    smartTableDiv.className = "smart-table";
    smartTableDiv.innerHTML = `
        <h3>${this._smartDeviceId}</h3>
        <table>
        ${smartTable}
        </table>
    `;

    return smartTableDiv;
  }

  public onMouseButton(ev: BeButtonEvent): boolean {
    if (ev.isDown) return true;
    IModelApp.notifications.outputMessage(
      new NotifyMessageDetails(
        OutputMessagePriority.Info,
        `Element ${this._smartDeviceId} clicked`
      )
    );
    IModelApp.viewManager.selectedView?.zoomToElements(this.elementId, {
      animateFrustumChange: true,
      standardViewId: StandardViewId.RightIso,
    });
    return true;
  }
}
