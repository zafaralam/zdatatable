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

/**
 *
 * @param dataViews
 * @param dataColumns
 */
export function processDataView(
  dataViews: DataView[],
  dataColumns: IDataColumn[]
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
      visualData = hasData ? getVisualData(dataViews[0], dataColumns) : null;
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
  dataColumns: IDataColumn[]
): IVisualData {
  // * Don't need to do regenerate columns as the data columns will already be identified in the main visual update.
  //const columns = parseDataModelColumns(dataView, dataColumns),
  const values = getVisualDataValues(dataView.table, dataColumns);
  return {
    columns: dataColumns,
    values,
  };
}

function getVisualDataValues(
  table: powerbi.DataViewTable,
  columns: IDataColumn[]
): IVisualValues[] {
  return table.rows.map((r) => {
    let row: IVisualValues = {};
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
  dataColumns: IDataColumn[],
  colorPalette: IColorPalette
): IDataColumn[] {
  // if the data view does not have any columns then just remove all columns
  if (dataView.metadata.columns.length === 0) return [];

  // if the data columns not present then just return the columns from the data view
  if (dataColumns === undefined || dataColumns.length === 0)
    return dataView.metadata.columns.map((item) => {
      return parseDataViewColumn(item, colorPalette);
    });

  let _dataColumns: IDataColumn[] = JSON.parse(JSON.stringify(dataColumns));

  // Remove columns that are not in the data view anymore
  _dataColumns = _dataColumns.filter((x) => {
    return dataView.metadata.columns.some((t) => t.queryName === x.queryName);
  });

  // if a data column exists then just override some information
  dataView.metadata.columns
    .filter((x) => {
      return _dataColumns.some((t) => t.queryName === x.queryName);
    })
    .forEach((item) => {
      const _idx = _dataColumns.findIndex(
        (t) => t.queryName === item.queryName
      );
      _dataColumns[_idx]["index"] = item.index;
      _dataColumns[_idx]["displayName"] = item.displayName;
      _dataColumns[_idx]["format"] = item.format;
      _dataColumns[_idx]["grouping"] =
        item.roles["grouping"] === undefined ? false : item.roles["grouping"];
      _dataColumns[_idx]["content"] =
        item.roles["content"] === undefined ? false : item.roles["content"];
      _dataColumns[_idx]["color"] = colorPalette.getColor(item.queryName).value;
    });

  // add data columns that are new in the data view
  dataView.metadata.columns
    .filter((x) => {
      return !_dataColumns.some((t) => t.queryName === x.queryName);
    })
    .forEach((item) => {
      _dataColumns.push(parseDataViewColumn(item, colorPalette));
    });

  return _dataColumns.sort((a, b) => a.index - b.index);
}
/**
 *
 * Parses the dataView column to a internal interface.
 *
 * ? should there be a test for this
 *
 * @param item
 */
function parseDataViewColumn(
  item: powerbi.DataViewMetadataColumn,
  // host: powerbi.extensibility.visual.IVisualHost,
  colorPalette: IColorPalette
): IDataColumn {
  // const selectionId: ISelectionId = host
  //   .createSelectionIdBuilder()
  //   .withCategory(category, i)
  //   .createSelectionId();
  return {
    index: item.index,
    displayName: item.displayName,
    queryName: item.queryName,
    format: item.format,
    grouping:
      item.roles["grouping"] === undefined ? false : item.roles["grouping"],
    content:
      item.roles["content"] === undefined ? false : item.roles["content"],
    color: colorPalette.getColor(item.queryName).value,
  };
}
