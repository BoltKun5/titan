export function getLocalId(baseId: string) {
  if (/^\d+$/.test(baseId) && baseId.length < 3) {
    if (baseId.length === 1) return '00' + baseId;
    if (baseId.length === 2) return '0' + baseId;
  }
  return baseId;
}
