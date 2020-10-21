export interface BaseParameters {
  reference?: string,
  dateCreated?: string,
  status?: string,
  errorCode?: string,
  errorMessage?: string
  status_histories?: []
}

export interface StatusHistories {
  status?: string,
  error_code?: string,
  error_message?: string,
  date_created?: string,
  date_updated?: string
}
