import { IModelApp } from "@bentley/imodeljs-frontend";
import {
  AbstractWidgetProps,
  CommonToolbarItem,
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  ToolbarItemUtilities,
  ToolbarOrientation,
  ToolbarUsage,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import React from "react";
import SmartDeviceDecorator from "../components/decorators/SmartDeviceDecorator";
import SmartDeviceWidgetListComponent from "../components/widgets/SmartDeviceWidgetListComponent";
import Visualization from "../Visualization";

export class SmartDeviceUIItemsProvider implements UiItemsProvider {
  public readonly id = "SmartDeviceUIProvider";
  private _toggleWalls: boolean = false;

  public provideToolbarButtonItems(
    stageId: string,
    stageUsage: string,
    toolbarUsage: ToolbarUsage,
    toolbarOrientation: ToolbarOrientation
  ): CommonToolbarItem[] {
    const toolbarButtonItems: CommonToolbarItem[] = [];

    if (
      stageUsage === StageUsage.General &&
      toolbarUsage === ToolbarUsage.ContentManipulation &&
      toolbarOrientation === ToolbarOrientation.Vertical
    ) {
      const toggleWallsButton = ToolbarItemUtilities.createActionButton(
        "ToggleWalls",
        1000,
        "icon-element",
        "Toggle Walls Tool",
        () => {
          this._toggleWalls = !this._toggleWalls;
          Visualization.hideHouseExterior(
            IModelApp.viewManager.selectedView!,
            this._toggleWalls
          );
        }
      );

      const toggleMarkersButton = ToolbarItemUtilities.createActionButton(
        "ToggleMarkers",
        1000,
        "icon-visibility-half",
        "Toggle Markers Tool",
        () => {
          const smartDeviceDecorator = IModelApp.viewManager.decorators.find((dec: any) => dec.id === "SmartDeviceDecorator");
          if(smartDeviceDecorator){
            IModelApp.viewManager.dropDecorator(smartDeviceDecorator);
          }else{
            IModelApp.viewManager.addDecorator(new SmartDeviceDecorator());
          }
        }
      )

      toolbarButtonItems.push(toggleWallsButton, toggleMarkersButton);
    }

    return toolbarButtonItems;
  }

  public provideWidgets(
    stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];

    if (
      location === StagePanelLocation.Right
    ) {
      const widget: AbstractWidgetProps = {
        id: "smartDeviceListWidget",
        label: "Smart Devices",
        getWidgetContent: () => <SmartDeviceWidgetListComponent />
      };

      widgets.push(widget);
    }

    return widgets;
  }
}
