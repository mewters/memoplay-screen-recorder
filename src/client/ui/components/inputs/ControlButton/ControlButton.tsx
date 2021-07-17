import React from 'react';
import { ButtonProps, IconButton, Tooltip } from '@material-ui/core';
import { ControlButtonStyled } from './ControlButton.style';

export interface ControlButtonProps extends ButtonProps {
    title?: string;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
    title,
    startIcon,
    ...props
}) => {
    if (title) {
        return (
            <Tooltip title={title}>
                <IconButton {...props} size={'large'} color={'inherit'}>
                    {startIcon}
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <ControlButtonStyled startIcon={startIcon} {...props} size={'large'} />
    );
};
