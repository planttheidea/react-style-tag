import type { ComponentType } from 'react';

export interface Options {
  hasSourceMap: boolean;
  isMinified: boolean;
  isPrefixed: boolean;
}

export interface Props {
  [key: string]: any;

  children: string;
  hasSourceMap?: boolean;
  isMinified?: boolean;
  isPrefixed?: boolean;
}

export const Style: ComponentType<Props>;

export function hashKeys<Keys extends readonly string[]>(
  keys: Keys
): { [Key in Keys[number]]: `scoped__${Key}__${number}` };

export function getGlobalOptions(): Options;

export function setGlobalOptions(options: Partial<Options>): void;
