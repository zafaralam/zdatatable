/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import { VisualSettings } from "./settings";
import ViewMode = powerbi.ViewMode;
import EditMode = powerbi.EditMode;
import * as React from "react";
import * as ReactDom from "react-dom";
import { dataViewWildcard } from "powerbi-visuals-utils-dataviewutils";
import VisualEnumerationInstanceKinds = powerbi.VisualEnumerationInstanceKinds;
import { ColorHelper } from "powerbi-visuals-utils-colorutils";
import IColorPalette = powerbi.extensibility.IColorPalette;
// import { CircleCard, initialState } from "./circleCardComponent";
import {
  VisualMainDisplay,
  // initialState,
} from "./components/VisualMainDisplay";

import IViewport = powerbi.IViewport;

import { parseDataModelColumns, processDataView } from "./utils/dataView";
import {
  IDataColumn,
  IVisualMainDisplayState,
  IVisualTable,
} from "./defs/main";
import { SingleTable as SampleData } from "./models/visualTablesSamples";

import AdvanceEditorData from "./models/advanceEditor";
export class Visual implements IVisual {
  private target: HTMLElement;
  private host: IVisualHost;
  private localizationManager: ILocalizationManager;
  private events: IVisualEventService;
  private reactRoot: React.ComponentElement<any, any>;

  private settings: VisualSettings;
  private viewport: IViewport;

  private dataColumns: IDataColumn[];
  // private visualTables: IVisualTable[];
  private advEditorData: AdvanceEditorData;
  private selectionManager: powerbi.extensibility.ISelectionManager;
  private colorPalette: IColorPalette;
  private colorHelper: ColorHelper;

  //     private textNode: Text;
  //   private updateCount: number;

  constructor(options: VisualConstructorOptions) {
    // * Remove this console log
    // console.log("Visual constructor", options);

    this.target = options.element;
    this.host = options.host;
    this.localizationManager = this.host.createLocalizationManager();
    this.events = this.host.eventService;
    this.selectionManager = this.host.createSelectionManager();

    this.colorPalette = this.host.colorPalette;

    this.dataColumns = [];
    // this.visualTables = [];
    this.advEditorData = new AdvanceEditorData();
    // ! Remove this in production
    // this.advEditorData.updateVisualTables(
    //   JSON.parse(JSON.stringify(SampleData))
    // );

    this.reactRoot = React.createElement(VisualMainDisplay, {
      host: this.host,
      localizationManager: this.localizationManager,
      advEditorData: this.advEditorData,
      // updateDisplayTables: this.updateVisualTables,
    });

    ReactDom.render(this.reactRoot, this.target);
  }

  // private updateVisualTables(visualTables: IVisualTable[]) {
  //   this.visualTables = visualTables;
  //   // console.log(this.visualTables);
  // }

  public update(options: VisualUpdateOptions) {
    // console.log("Visual update", options);
    // if (options.dataViews && options.dataViews[0]) {
    try {
      // console.log(this.advEditorData.visualTables);
      this.events.renderingStarted(options);
      // console.log(options);
      // const dataView: DataView = options.dataViews[0];
      this.settings = Visual.parseSettings(
        options && options.dataViews && options.dataViews[0]
      );

      console.log(this.settings.mainMeasure);

      this.viewport = options.viewport;
      const { width, height } = this.viewport;
      // const size = Math.min(width, height);
      // console.log(this.dataColumns);
      this.dataColumns = parseDataModelColumns(
        options && options.dataViews && options.dataViews[0],
        this.dataColumns,
        this.colorPalette
      );
      // console.log(this.settings.advancedEditing);

      // * Might need to do a bit more here
      // Double parsing is required as the tables structure is also a string.
      const _visualTables = JSON.parse(
        this.settings.advancedEditing.visualTables
      );

      if (
        _visualTables["tables"] !== undefined &&
        _visualTables["tables"] !== "[]" &&
        _visualTables["tables"].length !== 0
      ) {
        // console.dir(_visualTables["tables"]);
        this.advEditorData.updateVisualTables(
          JSON.parse(_visualTables["tables"]) as IVisualTable[]
        );
      }

      // console.log(typeof this.advEditorData.visualTables);

      let state: IVisualMainDisplayState = {
        updateOptions: options,
        canAdvanceEdit:
          options.viewMode === ViewMode.Edit && !options.isInFocus,
        isEditMode:
          options.viewMode === ViewMode.Edit &&
          options.editMode === EditMode.Advanced &&
          options.isInFocus,
        advancedEditing: this.settings.advancedEditing,
        objectMetadata:
          options.dataViews[0] &&
          options.dataViews[0].metadata &&
          options.dataViews[0].metadata.objects,
        data: processDataView(
          options.dataViews,
          JSON.parse(JSON.stringify(this.dataColumns))
        ),
        tableTitleSettings: this.settings.tableTitle,
        mainMeasureSettings: this.settings.mainMeasure,
        secondaryMeasureSettings: this.settings.secondaryMeasure,
        trendLineSettings: this.settings.trendLine,
        groupingColumnSettings: this.settings.groupingColumn,
        // visualTables: this.visualTables,
      };

      // console.log(width, height);

      // console.log("State", state);

      VisualMainDisplay.update(state);
    } catch (error) {
      this.events.renderingFailed(options, error);
      console.log(options, error, this.dataColumns);
      // TODO: Perform other actions
      // ? How to log this error to user and also gracefully exit.
    }

    // } else {
    //   this.clear();
    // }
  }

