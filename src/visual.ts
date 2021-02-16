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
// import { CircleCard, initialState } from "./circleCardComponent";
import {
  VisualMainDisplay,
  // initialState,
} from "./components/VisualMainDisplay";

import IViewport = powerbi.IViewport;

import { parseDataModelColumns, processDataView } from "./utils/dataView";
import { IDataColumn, IVisualMainDisplayState } from "./defs/main";
export class Visual implements IVisual {
  private target: HTMLElement;
  private host: IVisualHost;
  private localizationManager: ILocalizationManager;
  private events: IVisualEventService;
  private reactRoot: React.ComponentElement<any, any>;

  private settings: VisualSettings;
  private viewport: IViewport;

  private dataColumns: IDataColumn[];

  //     private textNode: Text;
  //   private updateCount: number;

  constructor(options: VisualConstructorOptions) {
    // * Remove this console log
    console.log("Visual constructor", options);

    this.target = options.element;
    this.host = options.host;
    this.localizationManager = this.host.createLocalizationManager();
    this.events = this.host.eventService;

    this.reactRoot = React.createElement(VisualMainDisplay, {
      host: this.host,
      localizationManager: this.localizationManager,
    });
    this.dataColumns = [];

    ReactDom.render(this.reactRoot, this.target);

    // this.updateCount = 0;
    // if (document) {
    //   const new_p: HTMLElement = document.createElement("p");
    //   new_p.appendChild(document.createTextNode("Update count:"));
    //   const new_em: HTMLElement = document.createElement("em");
    //   this.textNode = document.createTextNode(this.updateCount.toString());
    //   new_em.appendChild(this.textNode);
    //   new_p.appendChild(new_em);
    //   this.target.appendChild(new_p);
    // }
  }

  public update(options: VisualUpdateOptions) {
    // console.log("Visual update", options);
    // if (options.dataViews && options.dataViews[0]) {
    try {
      this.events.renderingStarted(options);

      // const dataView: DataView = options.dataViews[0];
      this.settings = Visual.parseSettings(
        options && options.dataViews && options.dataViews[0]
      );

      this.viewport = options.viewport;
      const { width, height } = this.viewport;
      const size = Math.min(width, height);

      this.dataColumns = parseDataModelColumns(
        options && options.dataViews && options.dataViews[0],
        this.dataColumns
      );

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
      };

      console.log("State", state);

      VisualMainDisplay.update(state);
    } catch (error) {
      this.events.renderingFailed(options, error);
      console.log(options, error);
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
}
