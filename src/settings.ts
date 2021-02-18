/*
 *  Power BI Visualizations
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

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

// export class CircleSettings {
//   public circleColor: string = "white";
//   public circleThickness: number = 2;
// }

export class AdvancedEditingSettings {
  public visualTables: string = '{"tables": []}';
}

export class TableTitleSettings {
  public fontColor: string = "#000";
  public backgroundColor: string = "#fff";
  public fontFamily: string = "DIN";
  public fontSize: number = 10;
  public padding: number = 1;
}

export class MainMeasureSettings {
  public fontColor: string = "#000";
  public fontFamily: string = "DIN";
  public fontSize: number = 18;
}

export class SecondaryMeasureSettings {
  public fontColor: string = "#000";
  public fontFamily: string = "DIN";
  public fontSize: number = 10;
}

export class TrendLineSettings {
  public height: number = 20;
  public width: number = 150;
  public fillColor: string = "#ECECEC";
  public strokeColor: string = "#363636";
  public strokeWidth: number = 2;
}
export class VisualSettings extends DataViewObjectsParser {
  // public circle: CircleSettings = new CircleSettings();
  public advancedEditing: AdvancedEditingSettings = new AdvancedEditingSettings();
  public tableTitle: TableTitleSettings = new TableTitleSettings();
  public mainMeasure: MainMeasureSettings = new MainMeasureSettings();
  public secondaryMeasure: SecondaryMeasureSettings = new SecondaryMeasureSettings();
  public trendLine: TrendLineSettings = new TrendLineSettings();
}