  // private clear() {
  //   VisualMainDisplay.update(initialState);
  // }

  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );
  }

  // public enumerateObjectInstances(
  //   options: EnumerateVisualObjectInstancesOptions
  // ): VisualObjectInstanceEnumeration {
  //   let objectName = options.objectName;
  //   let objectEnumeration: VisualObjectInstance[] = [];

  //   if (!this.dataColumns) {
  //     return objectEnumeration;
  //   }

  //   switch (objectName) {
  //     case "mainMeasure":
  //       for (let dataColumn of this.dataColumns) {
  //         objectEnumeration.push({
  //           objectName: objectName,
  //           displayName: dataColumn.displayName,
  //           properties: {
  //             fontColor: {
  //               solid: {
  //                 color: dataColumn.color,
  //               },
  //             },
  //           },
  //           propertyInstanceKind: {
  //             fontColor: VisualEnumerationInstanceKinds.ConstantOrRule,
  //           },
  //           // altConstantValueSelector: barDataPoint.selectionId.getSelector(),
  //           // selector: dataViewWildcard.createDataViewWildcardSelector(
  //           //   dataViewWildcard.DataViewWildcardMatchingOption.InstancesAndTotals
  //           // ),
  //           selector: {
  //             metadata: dataColumn.queryName,
  //           },
  //         });
  //       }
  //       break;
  //   }

  //   return objectEnumeration;
  // }

  //   public enumerateObjectInstances(
  //     options: EnumerateVisualObjectInstancesOptions
  //   ): VisualObjectInstanceEnumeration {
  //     const instanceEnumeration: VisualObjectInstanceEnumeration = VisualSettings.enumerateObjectInstances(
  //       this.settings || VisualSettings.getDefault(),
  //       options
  //     );

  //     if (options.objectName === "mainMeasure") {
  //       this.dataColumns.forEach((item, idx) => {
  //         // console.log(item.queryName, item.color);
  //         if (item.content === true) {
  //           // containerIdx =
  //           //   enumerationObject.containers.push({
  //           //     displayName: item.displayName,
  //           //   }) - 1;
  //           const instance = {
  //             objectName: options.objectName,
  //             displayName: item.displayName,
  //             properties: {
  //               fontColor: {
  //                 solid: {
  //                   color: item.color || "#000",
  //                 },
  //               },
  //             },
  //             propertyInstanceKind: {
  //               fontColor: VisualEnumerationInstanceKinds.ConstantOrRule,
  //             },
  //             selector: {
  //               metadata: item.queryName,
  //             },
  //             // selector: dataViewWildcard.createDataViewWildcardSelector(
  //             //   dataViewWildcard.DataViewWildcardMatchingOption.InstancesAndTotals
  //             // ),
  //           };

  //           if (
  //             (instanceEnumeration as VisualObjectInstanceEnumerationObject)
  //               .instances
  //           ) {
  //             (instanceEnumeration as VisualObjectInstanceEnumerationObject).instances.push(
  //               instance
  //             );
  //           } else {
  //             (instanceEnumeration as VisualObjectInstance[]).push(instance);
  //           }

  //           // console.log(instance);
  //         }
  //       });
  //     }

  //     // return (
  //     //   (<VisualObjectInstanceEnumerationObject>instanceEnumeration).instances ||
  //     //   []
  //     // );
  //     return (
  //       (instanceEnumeration as VisualObjectInstanceEnumerationObject)
  //         .instances || []
  //     );
  //   }
}
