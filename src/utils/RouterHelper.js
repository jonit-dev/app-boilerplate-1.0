const isAllowedKey = (requestBody, allowedUpdatesKeys) => {
  const updates = Object.keys(requestBody);

  return updates.every(update => allowedUpdatesKeys.includes(update));
};

module.exports = {
  isAllowedKey
};
