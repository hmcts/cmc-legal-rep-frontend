const pathParameterRegex = /\/:[^\/]+/g

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

  evaluateUri (substitutions: { [key: string]: string }): string {
    if (substitutions === undefined || Object.keys(substitutions).length === 0) {
      throw new Error('Path parameter substitutions are required')
    }

    const path = Object.entries(substitutions).reduce((uri: string, substitution: [string, string]) => {
      const [parameterName, parameterValue] = substitution

      const updatedUri: string = uri.replace(`:${parameterName}`, parameterValue)
      if (updatedUri === uri) {
        throw new Error(`Path parameter :${parameterName} is not defined`)
      }
      return updatedUri
    }, this.uri)

    const missingParameters = path.match(pathParameterRegex)
    if (missingParameters) {
      const removeLeadingSlash = value => value.substring(1)
      throw new Error(`Path parameter substitutions for ${missingParameters.map(removeLeadingSlash).join(', ')} are missing`)
    }

    return path
  }
}
