// import { visual } from "./../pbiviz.json";
import {
  VISUAL_DISPLAY_COLUMN_TYPE,
  EDIT_COLUMNS_PARENT_TYPE,
} from "./defs/enums";

const defaultTextColor = "#3E3B4A",
  defaultBgColor = "#fff",
  defaultBorderColor = "#83838D", //#0F0F10
  defaultFontFamily = "Arial"; //"Roboto, helvetica, arial, sans-serif";
export const VisualConstants = {
  //   visual: visual,
  debug: true, // switch of in production release.
  dinReplacementFont: "Roboto, helvetica, arial, sans-serif", // * This is also the default font used.
  defaultTextColor,
  tables: {
    spaceBetweenTables: 16,
    borderWidth: 0,
    borderColor: defaultBorderColor,
    filterEmptyRows: true,
    noDataMessage: "No Data Available",
  },
  visualTable: {
    name: "",
    columns: [],
    fullWidth: false,
    showTitle: true,
    totalTableColumns: 0,
  },
  visualTableColumn: {
    label: "",
    columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
    // level: null, // Should be done in the Edit table and edit column
    isMeasure: false,
    queryName: "",
    dataColumnIndex: null,
    columns: [],
    labelFontSize: 10,
    labelFontFamily: defaultFontFamily,
    labelFontWeight: "normal",
    textColor: defaultTextColor,
    bgColor: defaultBgColor,
    applyBgColorToValues: false,
    textAlign: "center",
    width: null,
    border: {
      left: `1px solid ${defaultBorderColor}`,
      top: `1px solid ${defaultBorderColor}`,
      right: `1px solid ${defaultBorderColor}`,
      bottom: `1px solid ${defaultBorderColor}`,
    },
    padding: {
      left: 2,
      top: 4,
      right: 2,
      bottom: 4,
    },
    applyConditionalFormatting: false,
    conditionalFormattingRules: [],
  },
  baseColumnBgColor: "#5F6162",
  baseColumnTextColor: "#fff",
  subColumnBgColor: "#D9D9D9",
  mainMeasureCellWidth: 65,
  secondaryMeasureCellWidth: 35,

  tableTitleSettings: {
    fontColor: defaultTextColor,
    fontFamily: defaultFontFamily,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: defaultBgColor,
    padding: 1,
  },

  mainMeasureSettings: {
    fontColor: defaultTextColor,
    fontFamily: defaultFontFamily,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryMeasureSettings: {
    fontColor: defaultTextColor,
    fontFamily: defaultFontFamily,
    fontSize: 10,
    fontWeight: "normal",
  },
  trendLineSettings: {
    height: 20,
    width: 180,
    fillColor: "#FAFAFA", //"#ECECEC",
    strokeColor: "#363636",
    strokeWidth: 1,
  },
  groupingColumnSettings: {
    showGroupingColumn: true,
    width: 200, // based on excel 8.43 = 64px
    borderWidth: 1,
    borderColor: defaultBorderColor,
    headerBackgroundColor: "#5F6162",
    headerFontColor: "#fff",
    headerFontFamily: defaultFontFamily,
    headerFontSize: 11,
    headerFontWeight: "bold",
    headerTextAlign: "center",
    valuesBackgroundColor: "#fff",
    valuesFontColor: "#000",
    valuesFontFamily: defaultFontFamily,
    valuesFontSize: 10,
    valuesFontWeight: "normal",
    valuesTextAlign: "left",
    applyBorderToHeader: true,
    applyBorderToValues: true,
  },
};

export const FontWeights = [
  {
    displayName: "Initial",
    value: "initial",
  },
  {
    displayName: "Normal",
    value: "normal",
  },
  {
    displayName: "Lighter",
    value: "lighter",
  },
  {
    displayName: "Bold",
    value: "bold",
  },
];

export const FontFamilies = [
  {
    displayName: "Arial",
    value: "Arial",
  },
  {
    displayName: "Arial Black",
    value: '"Arial Black"',
  },
  {
    displayName: "Arial Unicode MS",
    value: '"Arial Unicode MS"',
  },
  {
    displayName: "Calibri",
    value: "Calibri",
  },
  {
    displayName: "Cambria",
    value: "Cambria",
  },
  {
    displayName: "Cambria Math",
    value: '"Cambria Math"',
  },
  {
    displayName: "Candara",
    value: "Candara",
  },
  {
    displayName: "Comic Sans MS",
    value: '"Comic Sans MS"',
  },
  {
    displayName: "Consolas",
    value: "Consolas",
  },
  {
    displayName: "Constantia",
    value: "Constantia",
  },
  {
    displayName: "Corbel",
    value: "Corbel",
  },
  {
    displayName: "Courier New",
    value: '"Courier New"',
  },
  {
    displayName: "Georgia",
    value: "Georgia",
  },
  {
    displayName: "Helvetica",
    value: "'Helvetica', 'Arial', sans-serif",
  },
  {
    displayName: "Lucida Sans Unicode",
    value: '"Lucida Sans Unicode"',
  },
  { displayName: "Roboto", value: "Roboto, helvetica, arial, sans-serif" },
  {
    displayName: "Segoe (Bold)",
    value: '"Segoe UI Bold", wf_segoe-ui_bold, helvetica, arial, sans-serif',
  },
  {
    displayName: "Segoe UI",
    value: '"Segoe UI", wf_segoe-ui_normal, helvetica, arial, sans-serif',
  },
  {
    displayName: "Segoe UI Light",
    value: '"Segoe UI Light", wf_segoe-ui_bold, helvetica, arial, sans-serif',
  },
  {
    displayName: "Symbol",
    value: "Symbol",
  },
  {
    displayName: "Tahoma",
    value: "Tahoma",
  },
  {
    displayName: "Times New Roman",
    value: '"Times New Roman"',
  },
  {
    displayName: "Trebuchet MS",
    value: '"Trebuchet MS"',
  },
  {
    displayName: "Verdana",
    value: "Verdana",
  },
  {
    displayName: "Wingdings",
    value: "Wingdings",
  },
];
