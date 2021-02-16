import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import DataViewObjects = powerbi.DataViewObjects;
import { VISUAL_DISPLAY_COLUMN_TYPE } from "./enums";
import { AdvancedEditingSettings } from "../settings";
// Visual Settings Imports here

export interface IVisualMainDisplayProps {
  // Power BI visual host service
  host: IVisualHost;
  // Localization manager instance
  localizationManager: ILocalizationManager;
}

export interface IVisualMainDisplayState {
  updateOptions?: VisualUpdateOptions;
  isEditMode: boolean;
  canAdvanceEdit: boolean;
  advancedEditing: AdvancedEditingSettings;
  objectMetadata?: DataViewObjects;
  data: IVisualValueData; // Visual Data (mapped from data view)
  // visualTables?: IVisualTable[]
}

export interface IVisualTable {
  name?: string;
  columns: IVisualTableColumn[];
}

export interface IVisualTableColumn {
  label: string;
  displayOnly: VISUAL_DISPLAY_COLUMN_TYPE;
  queryName?: string;
  dataColumnIndex?: number;
  columns: IVisualTableColumn[];
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
