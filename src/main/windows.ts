import { BrowserWindow } from 'electron';

type WindowOrNull = BrowserWindow | null;

export type WindowsList = {
  main: WindowOrNull
};

export type WindowsName = keyof WindowsList;

export const windows: WindowsList = {
  main: null
};
