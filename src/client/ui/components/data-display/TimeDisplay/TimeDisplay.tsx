import React from 'react';
import { TimeService } from '../../../../data/services/TimeService';
import { TimeDisplayStyled } from './TimeDisplay.styled';

interface TimeDisplayProps {
    time: number;
}

const TimeDisplay = (props: TimeDisplayProps) => {
    return (
        <TimeDisplayStyled>
            {TimeService.formatTime(props.time)}
        </TimeDisplayStyled>
    );
};

export default TimeDisplay;
