import * as React from 'react';
import { useState } from 'react';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';

type ShortcutInputProps = {
  keysSequence?: string[];
  onHotkeySelected?: (keys: string[]) => void;
  textField?: Partial<Omit<TextFieldProps, 'variant' | 'value'>>;
};

export const ShortcutInput: React.FC<ShortcutInputProps> = ({ keysSequence, onHotkeySelected, textField }) => {
  const [sequence, setSequence] = useState<string[]>(keysSequence || []);
  const [keyUps, setKeyUps] = useState(0);
  const [resetNextKeyDown, setResetNextKeyDown] = useState(() => keyUps === 0);

  function fireHotkeySelected(keys: string[]) {
    if (onHotkeySelected) {
      onHotkeySelected(keys);
    }
  }

  return <TextField
    {...textField}
    value={sequence.join('+')}
    InputProps={{ readOnly: true }}
    onKeyDown={e => {
      if (!e.repeat && e.keyCode !== 91) {
        e.persist();
        setSequence(seq => {
          if (resetNextKeyDown) {
            setResetNextKeyDown(false);
            return [e.key];
          }
          return seq.includes(e.key) ? seq : [...seq, e.key];
        });
      }

      e.preventDefault();
      e.stopPropagation();
      return false;
    }}
    onKeyPress={e => {
      e.stopPropagation();
      e.preventDefault();
    }}
    onKeyUp={e => {
      if (sequence.length > 0 && e.keyCode !== 91) {
        const newKeyUps = keyUps + 1;
        if (newKeyUps === sequence.length) {
          setResetNextKeyDown(true);
          setKeyUps(0);
          fireHotkeySelected(sequence);
        }
        else {
          setKeyUps(newKeyUps);
        }
      }

      e.preventDefault();
      e.stopPropagation();
    }}
  />;
};
