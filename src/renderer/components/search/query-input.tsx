import React, { useState, memo } from 'react';
import { InputBase } from '@material-ui/core';

export enum QueryInputActionType {
  QueryChange,
  SelectMode
}

export interface QueryInputActionInfo {
  type: QueryInputActionType;
  query: string;
}

type QueryInputProps = {
  onChange: (actionInfo: QueryInputActionInfo) => void;
  query?: string;
};

export const QueryInput: React.FC<QueryInputProps> = memo(({ onChange, query }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputQuery = (e.target as HTMLInputElement).value;
    if (e.keyCode === 9) { // Tab
      onChange({ type: QueryInputActionType.SelectMode, query: inputQuery });
      e.preventDefault();
    }

    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ type: QueryInputActionType.QueryChange, query: e.target.value });
  };

  return <InputBase
    inputProps={{ 'aria-label': 'naked' }}
    autoFocus
    onKeyDown={handleKeyDown}
    onKeyPress={handleKeyPress}
    onChange={handleChange}
    value={query || ''} />;
});
