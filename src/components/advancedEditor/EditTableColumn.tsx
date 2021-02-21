import * as React from "react";
import {
  EDIT_COLUMNS_PARENT_TYPE,
  VISUAL_DISPLAY_COLUMN_TYPE,
} from "../../defs/enums";
import { IDataColumn, IVisualTableColumn } from "../../defs/main";
import EditTableColumns from "./EditTableColumns";
import ColorPicker from "./ColorPicker";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  DialogTitle,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  // FormControlLabel,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Paper,
} from "@material-ui/core";

import CellBorder from "./CellBorder";

interface IEditTableColumnProps {
  column: IVisualTableColumn;
  index: number;
  dataColumns: IDataColumn[];
  onVisualColumnUpdate: Function;
  onVisualColumnRemoval: Function;
}
import {
  BsFillTrashFill,
  //   BsPlusSquare,
  BsPencil,
  BsLayoutThreeColumns,
  BsTextLeft,
  BsTextCenter,
  BsTextRight,
} from "react-icons/bs";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// import { formatPrefix } from "d3";
import { VisualConstants } from "./../../VisualConstants";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      //   minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function EditTableColumn(props: IEditTableColumnProps) {
  const classes = useStyles();
  const {
    label,
    columnType,
    queryName,
    dataColumnIndex,
    columns,
    level,
    textAlign,
    padding,
    border,
  } = props.column;
  const hasColumns = columns && columns.length !== 0,
    columnsAllowed = columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
    dataColumnSet = queryName && queryName.length !== 0;
  const [dialog, setDialog] = React.useState(false);
  const handleDialogOpen = () => {
    setDialog(true);
  };
  const handleDialogClose = () => {
    setDialog(false);
  };
  const handleAddVisualColumn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    let column: IVisualTableColumn = JSON.parse(JSON.stringify(props.column));
    column.columns.push({
      ...VisualConstants.visualTableColumn,
      dataColumnIndex: null,
      level: level + 1,
    });
    props.onVisualColumnUpdate(column, props.index);
  };

  /**
   * Sends an update about columns within the current column to the parent
   * above.
   * * This function is very important
   * @param columns
   */
  const handleVisualColumnsUpdateOfColumn = (columns: IVisualTableColumn[]) => {
    let _column: IVisualTableColumn = JSON.parse(JSON.stringify(props.column));
    _column.columns = columns;

    props.onVisualColumnUpdate(_column, props.index);
  };

  const handleColumnPropertyChange = (property: string, value: any) => {
    const _column = JSON.parse(JSON.stringify(props.column));

    _column[property] = value;

    props.onVisualColumnUpdate(_column, props.index);
  };

  const handlePaddingChange = (side: string, value: number) => {
    const _padding = {
      ...(padding || VisualConstants.visualTableColumn.padding),
      [side]: value,
    };

    handleColumnPropertyChange("padding", _padding);
  };

  const handleBorderChange = (side: string, value: number) => {
    const _border = {
      ...(border || VisualConstants.visualTableColumn.border),
      [side]: value,
    };
    handleColumnPropertyChange("border", _border);
  };

  const handleColumnTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const _valueToSet = parseInt((event.target as HTMLInputElement).value);
    const _column: IVisualTableColumn = JSON.parse(
      JSON.stringify(props.column)
    );
    _column["columnType"] = _valueToSet;

    switch (_valueToSet) {
      case VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN:
        _column["width"] = VisualConstants.mainMeasureCellWidth;
        break;
      case VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY:
        _column["width"] = VisualConstants.secondaryMeasureCellWidth;
        break;
      // * Do not need the below as it's set in the power bi common tab
      // case VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART:
      //   _column["width"] = 180;
      //   break;

      default:
        _column["width"] = null;
        break;
    }

    /**
     * * Extra protection in case a user does change the column type
     */
    if (_valueToSet === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY) {
      _column.queryName = "";
      _column.dataColumnIndex = null;
      _column.isMeasure = false;
      _column["columns"] = [];
      _column["bgColor"] = VisualConstants.visualTableColumn.bgColor;
      _column["applyBgColorToValues"] = false;
      _column["textColor"] = VisualConstants.visualTableColumn.textColor;
      // _column["applyTextColorToValues"] = false;
      _column["labelFontSize"] =
        VisualConstants.visualTableColumn.labelFontSize;
    } else {
      // for a non-display only column a user cannot add sub column and should be a measure column
      _column["columns"] = [];
      _column.isMeasure = true;
    }
    props.onVisualColumnUpdate(_column, props.index);
  };

  const handleMeasureSelectionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as string;
    const _column: IVisualTableColumn = JSON.parse(
      JSON.stringify(props.column)
    );
    _column.queryName = _valueToSet;
    if (_valueToSet && _valueToSet.length !== 0)
      _column.dataColumnIndex = props.dataColumns.findIndex(
        (i) => i.queryName === _valueToSet
      );
    else _column.dataColumnIndex = null;

    props.onVisualColumnUpdate(_column, props.index);
  };

  return (
    <div key={props.index} className="edit-table__column">
      <span
        style={{
          maxWidth: "180px",
          display: "inline-block",
          fontSize: "0.85rem",
        }}
      >
        {label.length === 0
          ? columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY
            ? "Column"
            : "Measure"
          : label}
      </span>
      <IconButton
        aria-label="edit"
        onClick={handleDialogOpen}
        style={{ fontSize: "1rem" }}
      >
        <BsPencil />
      </IconButton>
      <IconButton
        style={{ color: "#a50d0d", fontSize: "1rem" }}
        aria-label="edit"
        title="Remove Column"
        onClick={() => {
          props.onVisualColumnRemoval(props.index);
        }}
      >
        <BsFillTrashFill />
      </IconButton>

      <Dialog
        open={dialog}
        onClose={handleDialogClose}
        disableBackdropClick
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Grid container direction="row" justify="space-between">
            <Grid item xs={8}>
              {label.length === 0
                ? columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY
                  ? "Column"
                  : "Measure Column"
                : label}
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1" gutterBottom>
                {props.column.isMeasure
                  ? "Measure Column"
                  : `Sub columns: ${(columns && columns.length) || 0}`}
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent style={{ minHeight: "450px" }}>
          <div>
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                label="Column Name (Label to display)"
                value={label}
                onChange={(e) => {
                  handleColumnPropertyChange("label", e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div style={{ marginTop: "8px" }}>
            <FormControl
              className={classes.formControl}
              component="fieldset"
              fullWidth
            >
              <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item xs={2}>
                  <Typography variant="body1">Column Type</Typography>
                </Grid>
                <Grid container item xs={10}>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    value={columnType}
                    onChange={handleColumnTypeChange}
                    defaultValue={VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY}
                  >
                    <FormControlLabel
                      value={VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY}
                      control={<Radio color="primary" />}
                      label="Display Only"
                    />
                    <FormControlLabel
                      value={VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN}
                      control={<Radio color="primary" />}
                      label="Main Measure"
                    />
                    <FormControlLabel
                      value={VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY}
                      control={<Radio color="primary" />}
                      label="Secondary Measure"
                    />
                    <FormControlLabel
                      value={VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART}
                      control={<Radio color="primary" />}
                      label="Trend Chart"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </FormControl>
          </div>
          {columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY ? (
            <div>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel id="select-measure-label">
                  Measure to display
                </InputLabel>
                <Select
                  labelId="select-measure-label"
                  value={queryName}
                  onChange={handleMeasureSelectionChange}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {props.dataColumns
                    .filter((i) => i.content === true)
                    .map((dc) => {
                      return (
                        <MenuItem value={dc.queryName}>
                          {dc.displayName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
          ) : (
            ""
          )}

          <div>
            <FormControl className={classes.formControl} fullWidth>
              <Grid container direction="row" spacing={1} alignItems="center">
                <Grid item xs={2}>
                  <Typography variant="body1">Background Color</Typography>
                </Grid>
                <Grid item xs={1}>
                  <ColorPicker
                    color={
                      props.column.bgColor != undefined
                        ? props.column.bgColor
                        : VisualConstants.visualTableColumn.bgColor
                    }
                    onColorChange={(color) => {
                      handleColumnPropertyChange("bgColor", color);
                    }}
                  />
                </Grid>
                {columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY &&
                label.length !== 0 ? (
                  <Grid
                    container
                    item
                    xs={6}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item xs={1}>
                      <Checkbox
                        checked={
                          props.column.applyBgColorToValues === undefined
                            ? false
                            : props.column.applyBgColorToValues
                        }
                        onChange={(e) => {
                          handleColumnPropertyChange(
                            "applyBgColorToValues",
                            e.target.checked
                          );
                        }}
                        color="primary"
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        Apply Background Color to Values
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </FormControl>
          </div>
          {(columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY &&
            label.length !== 0) ||
          columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY ? (
            <div>
              <FormControl className={classes.formControl} fullWidth>
                <Grid container direction="row" spacing={1} alignItems="center">
                  <Grid item xs={2}>
                    <Typography variant="body1">Text Color</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <ColorPicker
                      color={
                        props.column.textColor === undefined
                          ? VisualConstants.visualTableColumn.textColor
                          : props.column.textColor
                      }
                      onColorChange={(color) => {
                        handleColumnPropertyChange("textColor", color);
                      }}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </div>
          ) : (
            ""
          )}
          <div>
            <Grid container direction="row" spacing={2} justify="space-between">
              {(columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY &&
                label.length !== 0) ||
              columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY ? (
                <Grid item xs={6}>
                  <FormControl className={classes.formControl} fullWidth>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Label Font Size"
                      type="number"
                      value={
                        props.column.labelFontSize === undefined
                          ? VisualConstants.visualTableColumn.labelFontSize
                          : props.column.labelFontSize
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">px</InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        handleColumnPropertyChange(
                          "labelFontSize",
                          e.target.value
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
              ) : (
                ""
              )}
              {props.column.isMeasure === true &&
              columnType !== VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART ? (
                <Grid item xs={6}>
                  <FormControl className={classes.formControl} fullWidth>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Cell Width"
                      type="number"
                      value={
                        props.column.width === undefined
                          ? columnType ===
                            VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN
                            ? VisualConstants.mainMeasureCellWidth
                            : VisualConstants.secondaryMeasureCellWidth
                          : props.column.width
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">px</InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        handleColumnPropertyChange(
                          "width",
                          parseInt(e.target.value)
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          </div>
          <div style={{ marginTop: "8px" }}>
            <FormControl className={classes.formControl} fullWidth>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={2}>
                  <Typography variant="body1">Text Align</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant={
                      textAlign !== undefined && textAlign === "left"
                        ? "contained"
                        : "text"
                    }
                    onClick={() => {
                      handleColumnPropertyChange("textAlign", "left");
                    }}
                    startIcon={<BsTextLeft />}
                  ></Button>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant={
                      textAlign === undefined || textAlign === "center"
                        ? "contained"
                        : "text"
                    }
                    onClick={() => {
                      handleColumnPropertyChange("textAlign", "center");
                    }}
                    startIcon={<BsTextCenter />}
                  ></Button>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant={
                      textAlign !== undefined && textAlign === "right"
                        ? "contained"
                        : "text"
                    }
                    onClick={() => {
                      handleColumnPropertyChange("textAlign", "right");
                    }}
                    endIcon={<BsTextRight />}
                  ></Button>
                </Grid>
              </Grid>
            </FormControl>
          </div>
          <div style={{ marginTop: "8px" }}>
            <FormControl className={classes.formControl} fullWidth>
              <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item xs={2}>
                  <Typography variant="body1">Padding (px)</Typography>
                </Grid>
                <Grid container item spacing={2} xs={8}>
                  <Grid item xs={2}>
                    <TextField
                      margin="dense"
                      size="small"
                      label="Left"
                      type="number"
                      value={padding?.left || 0}
                      onChange={(e) => {
                        handlePaddingChange(
                          "left",
                          parseInt(e.target.value) || 0
                        );
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      margin="dense"
                      size="small"
                      label="Top"
                      type="number"
                      value={padding?.top || 0}
                      onChange={(e) => {
                        handlePaddingChange(
                          "top",
                          parseInt(e.target.value) || 0
                        );
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      margin="dense"
                      size="small"
                      label="Right"
                      type="number"
                      value={padding?.right || 0}
                      onChange={(e) => {
                        handlePaddingChange(
                          "right",
                          parseInt(e.target.value) || 0
                        );
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      margin="dense"
                      size="small"
                      label="Bottom"
                      type="number"
                      value={padding?.bottom || 0}
                      onChange={(e) => {
                        handlePaddingChange(
                          "bottom",
                          parseInt(e.target.value) || 0
                        );
                      }}
                    ></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </FormControl>
          </div>
          <div style={{ marginTop: "8px" }}>
            <Paper variant="outlined">
              <FormControl className={classes.formControl} fullWidth>
                <Typography variant="body1">Border</Typography>
                <Grid container direction="row">
                  <Grid item xs={6}>
                    <CellBorder
                      border={border?.left}
                      side="left"
                      onBorderUpdate={handleBorderChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CellBorder
                      border={border?.top}
                      side="top"
                      onBorderUpdate={handleBorderChange}
                    />
                  </Grid>
                </Grid>
                <Grid container direction="row">
                  <Grid item xs={6}>
                    <CellBorder
                      border={border?.bottom}
                      side="bottom"
                      onBorderUpdate={handleBorderChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CellBorder
                      border={border?.right}
                      side="right"
                      onBorderUpdate={handleBorderChange}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Paper>
          </div>

          {columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY ? (
            <Grid
              container
              alignItems="baseline"
              spacing={2}
              style={{ marginTop: "8px" }}
            >
              {/* <Grid item>
                <Typography variant="body1" gutterBottom>
                  Sub columns: {columns && columns.length}
                </Typography>
              </Grid> */}
              {level < 3 ? (
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleAddVisualColumn}
                    startIcon={<BsLayoutThreeColumns />}
                  >
                    Add Sub Column
                  </Button>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* 

      <IconButton
        title="Add Column"
        aria-label="add column"
        onClick={handleAddVisualColumn}
      >
        <BsPlusSquare />
      </IconButton> */}
      {columnsAllowed && hasColumns ? (
        <EditTableColumns
          dataColumns={props.dataColumns}
          visualColumns={columns}
          parentType={EDIT_COLUMNS_PARENT_TYPE.COLUMN}
          onVisualColumnsUpdateOfColumn={handleVisualColumnsUpdateOfColumn}
        />
      ) : (
        ""
      )}
    </div>
  );
}
