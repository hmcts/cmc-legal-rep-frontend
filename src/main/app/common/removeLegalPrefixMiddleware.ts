import * as express from 'express'

export function removeLegalPrefixMiddleware (req: express.Request, res: express.Response, next: express.NextFunction) {
  const oldLegalPrefix = '/legal'
  if (req.path.startsWith(oldLegalPrefix)) {
    return res.redirect(req.url.substring(oldLegalPrefix.length, req.url.length))
  }

  next()
}
