/**
 * ! These samples are for testing only and will not be used in production
 * // TODO: Remove from prod
 */
import { VISUAL_DISPLAY_COLUMN_TYPE } from "../defs/enums";
import { IVisualTable } from "../defs/main";

export const SingleTable: IVisualTable[] = [
  {
    name: "Testing",
    columns: [
      {
        label: "First Urgent Appt",
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        columns: [
          {
            label: "Last Month",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
              },
            ],
          },
          {
            label: "Current FYTD",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
              },
            ],
          },
          {
            label: "Trend (13m)",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART,
            queryName: "",
            dataColumnIndex: null,
          },
        ],
      },
      {
        label: "First Semi-Urgent Appt",
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        columns: [
          {
            label: "Last Month",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
              },
            ],
          },
          {
            label: "Current FYTD",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
              },
            ],
          },
          {
            label: "Trend (13m)",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART,
            queryName: "",
            dataColumnIndex: null,
          },
        ],
      },
      {
        label: "First Routine Appt",
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        columns: [
          {
            label: "Last Month",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
              },
            ],
          },
          {
            label: "Current FYTD",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
              },
            ],
          },
          {
            label: "Trend (13m)",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART,
            queryName: "",
            dataColumnIndex: null,
          },
        ],
      },
    ],
    totalTableColumns: 0,
  },
];
