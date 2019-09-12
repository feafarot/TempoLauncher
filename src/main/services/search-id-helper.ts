const separator = ' :/\\: ';

export const searchIdHelper = {
  buildId: (provider: string, value: string) => {
    return `${provider}${separator}${value}`;
  },
  parseId: (id: string) => {
    const parts = id.split(separator);
    return {
      provider: parts[0],
      value: parts.length > 2 ? parts.slice(1).join(separator) : parts[1]
    };
  }
};
