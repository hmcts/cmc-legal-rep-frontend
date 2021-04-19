import * as path from 'path'
import { Router } from 'express'
import * as requireDirectory from 'require-directory'

const fileExtension: string = path.extname(__filename).slice(1)

const options: object = {
  extensions: [fileExtension],
  recurse: true,
  visit: (obj: any) => {
    return (typeof obj === 'object' && obj.default !== undefined) ? obj.default : obj
  }
}

export class RouterFinder {

  static findAll (url: string): Router[] {
    return Object.values(requireDirectory(module, url, options))
  }

}
