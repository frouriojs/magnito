export const returnSuccess = <T>(val: T): { status: 200; body: T } => ({ status: 200, body: val });

const logErr = (e: unknown): void => {
  if (!(e instanceof Error)) return;

  console.log(new Date(), e.stack);
};

export const returnGetError = (e: unknown): { status: 404 } => {
  logErr(e);

  return { status: 404 };
};

export const returnPostError = (e: unknown): { status: 403; body: Record<string, never> } => {
  logErr(e);

  return { status: 403, body: {} };
};
