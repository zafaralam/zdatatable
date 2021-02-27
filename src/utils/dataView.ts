import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import {
  IDataColumn,
  IVisualData,
  IVisualValueData,
  IVisualValues,
} from "./../defs/main";
import IColorPalette = powerbi.extensibility.IColorPalette;
// import ISelectionId = powerbi.visuals.ISelectionId;
import DataViewHelper from "./DataViewHelper";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionId = powerbi.visuals.ISelectionId;
/**
 *
 * @param dataViews
 * @param dataColumns
 */
export function processDataView(
  dataViews: DataView[],
  dataColumns: IDataColumn[],
  host: IVisualHost
): IVisualValueData {
  try {
    const hasBasicDataView =
        (dataViews &&
          dataViews.length > 0 &&
          dataViews[0] &&
          dataViews[0].table &&
          dataViews[0].metadata &&
          dataViews[0].metadata.columns &&
          true) ||
        false,
      hasValues =
        hasBasicDataView &&
        dataViews[0].metadata.columns.findIndex((c) => c.roles["content"]) !==
          -1,
      rows = hasBasicDataView && dataViews[0].table.rows,
      isDataViewValid = hasBasicDataView && hasValues,
      hasData = isDataViewValid && rows.length > 0,
      visualData = hasData
        ? getVisualData(dataViews[0], dataColumns, host)
        : null;
    return {
      isDataViewValid: isDataViewValid,
      hasData: hasData,
      visualData: visualData,
    };
  } catch (error) {
    return {
      isDataViewValid: false,
      hasData: false,
      visualData: null,
    };
  }
}

function getVisualData(
  dataView: DataView,
  dataColumns: IDataColumn[],
  host: IVisualHost
): IVisualData {
  // * Don't need to do regenerate columns as the data columns will already be identified in the main visual update.
  //const columns = parseDataModelColumns(dataView, dataColumns),
  const values = getVisualDataValues(dataView.table, dataColumns, host);
  return {
    columns: dataColumns,
    values,
  };
}

function getVisualDataValues(
  table: powerbi.DataViewTable,
  columns: IDataColumn[],
  host: IVisualHost
): IVisualValues[] {
  return table.rows.map((r, ri) => {
    let row: IVisualValues = {};
    const selectionId: ISelectionId = host
      .createSelectionIdBuilder()
      .withTable(table, ri)
      .createSelectionId();
    row["rowInternalPowerBiSelectionId"] = selectionId;
    r.forEach((c, ci) => {
      const col = columns[ci];
      if (col) {
        row[col.queryName] = c;
      }
    });
    return row;
  });
}

/**
 * Identifies the columns passed in the dataView and then then checks if the columns already exists.
 * Updates existing columns information, removes columns not present in dataView
 * and inserts new columns
 * // TODO: Create test for function
 *
 * @param dataView
 * @param dataColumns
 */

export function parseDataModelColumns(
  dataView: DataView,
  host: powerbi.extensibility.visual.IVisualHost

  // colorPalette: IColorPalette
): IDataColumn[] {
  // if the data view does not have any columns then just return empty array
  if (dataView.metadata.columns.length === 0) return [];

  const _dataColumns: IDataColumn[] = dataView.metadata.columns.map(
    (item, index) => {
      // let defaultColour: powerbi.Fill = getDefaultFillColour(item, host);
      host.colorPalette["colorIndex"] = index + 1;
      const _column = {
        index: item.index,
        displayName: item.displayName,
        queryName: item.queryName,
        format: item.format,
        grouping:
          item.roles["grouping"] === undefined ? false : item.roles["grouping"],
        content:
          item.roles["content"] === undefined ? false : item.roles["content"],
        color: DataViewHelper.GET_METADATA_OBJECT_VALUE<powerbi.Fill>(
          item,
          "dataColors",
          "textColor",
          { solid: { color: "#000" } }
          //defaultColour
        ).solid.color,
        metadata: item,
      };

      return _column;
    }
  );

  return _dataColumns.sort((a, b) => a.index - b.index);
}

function getDefaultFillColour(
  measure: powerbi.DataViewMetadataColumn,
  host: powerbi.extensibility.visual.IVisualHost
): powerbi.Fill {
  return {
    solid: {
      color: host.colorPalette.getColor(`${measure.displayName}`).value,
    },
  };
}

/**
 *
 * Parses the dataView column to a internal interface.
 *
 * ? should there be a test for this
 *
 * @param item
 */
// function parseDataViewColumn(
//   item: powerbi.DataViewMetadataColumn,
//   host: powerbi.extensibility.visual.IVisualHost,
//   // colorPalette: IColorPalette
// ): IDataColumn {
//   // const selectionId: ISelectionId = host
//   //   .createSelectionIdBuilder()
//   //   .withCategory(category, i)
//   //   .createSelectionId();

// }
