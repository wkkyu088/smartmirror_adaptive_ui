import React, { useState, useEffect } from 'react';
import { styled, Box, Stack, Grid, IconButton } from '@mui/material/'
import CalendarIcon from '@mui/icons-material/TodayRounded';
import WeatherIcon from '@mui/icons-material/WbSunnyRounded';

import CalendarWidget from './components/CalendarWidget';
import WeatherWidget from './components/WeatherWidget';

const MainPage: React.FC<{fontScale: number, fontSize: number}> = ({fontScale, fontSize}) => {    
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [widget, setWidget] = useState(0);

    const widgetList = [
        <WeatherWidget fontSize={fontSize} fontScale={fontScale} />,
        <CalendarWidget fontSize={fontSize} fontScale={fontScale} />, 
    ]
    const iconList = [
        { name: '날씨', component: WeatherIcon},
        { name: '달력', component: CalendarIcon},
    ]

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Update screen size when resized
    useEffect(() => {
        const handleResize = () => {
          setScreenWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Body alignItems="center">
            <TransBox sx={{fontSize: `${(fontSize-4)*fontScale}px`}}>{currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</TransBox>
            <TransBox sx={{fontSize: `${(fontSize)*fontScale}px`}}>{currentTime.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true })}</TransBox>
            {widgetList[widget]}
            <Grid container spacing={1} p={2} maxWidth="lg">
                {
                    iconList.map((icon, i) => {
                        const IconComponent = icon.component;
                        return <Grid item key={i} xs={fontScale===1 ? 12/5 : fontScale===1.2 ? 12/4 : 12/3}>
                            <Stack alignItems="center" spacing={fontScale===1 ? 0.8 : fontScale===1.2 ? 1 : 1.5}>
                                <IconBox onClick={() => setWidget(i)} sx={{
                                    width: `${fontScale===1 ? screenWidth/5-15 : fontScale===1.2 ? screenWidth/4-20 : screenWidth/3-25}px`, 
                                    height: `${fontScale===1 ? screenWidth/5-15 : fontScale===1.2 ? screenWidth/4-20 : screenWidth/3-25}px`,
                                    color: widget===i ? 'black' : 'white',
                                    backgroundColor: widget===i ? 'white' : 'transparent',
                                    }} 
                                >
                                    <IconComponent sx={{fontSize: `${fontScale===1 ? screenWidth/5/2 : fontScale===1.2 ? screenWidth/4/2 : screenWidth/3/2}px`}} />
                                </IconBox>
                                <Box sx={{fontSize: `${(fontSize-12)*fontScale}px`}}>{icon.name}</Box>
                            </Stack>
                            </Grid>
                    })
                }
            </Grid>
        </Body>
    );
};

const Body = styled(Stack)(() => ({
    width: '100%',
    color: 'white',
    marginTop: '10px',
}));

const TransBox = styled(Box)(() => ({
    transition: 'all 0.6s ease-in-out',
    padding: '2px',
}));

const IconBox = styled(IconButton)(() => ({
    border: '2px solid white',
    borderRadius: '20%',
    transition: 'all 0.6s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
        color: 'black',
        backgroundColor: 'white',
    },
}));

export default MainPage;
