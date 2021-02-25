import powerbi from "powerbi-visuals-api";
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

export default class DataViewHelper {
  /**
   * Gets property value for a particular metadata column.
   *
   * @param column        Desired column to retrieve objects from
   * @param objectName    Name of desired object.
   * @param propertyName  Name of desired property.
   * @param defaultValue  Default value of desired property.
   */
  static GET_METADATA_OBJECT_VALUE<T>(
    column: DataViewMetadataColumn,
    objectName: string,
    propertyName: string,
    defaultValue: T
  ): T {
    let objects = column.objects;
    if (objects) {
      let object = objects[objectName];
      if (object) {
        let property: T = <T>object[propertyName];
        if (property !== undefined) {
          return property;
        }
      }
    }
    return defaultValue;
  }
}
