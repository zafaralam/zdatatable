import * as React from "react";
import {
  EDIT_COLUMNS_PARENT_TYPE,
  VISUAL_DISPLAY_COLUMN_TYPE,
  MOVE_DIRECTION,
} from "../../defs/enums";
import {
  IColumnPadding,
  IConditionalFormattingRule,
  IDataColumn,
  IVisualTableColumn,
} from "../../defs/main";
import EditTableColumns from "./EditTableColumns";
import ColorPicker from "./ColorPicker";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  // DialogContentText,
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
  // FormLabel,
  Paper,
  ButtonGroup,
  Tabs,
  Tab,
} from "@material-ui/core";

import CellBorder from "./CellBorder";
import TabPanel from "./TabPanel";
import CFRules from "./CFRules";
import {
  BsFillTrashFill,
  //   BsPlusSquare,
  BsPencil,
  BsLayoutThreeColumns,
  BsTextLeft,
  BsTextCenter,
  BsTextRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// import { formatPrefix } from "d3";
import {
  VisualConstants,
  FontFamilies,
  FontWeights,
} from "./../../VisualConstants";
// import { IconType } from "react-icons";
// import { lab } from "d3";

interface IEditTableColumnProps {
  column: IVisualTableColumn;
  index: number;
  dataColumns: IDataColumn[];
  onVisualColumnUpdate: Function;
  onVisualColumnRemoval: Function;
  onColumnMove: Function;
}

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

//tslint:disable:max-func-body-length
const EditTableColumn = (props: IEditTableColumnProps) => {
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
    labelFontFamily,
    labelFontSize,
    labelFontWeight,
    applyConditionalFormatting,
    conditionalFormattingRules,
  } = props.column;
  const hasColumns = columns && columns.length !== 0,
    columnsAllowed = columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY,
    dataColumnSet = queryName && queryName.length !== 0;
  const [dialog, setDialog] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };
  const handleDialogOpen = () => {
    setDialog(true);
  };
  const handleDialogClose = () => {
    setDialog(false);
    setTabValue(0); // reset the tab to the basic one
  };
  const handleAddVisualColumn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    let column: IVisualTableColumn = JSON.parse(JSON.stringify(props.column));
    column.columns.push({
      ...VisualConstants.visualTableColumn,
      labelFontSize: 8, // * So that sub-columns automatically get a smaller font size.
      bgColor: VisualConstants.subColumnBgColor,
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
    let _padding = {
      ...(padding || VisualConstants.visualTableColumn.padding),
    };
    if (side === "all") {
      _padding = {
        left: value,
        top: value,
        right: value,
        bottom: value,
      };
    } else {
      _padding[side] = value;
    }

    handleColumnPropertyChange("padding", _padding);
  };

  const handleBorderChange = (side: string, value: string) => {
    let _border = {
      ...(border || VisualConstants.visualTableColumn.border),
    };
    if (side === "all") {
      _border = {
        left: value,
        top: value,
        right: value,
        bottom: value,
      };
    } else {
      _border[side] = value;
    }
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
      _column["applyConditionalFormatting"] = false;
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

  const handleLabelFontFamilyChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as string;
    handleColumnPropertyChange("labelFontFamily", _valueToSet);
  };

  const handleLabelFontWeightChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as string;
    handleColumnPropertyChange("labelFontWeight", _valueToSet);
  };

  const handleColumnMove = (direction: MOVE_DIRECTION) => {
    props.onColumnMove(direction, props.index);
  };

  const handleCFRulesUpdate = (rules: IConditionalFormattingRule[]) => {
    if (rules) {
      handleColumnPropertyChange("conditionalFormattingRules", rules);
    }
  };

  const handleColumnMoveLeft = () => {
    handleColumnMove(MOVE_DIRECTION.LEFT);
  };

  const handleColumnMoveRight = () => {
    handleColumnMove(MOVE_DIRECTION.RIGHT);
  };

  const handleVisualColumnRemoval = () => {
    props.onVisualColumnRemoval(props.index);
  };

  const handleEditColumnLabelChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as string;
    handleColumnPropertyChange("label", _valueToSet);
  };

  const handleEditColumnBgColorChange = (color: any) => {
    handleColumnPropertyChange("bgColor", color);
  };

  const handleEditColumnChkBgColorToValuesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleColumnPropertyChange("applyBgColorToValues", event.target.checked);
  };

  const handleEditColumnTextColorChange = (color: any) => {
    handleColumnPropertyChange("textColor", color);
  };

  const handleEditColumnLabelFontSizeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as string;
    handleColumnPropertyChange("labelFontSize", _valueToSet);
  };

  const handleEditColumnWidthChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as string;
    handleColumnPropertyChange("width", parseInt(_valueToSet));
  };

  return (
    <div key={props.index} className="edit-table__column">
      <div>
        <ButtonGroup
          size="small"
          variant="outlined"
          aria-label="small outlined button group"
        >
          <IconButton
            size="small"
            title="Move column to left"
            onClick={handleColumnMoveLeft}
          >
            <BsChevronLeft />
          </IconButton>
          <IconButton
            size="small"
            title="Move column to right"
            onClick={handleColumnMoveRight}
          >
            <BsChevronRight />
          </IconButton>
        </ButtonGroup>
      </div>
      <Grid container alignItems="center" justify="space-around">
        <Grid item>
          <span style={editColumnLabelStyle(label)}>
            {label.length === 0
              ? columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY
                ? "Column"
                : "Measure"
              : label}
          </span>
        </Grid>
      </Grid>
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
        onClick={handleVisualColumnRemoval}
      >
        <BsFillTrashFill />
      </IconButton>

      <Dialog
        open={dialog}
        onClose={handleDialogClose}
        disableBackdropClick
        maxWidth="lg"
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
        <DialogContent style={{ minHeight: "720px" }}>
          <Tabs
            onChange={handleTabChange}
            value={tabValue}
            indicatorColor="primary"
          >
            <Tab label="Basic" />

            <Tab
              label="Conditional Formatting"
              disabled={conditionalFormattingTabDisabled(columnType)}
            />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <div>
              <FormControl className={classes.formControl} fullWidth>
                <TextField
                  autoFocus
                  margin="dense"
                  fullWidth
                  label="Column Name (Label to display)"
                  value={label}
                  onChange={handleEditColumnLabelChange}
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
                        value={
                          VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY
                        }
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
            {columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY && (
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
                      .map((dc, mIdx) => {
                        return (
                          <MenuItem key={mIdx} value={dc.queryName}>
                            {dc.displayName}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </div>
            )}

            <div>
              <FormControl className={classes.formControl} fullWidth>
                <Grid container direction="row" spacing={1} alignItems="center">
                  <Grid item xs={2}>
                    <Typography variant="body1">Background Color</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <ColorPicker
                      color={editColumnBgColor(props)}
                      onColorChange={handleEditColumnBgColorChange}
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
                          checked={editColumnChkBgColorToValues(props)}
                          onChange={handleEditColumnChkBgColorToValuesChange}
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
                  <Grid
                    container
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Grid item xs={2}>
                      <Typography variant="body1">Text Color</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <ColorPicker
                        color={editColumnTextColor(props)}
                        onColorChange={handleEditColumnTextColorChange}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </div>
            ) : (
              ""
            )}
            <div>
              <Grid
                container
                direction="row"
                spacing={1}
                justify="space-between"
              >
                {(columnType !== VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY &&
                  label.length !== 0) ||
                columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY ? (
                  <Grid
                    container
                    direction="row"
                    item
                    xs={10}
                    spacing={1}
                    alignItems="center"
                  >
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl} fullWidth>
                        <InputLabel id="select-measure-label">
                          Label Font Family
                        </InputLabel>
                        <Select
                          labelId="select-measure-label"
                          value={editColumnLabelFontFamily(labelFontFamily)}
                          onChange={handleLabelFontFamilyChange}
                          fullWidth
                        >
                          {FontFamilies.map((dc, mIdx) => {
                            return (
                              <MenuItem key={mIdx} value={dc.value}>
                                {dc.displayName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl} fullWidth>
                        <InputLabel id="select-measure-label">
                          Label Font Weight
                        </InputLabel>
                        <Select
                          labelId="select-measure-label"
                          value={editColumnLabelFontWeight(labelFontWeight)}
                          onChange={handleLabelFontWeightChange}
                          fullWidth
                        >
                          {FontWeights.map((dc, mIdx) => {
                            return (
                              <MenuItem key={mIdx} value={dc.value}>
                                {dc.displayName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl} fullWidth>
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Label Font Size"
                          type="number"
                          value={editColumnLabelFontSize(labelFontSize)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                pt
                              </InputAdornment>
                            ),
                          }}
                          onChange={handleEditColumnLabelFontSizeChange}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
                {props.column.isMeasure === true &&
                columnType !== VISUAL_DISPLAY_COLUMN_TYPE.TREND_CHART ? (
                  <Grid item xs={2}>
                    <FormControl className={classes.formControl} fullWidth>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Cell Width"
                        type="number"
                        value={editColumnWidth(props, columnType)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">px</InputAdornment>
                          ),
                        }}
                        onChange={handleEditColumnWidthChange}
                      />
                    </FormControl>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </div>
            {columnTextAlignment(
              classes,
              textAlign,
              handleColumnPropertyChange
            )}
            <div style={{ marginTop: "8px" }}>
              <FormControl className={classes.formControl} fullWidth>
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid item xs={2}>
                    <Typography variant="body1">Padding (px)</Typography>
                  </Grid>
                  <Grid container item spacing={2} xs={8}>
                    <Grid item xs={2}>
                      {cellPadding(
                        "all",
                        padding?.left !== padding?.bottom &&
                          padding?.left !== padding?.right &&
                          padding?.left !== padding?.top
                          ? null
                          : padding?.left,
                        handlePaddingChange
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      {cellPadding(
                        "left",
                        padding?.left || 0,
                        handlePaddingChange
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      {cellPadding(
                        "top",
                        padding?.top || 0,
                        handlePaddingChange
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      {cellPadding(
                        "right",
                        padding?.right || 0,
                        handlePaddingChange
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      {cellPadding(
                        "bottom",
                        padding?.bottom || 0,
                        handlePaddingChange
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </FormControl>
            </div>
            <div style={{ marginTop: "8px" }}>
              <Paper variant="outlined">
                <FormControl className={classes.formControl} fullWidth>
                  <Grid container direction="row">
                    <Grid item xs={2}>
                      <Typography variant="body1">Border</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <CellBorder
                        border={border?.left}
                        side="all"
                        onBorderUpdate={handleBorderChange}
                      />
                    </Grid>
                  </Grid>
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

            {columnType === VISUAL_DISPLAY_COLUMN_TYPE.DISPLAY_ONLY && (
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
                {level < 3 && (
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={handleAddVisualColumn}
                      startIcon={<BsLayoutThreeColumns />}
                    >
                      Add Sub Column
                    </Button>
                  </Grid>
                )}
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CFRules
              rules={conditionalFormattingRules}
              measureQueryName={queryName}
              onRulesUpdate={handleCFRulesUpdate}
            />
          </TabPanel>
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
};

function editColumnWidth(
  props: IEditTableColumnProps,
  columnType: VISUAL_DISPLAY_COLUMN_TYPE
): unknown {
  return props.column.width === undefined
    ? columnType === VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN
      ? VisualConstants.mainMeasureCellWidth
      : VisualConstants.secondaryMeasureCellWidth
    : props.column.width;
}

function editColumnLabelFontSize(labelFontSize: number): unknown {
  return labelFontSize === undefined
    ? VisualConstants.visualTableColumn.labelFontSize
    : labelFontSize;
}

function editColumnLabelFontWeight(labelFontWeight: string): unknown {
  return labelFontWeight || VisualConstants.visualTableColumn.labelFontWeight;
}

function editColumnLabelFontFamily(labelFontFamily: string): unknown {
  return labelFontFamily || VisualConstants.visualTableColumn.labelFontFamily;
}

function editColumnTextColor(props: IEditTableColumnProps): string {
  return props.column.textColor === undefined
    ? VisualConstants.visualTableColumn.textColor
    : props.column.textColor;
}

function editColumnChkBgColorToValues(props: IEditTableColumnProps): boolean {
  return props.column.applyBgColorToValues === undefined
    ? false
    : props.column.applyBgColorToValues;
}

function editColumnBgColor(props: IEditTableColumnProps): string {
  return props.column.bgColor != undefined
    ? props.column.bgColor
    : VisualConstants.visualTableColumn.bgColor;
}

function conditionalFormattingTabDisabled(
  columnType: VISUAL_DISPLAY_COLUMN_TYPE
): boolean {
  return (
    columnType !== VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_MAIN &&
    columnType !== VISUAL_DISPLAY_COLUMN_TYPE.MEASURE_VALUE_SECONDARY
  );
}

function editColumnLabelStyle(label: string): React.CSSProperties {
  return {
    maxWidth: "180px",
    display: "inline-block",
    fontSize: "0.75rem",
    fontStyle: label.length === 0 ? "italic" : "normal",
  };
}

function cellPadding(
  side: string,
  padding: number,
  handlePaddingChange: (side: string, value: number) => void
) {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const _valueToSet = event.target.value as string;
    handlePaddingChange(side, parseInt(_valueToSet) || 0);
  };
  return (
    <TextField
      margin="dense"
      size="small"
      label={side}
      type="number"
      value={padding}
      onChange={handleChange}
    ></TextField>
  );
}

function columnTextAlignment(
  classes,
  textAlign: string,
  handleColumnPropertyChange: (property: string, value: any) => void
) {
  return (
    <div style={{ marginTop: "8px" }}>
      <FormControl className={classes.formControl} fullWidth>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={2}>
            <Typography variant="body1">Text Align</Typography>
          </Grid>
          <Grid item xs={1}>
            {textAlignmentButton(
              textAlign !== undefined && textAlign === "left"
                ? "contained"
                : "text",
              "left",
              <BsTextLeft />,
              handleColumnPropertyChange
            )}
          </Grid>
          <Grid item xs={1}>
            {textAlignmentButton(
              textAlign === undefined || textAlign === "center"
                ? "contained"
                : "text",
              "center",
              <BsTextCenter />,
              handleColumnPropertyChange
            )}
          </Grid>
          <Grid item xs={1}>
            {textAlignmentButton(
              textAlign !== undefined && textAlign === "right"
                ? "contained"
                : "text",
              "right",
              <BsTextRight />,
              handleColumnPropertyChange
            )}
          </Grid>
        </Grid>
      </FormControl>
    </div>
  );
}

function textAlignmentButton(
  variant: any,
  textAlign: string,
  icon: React.ReactNode,
  handleColumnPropertyChange: (property: string, value: any) => void
) {
  const handleClick = () => {
    handleColumnPropertyChange("textAlign", textAlign);
  };
  return (
    <Button variant={variant} onClick={handleClick} startIcon={icon}></Button>
  );
}

export default EditTableColumn;
