export const parseError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      error: {
        ...JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
      }
    }
  }

  return {
    error: {
      message: 'unknown error',
      raw: JSON.stringify(error)
    }
  }
}