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
import Debugger from "./debug/Debugger";
/**
 * Main Visual class
 */
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
    // if (options.dataViews && options.dataViews[0]) {
    try {
      this.events.renderingStarted(options);

      if (
        options.dataViews &&
        options.dataViews[0] &&
        options.dataViews[0].metadata &&
        options.dataViews[0].metadata.objects
      ) {
        // const dataView: DataView = options.dataViews[0];
        this.settings = Visual.parseSettings(
          options && options.dataViews && options.dataViews[0]
        );

        this.viewport = options.viewport;
        // const { width, height } = this.viewport;
        // const size = Math.min(width, height);

        // if (options.type === powerbi.VisualUpdateType.All) {
        this.dataColumns = parseDataModelColumns(
          options && options.dataViews && options.dataViews[0],
          this.host
        );
        // } else {
        //   console.log(options);
        // }

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
          this.advEditorData.updateVisualTables(
            JSON.parse(_visualTables["tables"]) as IVisualTable[]
          );
        }

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
          tablesSettings: this.settings.tables,
          // visualTables: this.visualTables,
        };

        // console.log(width, height);

        // console.log("State", state);

        VisualMainDisplay.update(state);
      }

      this.events.renderingFinished(options);
    } catch (error) {
      this.events.renderingFailed(options, error);
      Debugger.LOG(options, error, this.dataColumns);
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

  /**
   *
   * @param dataView
   */
  private static parseSettings(dataView: DataView): VisualSettings {
    // let objects = dataView && dataView.metadata && dataView.metadata.objects;
    // console.log(objects);
    return <VisualSettings>VisualSettings.parse(dataView);
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   * @param options
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );
  }

  /**
   * The function below has been commented out for now as the functionality required cannot be
   * achieved using the standard api provided form powerbi visuals.
   * @param options
   */
  /*
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstanceEnumeration {
    // const instanceEnumeration: VisualObjectInstanceEnumeration = VisualSettings.enumerateObjectInstances(
    //   this.settings || VisualSettings.getDefault(),
    //   options
    // );

    let instances = (<VisualObjectInstanceEnumerationObject>(
        VisualSettings.enumerateObjectInstances(
          this.settings || VisualSettings.getDefault(),
          options
        )
      )).instances,
      objectName = options.objectName,
      enumerationObject: VisualObjectInstanceEnumerationObject = {
        containers: [],
        instances: instances,
      };

    if (options.objectName === "dataColors") {
      enumerationObject.instances = [];

      this.dataColumns.forEach((item, idx) => {
        // console.log(item.queryName, item.color);

        if (item.content) {
          let displayName = item.metadata.displayName,
            containerIdx =
              enumerationObject.containers.push({ displayName: displayName }) -
              1;

          const instance = {
            objectName: objectName,
            displayName: "Text Color",
            properties: {
              textColor: {
                solid: {
                  color: item.color,
                },
              },
            },
            propertyInstanceKind: {
              fontColor: VisualEnumerationInstanceKinds.ConstantOrRule,
            },
            selector: {
              metadata: item.metadata.queryName,
            },
            containerIdx: containerIdx,
            // selector: dataViewWildcard.createDataViewWildcardSelector(
            //   dataViewWildcard.DataViewWildcardMatchingOption.InstancesAndTotals
            // ),
          };

          enumerationObject.instances.push(instance);
        }
        // console.log(instance);
      });
    }

    // return (
    //   (<VisualObjectInstanceEnumerationObject>instanceEnumeration).instances ||
    //   []
    // );
    return enumerationObject;
  }
  */
}
