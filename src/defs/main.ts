import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import DataViewObjects = powerbi.DataViewObjects;
import {
  VISUAL_DISPLAY_COLUMN_TYPE,
  GtConditionOptions,
  LtConditionOptions,
} from "./enums";
import {
  AdvancedEditingSettings,
  TableTitleSettings,
  TrendLineSettings,
  MainMeasureSettings,
  SecondaryMeasureSettings,
  GroupingColumnSettings,
  TablesSettings,
} from "../settings";
import AdvanceEditorData from "../models/advanceEditor";
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
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
  groupingColumnSettings: GroupingColumnSettings;
  tablesSettings: TablesSettings;
}

export interface IVisualTable {
  name?: string;
  columns: IVisualTableColumn[];
  fullWidth: boolean;
  showTitle: boolean;
  totalTableColumns?: number;
}

export interface IVisualTableColumn {
  label: string;
  columnType: VISUAL_DISPLAY_COLUMN_TYPE;
  isMeasure: boolean;
  level: number;
  queryName?: string;
  dataColumnIndex?: number;
  columns?: IVisualTableColumn[];
  labelFontSize?: number;
  labelFontFamily?: string;
  labelFontWeight?: string;
  textColor?: string;
  // applyTextColorToValues?: boolean;
  bgColor?: string;
  applyBgColorToValues?: boolean;
  textAlign?: string;
  border?: IColumnBorder;
  padding?: IColumnPadding;
  width?: number; // this should only be for the measure fields and not for the display only fields.
  applyConditionalFormatting?: boolean;
  conditionalFormattingRules?: IConditionalFormattingRule[];
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
  format?: string;
  grouping: boolean;
  content: boolean;
  color: string;
  metadata: DataViewMetadataColumn;
}

export interface IVisualValues {
  [key: string]: any;
}

export interface IColumnBorder {
  left: string;
  top: string;
  right: string;
  bottom: string;
}

export interface IColumnPadding {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

// export interface ITableValueColumn {
//   queryName: string;
//   type: VISUAL_DISPLAY_COLUMN_TYPE;
// }

export interface IConditionalFormattingRule {
  gtOption: GtConditionOptions;
  ltOption: LtConditionOptions;
  gtValue: number;
  ltValue: number;
  color: string;
}
