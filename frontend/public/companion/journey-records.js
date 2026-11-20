export function completedRecords(saved) {
  if (!Array.isArray(saved)) return [];
  return saved.filter(item => item && ['practice','live'].includes(item.mode) &&
    Number.isSafeInteger(item.completedAt) && item.completedAt > 0 &&
    item.tawaf === 7 && item.sai === 7);
}

export function archiveCompleted(state, mode) {
  const run = state[mode];
  if (!run.done || run.tawaf !== 7 || run.sai !== 7) return;
  if (!run.completedAt) run.completedAt = Date.now();
  if (state.history.some(item => item.mode === mode && item.completedAt === run.completedAt)) return;
  state.history.push({ mode, completedAt:run.completedAt, tawaf:run.tawaf, sai:run.sai });
}
