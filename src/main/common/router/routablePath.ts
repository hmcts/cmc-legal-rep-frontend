export class RoutablePath {
  constructor (public uri: string, public feature: boolean = true) {
    if (!uri || uri.trim() === '') {
      throw new Error('URI is missing')
    }
  }

  get associatedView (): string {
    if (!this.feature) {
      return this.uri
        .replace(/\/:[^\/]+/g, '') // remove path params
        .substring(1) // remove leading slash
    }

    const split: string[] = this.uri
      .replace(/\/:[^\/]+/g, '') // remove path params
      .substring(1) // remove leading slash
      .split('/')

    // we are escaping legal path of split[0]

    const featureName: string = split[1]
    const viewPath: string = split.slice(2).join('/')
    return `${featureName}/views/${viewPath}`
  }
}
