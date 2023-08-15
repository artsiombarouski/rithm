import { Button, IButtonProps, Icon } from 'native-base';
import React from 'react';

export type ElementButtonProps = IButtonProps & {
  icon?: React.ComponentType<any>;
  iconColor?: string;
  title?: string;
};

export const ElementButton = (props: ElementButtonProps) => {
  const { icon, iconColor, title, ...restProps } = props;

  return (
    <Button
      flex={1}
      startIcon={
        icon && (
          <Icon>
            {React.createElement(icon, {
              style: {
                color: iconColor ?? 'white',
              },
            })}
          </Icon>
        )
      }
      {...restProps}
    >
      {title ?? ''}
    </Button>
  );
};
