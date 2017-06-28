const UNPROTECTED_ROUTES = [
  /\/receiver/,
  /\/health/,
  /\/version/,
  /\/analytics/,
  /\/defendant/
]

export default function isUnprotectedPath (path: string) {
  return UNPROTECTED_ROUTES
    .some((route) => route.test(path))
}
