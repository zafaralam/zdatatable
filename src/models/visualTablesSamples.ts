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
        isMeasure: false,
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        level: 1,
        columns: [
          {
            label: "Last Month",
            isMeasure: false,
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName:
                  "fctOPEpisodeFirstAppt.Urgent First Appointment Attended Within Waiting Period",
                dataColumnIndex: 0,
                level: 3,
              },
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Current FYTD",
            isMeasure: false,
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Trend (13m)",
            isMeasure: true,
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
          },
        ],
      },
      {
        label: "First Semi-Urgent Appt",
        isMeasure: false,
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        level: 1,
        columns: [
          {
            label: "Last Month",
            isMeasure: false,
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName:
                  "fctOPEpisodeFirstAppt.Semi Urgent First Appointment Booked",
                dataColumnIndex: 2,
                level: 3,
              },
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Current FYTD",
            isMeasure: false,
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Trend (13m)",
            isMeasure: true,
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
          },
        ],
      },
      {
        label: "First Routine Appt",
        isMeasure: false,
        columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
        queryName: "",
        dataColumnIndex: null,
        level: 1,
        columns: [
          {
            label: "Last Month",
            isMeasure: false,
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName:
                  "fctOPEpisodeFirstAppt.Routine First Appointment Booked",
                dataColumnIndex: 3,
                level: 3,
              },
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Current FYTD",
            isMeasure: false,
            columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
            queryName: "",
            dataColumnIndex: null,
            level: 2,
            columns: [
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
              {
                label: "",
                isMeasure: true,
                columnType: VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY,
                queryName: "",
                dataColumnIndex: null,
                level: 3,
              },
            ],
          },
          {
            label: "Trend (13m)",
            isMeasure: true,
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
