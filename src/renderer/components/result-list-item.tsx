import React, { memo, ReactNode, useRef, useEffect, useMemo } from 'react';
import { TextMatch } from 'shared/utils/util-types';
import { makeStyles } from '@material-ui/styles';
import { Tooltip, ListItemText, ListItemIcon, ListItem } from '@material-ui/core';
import { uiConfig } from 'shared/ui-config';
import { AppImage, ImageFormat } from './image';

const useStyles = makeStyles({
  root: {
    maxHeight: uiConfig.itemHeight,
    height: uiConfig.itemHeight
  },
  secondary: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  marked: {
    //backgroundColor: 'yellow',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  icon: {
    width: 32
  }
});

function markMatches(value: string, matches?: TextMatch[], markClass?: string): ReactNode {
  if (!matches || matches.length == 0) {
    return value;
  }

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  for (let i = 0; i < matches.length; i++) {
    const [start, end] = matches[i];
    if (start !== lastIndex) {
      const pre = value.slice(lastIndex, start);
      parts.push(<span key={key++}>{pre}</span>);
    }

    const highlighted = value.slice(start, end + 1);
    parts.push(<span className={markClass || 'marked'} key={key++}>{highlighted}</span>);
    lastIndex = end + 1;
  }

  if (lastIndex < value.length) {
    const finalPart = value.slice(lastIndex);
    parts.push(<span key={key++}>{finalPart}</span>);
  }

  return parts;
}

type ResultListItemProps = {
  selected?: boolean;
  value: string;
  icon?: string;
  helperText?: string;
  matches?: TextMatch[];
  onClick?: () => void;
};

export const ResultListItem: React.FC<ResultListItemProps> = memo(({ value, icon, helperText, matches, onClick, selected }) => {
  const classes = useStyles();
  const rootDiv = useRef<HTMLDivElement>(null);
  useEffect(
    () => {
      if (selected && rootDiv.current) {
        rootDiv.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    },
    [selected, value]);
  const markedValue = useMemo(() => markMatches(value, matches, classes.marked), [value, matches, classes.marked]);
  return <ListItem className={classes.root} selected={selected} ref={rootDiv} ContainerProps={{ onClick }} button>
    <ListItemIcon>
      <AppImage src={icon} format={ImageFormat.Base64} />
    </ListItemIcon>
    <ListItemText
      primary={<span className={''}>{markedValue}</span>}
      secondary={<span title={helperText}>{helperText}</span>}
      secondaryTypographyProps={{ className: classes.secondary }} />
  </ListItem>;
});
