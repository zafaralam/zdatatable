// import { visual } from "./../pbiviz.json";
import {
  VISUAL_DISPLAY_COLUMN_TYPE,
  EDIT_COLUMNS_PARENT_TYPE,
} from "./defs/enums";

const defaultTextColor = "#000",
  defaultBgColor = "#fff",
  defaultFontFamily = "Arial";
export const VisualConstants = {
  //   visual: visual,
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
      left: "1px solid gray",
      top: "1px solid gray",
      right: "1px solid gray",
      bottom: "1px solid gray",
    },
    padding: {
      left: 4,
      top: 2,
      right: 4,
      bottom: 2,
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
    fillColor: "#ECECEC",
    strokeColor: "#363636",
    strokeWidth: 2,
  },
};
