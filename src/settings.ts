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
import { VisualConstants } from "./VisualConstants";
// export class CircleSettings {
//   public circleColor: string = "white";
//   public circleThickness: number = 2;
// }

export class AdvancedEditingSettings {
  public visualTables: string = '{"tables": []}';
}

export class TableTitleSettings {
  public fontColor: string = VisualConstants.tableTitleSettings.fontColor;
  public backgroundColor: string =
    VisualConstants.tableTitleSettings.backgroundColor;
  public fontFamily: string = VisualConstants.tableTitleSettings.fontFamily;
  public fontSize: number = VisualConstants.tableTitleSettings.fontSize;
  public fontWeight: string = VisualConstants.tableTitleSettings.fontWeight;
  public textAlign: string = VisualConstants.tableTitleSettings.textAlign;
  public padding: number = VisualConstants.tableTitleSettings.padding;
}

export class MainMeasureSettings {
  public fontColor: string = VisualConstants.mainMeasureSettings.fontColor;
  public fontFamily: string = VisualConstants.mainMeasureSettings.fontFamily;
  public fontSize: number = VisualConstants.mainMeasureSettings.fontSize;
  public fontWeight: string = VisualConstants.mainMeasureSettings.fontWeight;
}

export class SecondaryMeasureSettings {
  public fontColor: string = VisualConstants.secondaryMeasureSettings.fontColor;
  public fontFamily: string =
    VisualConstants.secondaryMeasureSettings.fontFamily;
  public fontSize: number = VisualConstants.secondaryMeasureSettings.fontSize;
  public fontWeight: string =
    VisualConstants.secondaryMeasureSettings.fontWeight;
}

export class TrendLineSettings {
  public height: number = VisualConstants.trendLineSettings.height;
  public width: number = VisualConstants.trendLineSettings.width;
  public fillColor: string = VisualConstants.trendLineSettings.fillColor;
  public strokeColor: string = VisualConstants.trendLineSettings.strokeColor;
  public strokeWidth: number = VisualConstants.trendLineSettings.strokeWidth;
}

export class GroupingColumnSettings {
  public showGroupingColumn: boolean =
    VisualConstants.groupingColumnSettings.showGroupingColumn;
  public width: number = VisualConstants.groupingColumnSettings.width;
  public borderWidth: number =
    VisualConstants.groupingColumnSettings.borderWidth;
  public borderColor: string =
    VisualConstants.groupingColumnSettings.borderColor;
  public applyBorderToHeader: boolean =
    VisualConstants.groupingColumnSettings.applyBorderToHeader;
  public applyBorderToValues: boolean =
    VisualConstants.groupingColumnSettings.applyBorderToValues;
  public headerBackgroundColor: string =
    VisualConstants.groupingColumnSettings.headerBackgroundColor;
  public headerFontColor: string =
    VisualConstants.groupingColumnSettings.headerFontColor;
  public headerFontFamily: string =
    VisualConstants.groupingColumnSettings.headerFontFamily;
  public headerFontSize: number =
    VisualConstants.groupingColumnSettings.headerFontSize;
  public headerFontWeight: string =
    VisualConstants.groupingColumnSettings.headerFontWeight;
  public headerTextAlign: string =
    VisualConstants.groupingColumnSettings.headerTextAlign;
  public valuesBackgroundColor: string =
    VisualConstants.groupingColumnSettings.valuesBackgroundColor;
  public valuesFontColor: string =
    VisualConstants.groupingColumnSettings.valuesFontColor;
  public valuesFontFamily: string =
    VisualConstants.groupingColumnSettings.valuesFontFamily;
  public valuesFontSize: number =
    VisualConstants.groupingColumnSettings.valuesFontSize;
  public valuesFontWeight: string =
    VisualConstants.groupingColumnSettings.valuesFontWeight;
  public valuesTextAlign: string =
    VisualConstants.groupingColumnSettings.valuesTextAlign;
  // public header: boolean = true;
  // public values: boolean = true;
}
export class VisualSettings extends DataViewObjectsParser {
  // public circle: CircleSettings = new CircleSettings();
  public advancedEditing: AdvancedEditingSettings = new AdvancedEditingSettings();
  public tableTitle: TableTitleSettings = new TableTitleSettings();
  public mainMeasure: MainMeasureSettings = new MainMeasureSettings();
  public secondaryMeasure: SecondaryMeasureSettings = new SecondaryMeasureSettings();
  public trendLine: TrendLineSettings = new TrendLineSettings();
  public groupingColumn: GroupingColumnSettings = new GroupingColumnSettings();
}
