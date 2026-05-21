// src/utils/iplData.js
// Stub — the 407MB ipl_dataset.json is no longer imported.
// All runtime data comes from services/iplData.js (61KB mock) and data/ipl_summary.json (<500KB).

import { getAllPlayers } from '../services/iplData';

/**
 * @deprecated Legacy accessor for the raw CSV-to-JSON dataset.
 * Returns the lightweight player array from services/iplData.js instead.
 * @returns {Promise<Array>}
 */
export const getIPLDataset = async () => {
  return getAllPlayers();
};
