import { IModelApp, StandardViewId } from "@bentley/imodeljs-frontend";
import * as React from "react";
import { useEffect, useState } from "react";
import SmartDeviceDecorator from "../decorators/SmartDeviceDecorator";

function SmartDeviceWidgetListComponent() {
  const [smartTableList, setSmartTableList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    (async () => {
      const values = await SmartDeviceDecorator.getSmartDeviceData();
      const groupedByType: any = {};
      const tableList: JSX.Element[] = [];

      values.forEach((value) => {
        if (groupedByType[value.smartDeviceType]) {
            groupedByType[value.smartDeviceType].push(value);
        } else {
            groupedByType[value.smartDeviceType] = [value];
        }
      });

      for (const [_, devices] of Object.entries(groupedByType)) {
        (devices as any[]).forEach((device, i) => {
          tableList.push(
            <tr key={device.id}>
              {i === 0 ? (
                <th rowSpan={(devices as any[]).length}>
                  {device.smartDeviceType}
                </th>
              ) : null}
              <th
                onClick={() => {
                  IModelApp.viewManager.selectedView!.zoomToElements(
                    device.id,
                    {
                      animateFrustumChange: true,
                      standardViewId: StandardViewId.RightIso,
                    }
                  );
                }}
                className="clickable"
              >
                {device.smartDeviceId}
              </th>
            </tr>
          );
        });
      }
      setSmartTableList(tableList);
    })();
  }, []);

  return (
    <table className="smart-table">
      <tbody>
        <tr>
          <th>Smart Device Type</th>
          <th>Smart Device Id</th>
        </tr>
        {smartTableList}
      </tbody>
    </table>
  );
}

export default SmartDeviceWidgetListComponent;
