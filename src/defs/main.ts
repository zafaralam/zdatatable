import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import DataViewObjects = powerbi.DataViewObjects;
import { VISUAL_DISPLAY_COLUMN_TYPE } from "./enums";
import {
  AdvancedEditingSettings,
  TableTitleSettings,
  TrendLineSettings,
  MainMeasureSettings,
  SecondaryMeasureSettings,
} from "../settings";
import AdvanceEditorData from "../models/advanceEditor";
// Visual Settings Imports here

export interface IVisualMainDisplayProps {
  // Power BI visual host service
  host: IVisualHost;
  // Localization manager instance
  localizationManager: ILocalizationManager;
  // updateDisplayTables: Function;
  advEditorData: AdvanceEditorData;
}

export interface IVisualMainDisplayState {
  updateOptions?: VisualUpdateOptions;
  isEditMode: boolean;
  canAdvanceEdit: boolean;
  advancedEditing: AdvancedEditingSettings;
  objectMetadata?: DataViewObjects;
  data: IVisualValueData; // Visual Data (mapped from data view)
  // visualTables?: IVisualTable[];
  tableTitleSettings: TableTitleSettings;
  mainMeasureSettings: MainMeasureSettings;
  secondaryMeasureSettings: SecondaryMeasureSettings;
  trendLineSettings: TrendLineSettings;
}

export interface IVisualTable {
  name?: string;
  columns: IVisualTableColumn[];
  totalTableColumns: number;
}

export interface IVisualTableColumn {
  label: string;
  columnType: VISUAL_DISPLAY_COLUMN_TYPE;
  level: number;
  queryName?: string;
  dataColumnIndex?: number;
  columns?: IVisualTableColumn[];
  labelFontSize?: number;
  textColor?: string;
  applyTextColorToValues?: boolean;
  bgColor?: string;
  applyBgColorToValues?: boolean;
}

export interface IVisualValueData {
  isDataViewValid: boolean;
  hasData: boolean;
  // valuesDataRoleIndex: number;
  visualData: IVisualData;
}

export interface IVisualData {
  columns: IDataColumn[];
  values?: IVisualValues[];
}

export interface IDataColumn {
  index: number;
  displayName: string;
  queryName: string;
  label?: string;
  format?: string;
  grouping: boolean;
  content: boolean;
}

export interface IVisualValues {
  [key: string]: any;
}

// export interface ITableValueColumn {
//   queryName: string;
//   type: VISUAL_DISPLAY_COLUMN_TYPE;
// }
