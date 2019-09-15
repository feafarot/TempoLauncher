import React, { memo, ReactNode, useRef, useEffect, useMemo } from 'react';
import { TextMatch } from 'shared/utils/util-types';
import { makeStyles } from '@material-ui/styles';
import { Tooltip, ListItemText, ListItemIcon, ListItem } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    // maxHeight: itemHeight,
    // height: itemHeight
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
      <img src={`data:image/png;base64,${icon}`} />
    </ListItemIcon>
    <ListItemText
      primary={<span className={''}>{markedValue}</span>}
      secondary={<Tooltip title={helperText} placement='top'>
        <span>{helperText}</span>
      </Tooltip>}
      secondaryTypographyProps={{ className: classes.secondary }} />
  </ListItem>;
  // return <div className={classes.root} onClick={onClick}>
  //   <div className={classes.img}>
  //     <img src={`data:image/png;base64,${icon}`} />
  //   </div>
  //   <div className={classes.textContainer}>
  //     <span className={classes.mainText}>{markedValue}</span>
  //     {value
  //       && <Tooltip title={helperText} placement='top'>
  //         <span className={classes.helper}>{helperText}</span>
  //       </Tooltip>}
  //   </div>
  // </div>;
});
