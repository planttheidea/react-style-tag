let counter = 0;

/**
 * simple bitwise hash of string value
 */
export function hash<Key extends string>(
  key: Key
): `scoped__${Key}__${string}` {
  const stringToHash = `${key}-${counter++}`;

  let hashValue = 5381;
  let index = stringToHash.length;

  while (index) {
    hashValue = (hashValue * 33) ^ stringToHash.charCodeAt(--index);
  }

  return `scoped__${key}__${hashValue >>> 0}`;
}

/**
 * create a hash map based on the keys passed
 */
export function hashKeys(keys: string[]): Record<string, string> {
  return keys.reduce((hashMap, key) => {
    hashMap[key] = hash(key);

    return hashMap;
  }, {});
}
