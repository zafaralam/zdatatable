import * as React from "react";
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
import { VISUAL_DISPLAY_COLUMN_TYPE } from "../../defs/enums";
import { IVisualTableColumn, IDataColumn } from "../../defs/main";
import {
  MainMeasureSettings,
  SecondaryMeasureSettings,
  TrendLineSettings,
} from "../../settings";
import {
  getConditionalFormattingColor,
  fontFamilyCSSValue,
  fontWeightCSSValue,
  textAlignCSSValue,
  validatePolyline,
} from "../../utils/common";
import { VisualConstants } from "../../VisualConstants";

interface ICellValueDisplayProps {
  index: number;
  visualTableColumn: IVisualTableColumn;
  dataColumns: IDataColumn[];
  rowValue: any;
  mainMeasureSettings: MainMeasureSettings;
  secondaryMeasureSettings: SecondaryMeasureSettings;
  trendLineSettings: TrendLineSettings;
}

export default function CellValueDisplay(props: ICellValueDisplayProps) {
  const {
    visualTableColumn,
    dataColumns,
    rowValue,
    mainMeasureSettings,
    secondaryMeasureSettings,
    trendLineSettings,
  } = props;
  // console.log(
  //   mainMeasureSettings?.fontFamily,
  //   fontFamilyCSSValue(
  //     mainMeasureSettings?.fontFamily || VisualConstants.dinReplacementFont
  //   )
  // );
  const dataColumn = dataColumns.find(
    (c) => c.queryName === visualTableColumn.queryName
  );

  // if (visualTableColumn?.conditionalFormattingRules)
  //   Debugger.LOG(
  //     visualTableColumn.queryName,
  //     visualTableColumn?.conditionalFormattingRules
  //   );
  const measureStyles: React.CSSProperties = {
    // display: "inline-block",
    // width: "100%", // * DO NOT REMOVE THIS FORM CELL.
    // textAlign: "center",
    color: getConditionalFormattingColor(
      visualTableColumn?.conditionalFormattingRules,
      rowValue[visualTableColumn.queryName]
    ),
    ...(visualTableColumn.columnType ===
    VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN
      ? {
          fontFamily: fontFamilyCSSValue(
            mainMeasureSettings?.fontFamily ||
              VisualConstants.dinReplacementFont
          ),
          fontSize: `${mainMeasureSettings?.fontSize}pt`,
          fontWeight: fontWeightCSSValue(
            mainMeasureSettings?.fontWeight ||
              VisualConstants.mainMeasureSettings.fontWeight
          ),
          // color: mainMeasureSettings?.fontColor,
        }
      : {
          fontFamily: fontFamilyCSSValue(
            secondaryMeasureSettings?.fontFamily ||
              VisualConstants.dinReplacementFont
          ),
          fontSize: `${secondaryMeasureSettings?.fontSize}pt`,
          fontWeight: fontWeightCSSValue(
            secondaryMeasureSettings?.fontWeight ||
              VisualConstants.mainMeasureSettings.fontWeight
          ),
          // color: secondaryMeasureSettings?.fontColor,
        }),
  };

  let tdStyles: React.CSSProperties = {
    background:
      visualTableColumn.columnType !==
        VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY &&
      visualTableColumn.applyBgColorToValues === false
        ? "#fff"
        : visualTableColumn.bgColor,
    ...(visualTableColumn.columnType !== VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART
      ? {
          textAlign: textAlignCSSValue(
            visualTableColumn?.textAlign ||
              VisualConstants.visualTableColumn.textAlign
          ),
          width: `${
            visualTableColumn?.width ||
            (visualTableColumn.columnType ===
            VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN
              ? VisualConstants.mainMeasureCellWidth
              : VisualConstants.secondaryMeasureCellWidth)
          }px`,
        }
      : {}),
    ...(visualTableColumn.columnType === VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART
      ? {
          width: `${
            trendLineSettings?.width || VisualConstants.trendLineSettings.width
          }px`,
        }
      : {}),
    ...{
      borderLeft:
        visualTableColumn.border?.left ||
        VisualConstants.visualTableColumn.border.left,
      borderTop:
        visualTableColumn.border?.top ||
        VisualConstants.visualTableColumn.border.top,
      borderRight:
        visualTableColumn.border?.right ||
        VisualConstants.visualTableColumn.border.right,
      borderBottom:
        visualTableColumn.border?.bottom ||
        VisualConstants.visualTableColumn.border.bottom,

      paddingLeft: `${
        visualTableColumn.padding?.left ||
        VisualConstants.visualTableColumn.padding.left
      }px`,
      paddingTop: `${
        visualTableColumn.padding?.top ||
        VisualConstants.visualTableColumn.padding.top
      }px`,
      paddingRight: `${
        visualTableColumn.padding?.right ||
        VisualConstants.visualTableColumn.padding.right
      }px`,
      paddingBottom: `${
        visualTableColumn.padding?.bottom ||
        VisualConstants.visualTableColumn.padding.bottom
      }px`,
    },
  };

  // Original
  // const points =
  //   "-18035,0 -76,18 -63,18 -51,0 -38,0 -26,0 -13,18 0,18 11,0 24,18 37,18 49,0 62,0 74,0 87,0 99,18 112,18 124,0 137,18 150,18 162,18";

  // Testing only
  const points = rowValue[visualTableColumn.queryName];
  //"-26,0 -13,18 0,18 11,0 24,18 37,18 112,18 124,0 137,18 150,18 162,18";

  const cellDisplay = (
    <td style={tdStyles}>
      {visualTableColumn.columnType ===
      VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART ? (
        points && validatePolyline(points) ? (
          <svg
            style={{
              height: `${trendLineSettings?.height}px`,
              width: `${trendLineSettings?.width}px`,
            }}
          >
            <g transform="translate(9, 1)">
              <polyline
                stroke={trendLineSettings?.strokeColor}
                fill={trendLineSettings?.fillColor}
                stroke-width={`${trendLineSettings?.strokeWidth}`}
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-dasharray="0"
                points={points}
              />
            </g>
          </svg>
        ) : (
          ""
        )
      ) : visualTableColumn.queryName.length === 0 ||
        rowValue[visualTableColumn.queryName] === undefined ||
        rowValue[visualTableColumn.queryName] === null ||
        (rowValue[visualTableColumn.queryName] as string) === "" ? (
        <div style={{ minHeight: `${trendLineSettings.height}px` }}></div>
      ) : (
        <span style={measureStyles}>
          {valueFormatter.format(
            rowValue[visualTableColumn.queryName],
            dataColumn.format
          )}
        </span>
      )}
    </td>
  );
  return cellDisplay;
}
