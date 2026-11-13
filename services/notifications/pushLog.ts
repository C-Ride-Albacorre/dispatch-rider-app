/**
 * Debug logging for the push notification pipeline.
 * Every line is prefixed with [push] so it can be filtered in Metro / logcat.
 */
export function pushLog(step: string, payload?: unknown) {
  if (payload === undefined) {
    console.log(`[push] ${step}`);
    return;
  }

  console.log(
    `[push] ${step}`,
    typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
  );
}

/** Logs an error, including axios response status/body when present. */
export function pushError(step: string, error: unknown) {
  const err = error as any;

  console.warn(`[push] ${step} FAILED`, {
    message: err?.message ?? String(error),
    code: err?.code,
    status: err?.response?.status,
    responseData: err?.response?.data,
  });
}
