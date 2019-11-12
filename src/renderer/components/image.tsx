import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  img: (props: { size?: number }) => ({
    width: props.size || 32
  })
});

export enum ImageFormat {
  Base64,
  url
}

type ImageProps = {
  src?: string;
  format?: ImageFormat;
  type?: string;
  className?: string;
  size?: number;
};

export const AppImage: React.FC<ImageProps> = (props) => {
  const classes = useStyles({ size: props.size });
  if (!props.src) {
    return null;
  }

  let src = '';
  switch (props.format) {
    case ImageFormat.Base64:
      src = `data:image/${props.type};base64,${props.src}`;
      break;
    case ImageFormat.url:
      src = props.src;
      break;
  }

  return <img className={`${classes.img} ${props.className}`} src={src} />;
};

AppImage.defaultProps = {
  format: ImageFormat.Base64,
  type: 'png',
  size: 32
};
