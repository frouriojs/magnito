export type Methods = {
  post: {
    reqBody: { id: string }
    resBody: { status: 'success' }
  }
  delete: {
    resBody: { status: 'success' }
  }
}
