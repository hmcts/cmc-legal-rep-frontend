import * as express from 'express'

export function removeLegalPrefixMiddleware (req: express.Request, res: express.Response, next: express.NextFunction) {
  const oldLegalPrefix = '/legal'
  if (req.path.startsWith(oldLegalPrefix)) {
    return res.redirect(req.path.substring(oldLegalPrefix.length, req.path.length))
  }

  next()
}
