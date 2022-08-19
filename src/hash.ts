let counter = 0;

/**
 * Simple bitwise hash of string value.
 */
export function hash<Key extends string>(
  key: Key
): `scoped__${Key}__${number}` {
  const stringToHash = `${key}-${counter++}`;

  let hashValue = 5381;
  let index = stringToHash.length;

  while (index) {
    hashValue = (hashValue * 33) ^ stringToHash.charCodeAt(--index);
  }

  return `scoped__${key}__${hashValue >>> 0}`;
}

/**
 * Create a hash map based on the keys passed.
 */
export function hashKeys<Keys extends readonly string[]>(
  keys: Keys
): { [Key in Keys[number]]: `scoped__${Key}__${number}` } {
  return keys.reduce((hashMap, key: Keys[number]) => {
    hashMap[key] = hash(key);

    return hashMap;
  }, {} as { [Key in Keys[number]]: `scoped__${Key}__${number}` });
}
