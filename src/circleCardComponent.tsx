import * as React from "react";

export interface State {
  size: number;
  borderWidth?: number;
  background?: string;
  textLabel: string;
  textValue: string;
}

export const initialState: State = {
  textLabel: "",
  textValue: "",
  size: 200,
};

export class CircleCard extends React.Component<{}, State> {
  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof CircleCard.updateCallback === "function") {
      CircleCard.updateCallback(newState);
    }
  }

  public state: State = initialState;

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  public componentDidMount() {
    CircleCard.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    CircleCard.updateCallback = null;
  }
  render() {
    const { textLabel, textValue, size, background, borderWidth } = this.state;
    const style: React.CSSProperties = {
      width: size,
      height: size,
      background,
      borderWidth,
    };
    return (
      <div className="circleCard" style={style}>
        <p>
          {textLabel} <br /> <em>{textValue}</em>
        </p>
      </div>
    );
  }
}

export default CircleCard;
