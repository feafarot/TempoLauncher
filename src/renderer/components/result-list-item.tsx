import React, { memo, ReactNode } from 'react';
import { TextMatch } from 'shared/utils/util-types';
import { makeStyles } from '@material-ui/styles';

type ResultListItemProps = {
  value: string;
  icon?: string;
  matches?: TextMatch[];
};

const useStyles = makeStyles({
  marked: {
    backgroundColor: 'yellow'
  }
});

function highlight(value: string, matches?: TextMatch[], markClass?: string): ReactNode {
  if (!matches || matches.length == 0) {
    return value;
  }

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  for (let i = 0; i < matches.length; i++) {
    const [start, end] = matches[i];
    if (start !== lastIndex) {
      const pre = value.slice(lastIndex, start);
      parts.push(<span>{pre}</span>);
    }

    const highlighted = value.slice(start, end + 1);
    parts.push(<span className={markClass || 'marked'}>{highlighted}</span>);
    lastIndex = end + 1;
  }

  if (lastIndex < value.length) {
    const finalPart = value.slice(lastIndex);
    parts.push(<span>{finalPart}</span>);
  }

  return parts;
}

export const ResultListItem: React.FC<ResultListItemProps> = memo(({ value, icon, matches }) => {
  const { marked } = useStyles();
  const highlightedValue = highlight(value, matches, marked);
  return <div>
    <img src={`data:image/png;base64,${icon}`} />
    <span>{highlightedValue}</span>
  </div>;
});
