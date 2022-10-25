export type AuthConfig = {
  userVerifyExpire: string,
  access: {
    key: string,
    expire: string,
  },
  refresh: {
    key: string,
    expire: string,
  },
}

export type AuthHeaders = {
  fingerprint: string,
  userAgent: string,
  ip: string,
}
