export const GET = (api: { $path: () => string }): string => `GET: ${api.$path()}`;
export const POST = (api: { $path: () => string }): string => `POST: ${api.$path()}`;
export const PATCH = (api: { $path: () => string }): string => `PATCH: ${api.$path()}`;
export const DELETE = (api: { $path: () => string }): string => `DELETE: ${api.$path()}`;
