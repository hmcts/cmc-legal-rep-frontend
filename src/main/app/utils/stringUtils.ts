export default class StringUtils {

  static isBlank (value: string): boolean {
    return !(value && value.length > 0)
  }

  static toUpperCase (value: any): string {
    return value ? value.toUpperCase() : value
  }

}
