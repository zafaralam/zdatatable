// import { visual } from "./../pbiviz.json";
import {
  VISUAL_DISPLAY_COLUMN_TYPE,
  EDIT_COLUMNS_PARENT_TYPE,
} from "./defs/enums";

const defaultTextColor = "#3F3F44",
  defaultBgColor = "#fff",
  defaultBorderColor = "#83838D", //#0F0F10
  defaultFontFamily = "Segoe UI";
export const VisualConstants = {
  //   visual: visual,
  dinReplacementFont: "Roboto, helvetica, arial, sans-serif",
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
  },
  mainMeasureCellWidth: 50,
  secondaryMeasureCellWidth: 25,

  tableTitleSettings: {
    fontColor: defaultTextColor,
    fontFamily: defaultFontFamily,
    fontSize: 14,
    backgroundColor: defaultBgColor,
    padding: 1,
  },

  mainMeasureSettings: {
    fontColor: defaultTextColor,
    fontFamily: defaultFontFamily,
    fontSize: 18,
  },
  secondaryMeasureSettings: {
    fontColor: defaultTextColor,
    fontFamily: defaultFontFamily,
    fontSize: 10,
  },
  trendLineSettings: {
    height: 20,
    width: 180,
    fillColor: "#FAFAFA", //"#ECECEC",
    strokeColor: "#363636",
    strokeWidth: 1,
  },
};
