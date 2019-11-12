import React, { useState, memo, useCallback } from 'react';
import { InputBase } from '@material-ui/core';

export enum QueryInputActionType {
  QueryChange,
  ClearPlugin
}

export interface QueryInputActionInfo {
  type: QueryInputActionType;
  query: string;
}

type QueryInputProps = {
  onChange: (actionInfo: QueryInputActionInfo) => void;
  query?: string;
  className?: string;
};

export const QueryInput: React.FC<QueryInputProps> = memo(({ onChange, query, className }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const inputQuery = (e.target as HTMLInputElement).value;
      if (e.keyCode === 8 && inputQuery == '') {
        onChange({ type: QueryInputActionType.ClearPlugin, query: '' });
        e.preventDefault();
      }

      if (e.keyCode === 9 // Tab
        || e.keyCode === 38 // Arrow Up
        || e.keyCode === 40) { // Arrow Down
        e.preventDefault();
      }
    },
    [onChange]);
  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const inputQuery = (e.target as HTMLInputElement).value;
      (e.target as HTMLInputElement).setSelectionRange(0, inputQuery.length);
    },
    [onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ type: QueryInputActionType.QueryChange, query: e.target.value });
  };

  return <InputBase
    className={className}
    inputProps={{ 'aria-label': 'naked' }}
    autoFocus
    onFocus={handleFocus}
    onKeyDown={handleKeyDown}
    onKeyPress={handleKeyPress}
    onChange={handleChange}
    value={query || ''} />;
});
