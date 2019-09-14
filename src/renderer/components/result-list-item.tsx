import React, { memo, ReactNode } from 'react';
import { TextMatch } from 'shared/utils/util-types';
import { makeStyles } from '@material-ui/styles';
import { fontSize } from '@material-ui/system';

const itemHeight = 50;
const useStyles = makeStyles({
  marked: {
    //backgroundColor: 'yellow',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  root: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'flex-start',
    placeContent: 'flex-start',
    maxHeight: itemHeight,
    height: itemHeight
  },
  mainText: {
    //flex: '3'
  },
  helper: {
    flex: `1`,
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: ''
  },
  img: {
    flex: `4 ${itemHeight}px`,
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    marginRight: 10
    // 'img': {
    //   margin: 'auto'
    // }
  },
  textContainer: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    justifyItems: 'center',
    maxHeight: itemHeight,
    height: itemHeight
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
  value: string;
  icon?: string;
  helperText?: string;
  matches?: TextMatch[];
};

export const ResultListItem: React.FC<ResultListItemProps> = memo(({ value, icon, helperText, matches }) => {
  const classes = useStyles();
  const markedValue = markMatches(value, matches, classes.marked);
  return <div className={classes.root}>
    <div className={classes.img}>
      <img src={`data:image/png;base64,${icon}`} />
    </div>
    <div className={classes.textContainer}>
      <span className={classes.mainText}>{markedValue}</span>
      {value && value.length > 13
        && <span className={classes.helper}>{helperText}</span>}
    </div>
  </div>;
});
