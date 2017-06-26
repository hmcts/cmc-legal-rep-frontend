import * as express from 'express'

export function buildURL (req: express.Request, path: string, forceSSL: boolean = false): string {
  const protocol = (forceSSL || req.secure) ? 'https://' : 'http://'
  const host = req.headers.host

  return `${protocol}${host}/${path}`
}
