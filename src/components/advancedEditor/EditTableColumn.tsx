import * as React from "react";
import {
  EDIT_COLUMNS_PARENT_TYPE,
  VISUAL_DISPLAY_COLUMN_TYPE,
} from "../../defs/enums";
import { IDataColumn, IVisualTableColumn } from "../../defs/main";
import EditTableColumns from "./EditTableColumns";

interface IEditTableColumnProps {
  column: IVisualTableColumn;
  index: number;
  dataColumns: IDataColumn[];
  onVisualColumnUpdate: Function;
  onVisualColumnRemoval: Function;
}
import { BsFillTrashFill, BsPlusSquare, BsGear } from "react-icons/bs";

export default class EditTableColumn extends React.Component<IEditTableColumnProps> {
  constructor(props) {
    super(props);
    this.handleAddVisualColumn = this.handleAddVisualColumn.bind(this);
    this.handleVisualColumnsUpdateOfColumn = this.handleVisualColumnsUpdateOfColumn.bind(
      this
    );
    this.handleColumnPropertyChange = this.handleColumnPropertyChange.bind(
      this
    );
  }
  private handleAddVisualColumn(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    let column: IVisualTableColumn = JSON.parse(
      JSON.stringify(this.props.column)
    );
    column.columns.push({
      label: "",
      columnType: VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
      queryName: "",
      dataColumnIndex: null,
      columns: [],
    });
    this.props.onVisualColumnUpdate(column, this.props.index);
  }

  /**
   * Sends an update about columns within the current column to the parent
   * above.
   * * This function is very important
   * @param columns
   */
  private handleVisualColumnsUpdateOfColumn(columns: IVisualTableColumn[]) {
    let _column: IVisualTableColumn = JSON.parse(
      JSON.stringify(this.props.column)
    );
    _column.columns = columns;

    this.props.onVisualColumnUpdate(_column, this.props.index);
  }

  private handleColumnPropertyChange(property: string, value: any) {
    const _column = JSON.parse(JSON.stringify(this.props.column));

    _column[property] = value;

    this.props.onVisualColumnUpdate(_column, this.props.index);
  }
  render() {
    const {
      label,
      columnType,
      queryName,
      dataColumnIndex,
      columns,
    } = this.props.column;
    const hasColumns = columns && columns.length !== 0,
      columnsAllowed = columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
      dataColumnSet = queryName && queryName.length !== 0;

    return (
      <div key={this.props.index} className="edit-table__column">
        {/* <input
          type="text"
          value={label}
          onChange={(e) => {
            this.handleColumnPropertyChange("label", e.target.value);
          }}
        /> */}
        <span>{label.length === 0 ? "Column" : label}</span>
        <button className="icon-btn">
          <BsGear />
        </button>
        <button
          className="icon-btn"
          title="Remove Column"
          onClick={() => {
            this.props.onVisualColumnRemoval(this.props.index);
          }}
        >
          <BsFillTrashFill />
        </button>
        <button
          title="Add Column"
          className="icon-btn"
          onClick={this.handleAddVisualColumn}
        >
          <BsPlusSquare />
        </button>
        {columnsAllowed && hasColumns ? (
          <EditTableColumns
            dataColumns={this.props.dataColumns}
            visualColumns={columns}
            parentType={EDIT_COLUMNS_PARENT_TYPE.COLUMN}
            onVisualColumnsUpdateOfColumn={
              this.handleVisualColumnsUpdateOfColumn
            }
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
