import React, { useState } from 'react';
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

export const QueryInput: React.FC<QueryInputProps> = ({ onChange, query }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputQuery = (e.target as HTMLInputElement).value;
    if (e.keyCode === 9) { // Tab
      onChange({ type: QueryInputActionType.SelectMode, query: inputQuery });
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ type: QueryInputActionType.QueryChange, query: e.target.value });
  };

  return <InputBase
    inputProps={{ 'aria-label': 'naked' }}
    autoFocus
    onKeyDown={(e) => {
      if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
      }
    }}
    onKeyPress={handleKeyPress}
    onChange={handleChange}
    value={query || ''} />;
};
