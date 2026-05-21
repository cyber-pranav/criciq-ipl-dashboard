// src/utils/iplData.js
// Database utility file exporting the complete parsed IPL CSV dataset dynamically to prevent main bundle bloating.

export const getIPLDataset = async () => {
  const module = await import('../data/ipl_dataset.json');
  return module.default;
};

