/**
 * Thanks to @dm-p for the code
 * https://github.com/dm-p/powerbi-visuals-smlc/blob/master/src/debug/Debugger.ts
 */
import { VisualConstants } from "./../VisualConstants";

export default class Debugger {
  static enabled: boolean = VisualConstants.debug;

  public static CLEAR() {
    if (this.enabled) {
      console.clear();
    }
  }

  public static START(heading: string) {
    if (this.enabled) {
      console.log(
        `\n********~~~~~~~~~********${heading}********~~~~~~~~~********\n`
      );
    }
  }

  public static END() {
    if (this.enabled) {
      console.log(`\n********~~~~~~~~~********END********~~~~~~~~~********\n`);
    }
  }

  public static LOG(...args: any[]) {
    if (this.enabled) {
      console.log("\t", ...args);
    }
  }
}
