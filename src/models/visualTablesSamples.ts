/**
 * ! These samples are for testing only and will not be used in production
 * // TODO: Remove from prod
 */
import { VISUAL_DISPLAY_COLUMN_TYPE } from "../defs/enums";
import { IVisualTable } from "../defs/main";

export const SingleTable: IVisualTable[] = [
  {
    name: "Testing",
    showTitle: true,
    fullWidth: false,
    columns: [
      {
        label: "First Urgent Appt",
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        level: 1,
        columns: [
          {
            label: "Last Month",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName:
                  "fctOPEpisodeFirstAppt.Urgent First Appointment Attended Within Waiting Period",
                dataColumnIndex: 0,
                level: 3,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Current FYTD",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Trend (13m)",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
          },
        ],
      },
      {
        label: "First Semi-Urgent Appt",
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        level: 1,
        columns: [
          {
            label: "Last Month",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName:
                  "fctOPEpisodeFirstAppt.Semi Urgent First Appointment Booked",
                dataColumnIndex: 2,
                level: 3,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Current FYTD",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Trend (13m)",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
          },
        ],
      },
      {
        label: "First Routine Appt",
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        level: 1,
        columns: [
          {
            label: "Last Month",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName:
                  "fctOPEpisodeFirstAppt.Routine First Appointment Booked",
                dataColumnIndex: 3,
                level: 3,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Current FYTD",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
              {
                label: "",
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Trend (13m)",
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
          },
        ],
      },
    ],
    totalTableColumns: 0,
  },
];
