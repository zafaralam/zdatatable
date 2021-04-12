import * as React from "react";

import {
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  ButtonGroup,
  Paper,
} from "@material-ui/core";
import { IConditionalFormattingRule } from "./../../defs/main";
import { GtConditionOptions, LtConditionOptions } from "./../../defs/enums";
import ColorPicker from "./ColorPicker";
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
import Debugger from "../../debug/Debugger";
import { VisualConstants } from "../../VisualConstants";
import { MOVE_DIRECTION } from "../../defs/enums";

interface ICFRulesProps {
  rules: IConditionalFormattingRule[];
  measureQueryName: string;
  onRulesUpdate: Function;
}

// export default function CFRules(props: ICFRulesProps) {
const CFRules = (props: ICFRulesProps) => {
  const { rules, onRulesUpdate } = props;

  const handleAddRule = () => {
    const rule: IConditionalFormattingRule = {
      color: VisualConstants.defaultTextColor,
      gtOption: GtConditionOptions.GtEq,
      ltOption: LtConditionOptions.Lt,
      gtValue: null,
      ltValue: null,
    };

    const _rules = rules ? rules.slice(0, rules.length + 1) : [];

    onRulesUpdate(_rules.concat([rule]));
  };
  const handleRemoveRule = (index: number) => {
    if (rules.length === 1) {
      onRulesUpdate([]);
    }
    const _rules = rules.slice(0, rules.length + 1);
    _rules.splice(index, 1);

    onRulesUpdate(_rules);
  };

  const handleRulePropertyChange = (
    index: number,
    property: string,
    value: any
  ) => {
    const _rules = rules.slice(0, rules.length + 1);
    _rules[index][property] = value;

    onRulesUpdate(_rules);
  };

  const handleRuleUpdate = (index, rule: IConditionalFormattingRule) => {
    const _rules = rules.slice(0, rules.length + 1);
    _rules[index] = rule;

    onRulesUpdate(_rules);
  };

  const handleRuleMove = (direction: MOVE_DIRECTION, ruleIndex: number) => {
    if (
      (direction === MOVE_DIRECTION.UP && ruleIndex === 0) ||
      (direction === MOVE_DIRECTION.DOWN && ruleIndex === rules.length - 1)
    ) {
      return;
    }

    const toIndex =
      direction === MOVE_DIRECTION.UP ? ruleIndex - 1 : ruleIndex + 1;

    let _rules = rules.slice(0, rules.length + 1);
    const element = _rules[ruleIndex];
    _rules.splice(ruleIndex, 1);
    _rules.splice(toIndex, 0, element);

    onRulesUpdate(_rules);
  };

  const _displayMessage =
    props.measureQueryName && props.measureQueryName.length !== 0
      ? "No rules created. Start by clicking the 'Add Rule' button."
      : "A measure is not been selected. Please select a measure in the 'Basic' tab before setting up conditional formatting.";

  return (
    <div>
      {rules && rules.length !== 0 ? (
        rules.map((rule, idx) => {
          return (
            <CFRule
              key={`cfRule_${idx}`}
              rule={rule}
              index={idx}
              onRuleUpdate={handleRuleUpdate}
              onRulePropertyUpdate={handleRulePropertyChange}
              onRuleRemove={handleRemoveRule}
              onRuleMove={handleRuleMove}
            />
          );
        })
      ) : (
        <Typography>{_displayMessage}</Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddRule}
        style={{ marginTop: "2rem" }}
      >
        Add Rule
      </Button>
    </div>
  );
};

interface ICFRuleProps {
  rule: IConditionalFormattingRule;
  index: number;
  onRuleUpdate: Function;
  onRulePropertyUpdate: Function;
  onRuleRemove: Function;
  onRuleMove(MOVE_DIRECTION, number): void;
}

function CFRule(props: ICFRuleProps) {
  const {
    rule,
    index,
    onRuleUpdate,
    onRulePropertyUpdate,
    onRuleRemove,
    onRuleMove,
  } = props;
  const hideLtOptions = !(
    rule.gtOption === GtConditionOptions.Gt ||
    rule.gtOption === GtConditionOptions.GtEq
  );
  const hideGtValueInput = rule.gtOption === GtConditionOptions.Blank;

  const handleLtOptionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as LtConditionOptions;
    onRulePropertyUpdate(index, "ltOption", _valueToSet);
  };

  const handleGtOptionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const _valueToSet = event.target.value as GtConditionOptions;
    let _rule: IConditionalFormattingRule = JSON.parse(JSON.stringify(rule));

    if (
      _valueToSet === GtConditionOptions.Is ||
      _valueToSet === GtConditionOptions.Blank
    ) {
      _rule.ltValue = null;
      _rule.ltOption = null;

      if (_valueToSet === GtConditionOptions.Blank) {
        _rule.gtValue = null;
      }
    } else {
      _rule.ltOption = LtConditionOptions.Lt;
    }

    _rule.gtOption = _valueToSet;

    Debugger.LOG(_rule);

    onRuleUpdate(index, _rule);
  };

  const handleRuleMove = (direction: MOVE_DIRECTION) => {
    onRuleMove(direction, index);
  };

  return (
    <Paper
      variant="outlined"
      style={{ padding: "6px 4px", marginBottom: "2px" }}
    >
      <Grid container direction="row" alignItems="center">
        <Grid
          container
          item
          xs={11}
          spacing={1}
          direction="row"
          alignItems="center"
        >
          <Grid container direction="row" item xs={1}>
            <span>If Value</span>
          </Grid>
          <Grid item xs={2}>
            <Select
              value={rule.gtOption}
              fullWidth
              onChange={handleGtOptionChange}
            >
              <MenuItem value={GtConditionOptions.Gt}>is greater than</MenuItem>
              <MenuItem value={GtConditionOptions.GtEq}>
                is greater than or equal To
              </MenuItem>
              <MenuItem value={GtConditionOptions.Is}>is</MenuItem>
              <MenuItem value={GtConditionOptions.Blank}>is blank</MenuItem>
            </Select>
          </Grid>
          {!hideGtValueInput ? (
            <Grid item xs={1}>
              <TextField
                size="small"
                placeholder="Minimum"
                type="number"
                fullWidth
                value={rule.gtValue}
                onChange={(e) => {
                  onRulePropertyUpdate(index, "gtValue", e.target.value);
                }}
              />
            </Grid>
          ) : (
            ""
          )}
          {!hideLtOptions ? (
            <Grid item xs={1} style={{ textAlign: "center" }}>
              and
            </Grid>
          ) : (
            ""
          )}
          {!hideLtOptions ? (
            <Grid item xs={2}>
              <Select
                value={rule.ltOption}
                fullWidth
                onChange={handleLtOptionChange}
              >
                <MenuItem value={LtConditionOptions.Lt}>is less than</MenuItem>
                <MenuItem value={LtConditionOptions.LtEq}>
                  is less than or equal To
                </MenuItem>
              </Select>
            </Grid>
          ) : (
            ""
          )}
          {!hideLtOptions ? (
            <Grid item xs={1}>
              <TextField
                size="small"
                placeholder="Maximum"
                type="number"
                fullWidth
                value={rule.ltValue}
                onChange={(e) => {
                  onRulePropertyUpdate(index, "ltValue", e.target.value);
                }}
              />
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={1} style={{ textAlign: "center" }}>
            then
          </Grid>
          <Grid item xs={2}>
            <ColorPicker
              color={rule.color}
              onColorChange={(color) => {
                onRulePropertyUpdate(index, "color", color || "#000");
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              title="Remove Rule"
              size="small"
              style={{ color: "#a50d0d" }}
              onClick={() => {
                onRuleRemove(index);
              }}
            >
              <BsFillTrashFill />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <ButtonGroup
            size="small"
            variant="contained"
            aria-label="move conditional formatting rules controls"
          >
            <IconButton
              title="Move rule above"
              onClick={() => {
                handleRuleMove(MOVE_DIRECTION.UP);
              }}
            >
              <BsArrowUp />
            </IconButton>

            <IconButton
              title="Move rule down"
              onClick={() => {
                handleRuleMove(MOVE_DIRECTION.DOWN);
              }}
            >
              <BsArrowDown />
            </IconButton>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CFRules;
