interface ViewError {
  statusCode: number
}

export class NotFoundError extends Error implements ViewError {
  statusCode: number = 404

  constructor (page: string) {
    super(`Page ${page} does not exist`)
  }
}
