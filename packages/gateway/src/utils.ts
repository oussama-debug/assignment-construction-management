export function buildSessionObject(session: any) {
  return {
    id: session.id,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
  };
}
