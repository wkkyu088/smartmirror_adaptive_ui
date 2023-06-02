import React, { useState } from 'react'
import { Box, Stack } from '@mui/material/'

import Calendar from 'react-calendar';
import moment from 'moment';

const CalendarWidget: React.FC<{fontScale: number, fontSize: number}> = ({fontScale, fontSize}) => {    
    const [date, setDate] = useState(new Date());

    return (
        <Stack alignItems="center" mx={2} my={1} p={1}>
            <Box sx={{fontSize: `${(fontSize-5)*fontScale}px`, paddingY: '15px', fontFamily: 'PretendardB'}}>{moment(date).format('M 월')}</Box>
            <div>
                <Calendar 
                    className={'react-calendar'}
                    value={date}
                    locale="ko-KO"
                    nextLabel={null}
                    prevLabel={null}
                    next2Label={null}
                    prev2Label={null}
                    formatDay={(locale, date) => moment(date).format('DD')}
                    formatMonth={(locale, date) => moment(date).format('MMM')}
                    showNeighboringMonth={false}
                    showNavigation={false}
                />
                <style>{`
                    .calendar-widget {
                        background: transparent;
                        font-family: 'Pretendard';
                    }

                    .react-calendar__month-view__weekdays {
                        text-align: center;
                        font-weight: bold;
                    }

                    .react-calendar__month-view__weekdays__weekday {
                        text-decoration: none;
                        padding-bottom: 0.5em;
                        font-size: ${(fontSize-12) * fontScale}px;
                        color: lightgrey;
                        font-family: 'Pretendard';
                    }

                    .react-calendar__month-view__weekdays__weekday abbr {
                        text-decoration: none;
                    }

                    .react-calendar__month-view__days__day {
                        color: white;
                    }

                    .react-calendar__month-view__days__day--now {
                        color: purple;
                    }

                    .react-calendar__month-view__days__day--weekend {
                        color: indianred;
                    }

                    .react-calendar__tile {
                        font-size: ${(fontSize-12) * fontScale}px;
                        max-width: 100%;
                        margin: 5px 0;
                        padding: 15px;
                        background: none;
                        text-align: center;
                        border: none;
                        font-family: 'Pretendard';
                    }

                    .react-calendar__tile--now {
                        background: white;
                        border-radius: 10px;
                        color: black;
                        text-deration: underline;
                    }
                `}</style>
            </div>
        </Stack>
    );
};

export default CalendarWidget;