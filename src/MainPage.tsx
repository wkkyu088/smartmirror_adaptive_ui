import React, { useState, useEffect } from 'react';
import { styled, Box, Stack, Grid, IconButton } from '@mui/material/'
import CalendarIcon from '@mui/icons-material/TodayRounded';
import WeatherIcon from '@mui/icons-material/WbSunnyRounded';
import NewsIcon from '@mui/icons-material/NewspaperRounded';
import ChecklistIcon from '@mui/icons-material/ChecklistRounded';
import MusicIcon from '@mui/icons-material/MusicNoteRounded';

const MainPage: React.FC<{age: number, pos: number, gender: string, fontScale: number, fontSize: number}> = ({age, pos, gender, fontScale, fontSize}) => {    
    const ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
    
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [currentTime, setCurrentTime] = useState(new Date());

    const iconList = [
        { name: '달력', component: CalendarIcon, color: 'lightblue' },
        { name: '날씨', component: WeatherIcon, color: 'lightyellow' },
        { name: '뉴스', component: NewsIcon, color: 'lightgray' },
        { name: '할 일', component: ChecklistIcon, color: 'pink' },
        { name: '음악', component: MusicIcon, color: 'lightgreen' },
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
        // console.log(`screenWidth: ${screenWidth}, screenHeight: ${screenHeight}`)
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Body alignItems="center">
            <TransBox sx={{fontSize: `${(fontSize-4)*fontScale}px`}}>{currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</TransBox>
            <TransBox sx={{fontSize: `${(fontSize)*fontScale}px`}}>{currentTime.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true })}</TransBox>
            <GenderBox alignItems="center" justifyContent="center" sx={{backgroundColor: gender==='Male' ? 'lightblue' : 'pink',}} />
            {/* <TransBox sx={{fontSize: `${(fontSize-10)*fontScale}px`}}>Pos: {pos}px, Age: {age}, Gender: {gender}</TransBox>
            <TransBox sx={{fontSize: `${(fontSize-10)*fontScale}px`, paddingY: '10px'}}>FontScale: {fontScale}, FontSize: {fontSize}</TransBox> */}
            <Grid container spacing={1} p={2} maxWidth="lg">
                {
                    iconList.map((icon, i) => {
                        const IconComponent = icon.component;
                        return <Grid item key={i} xs={fontScale===1 ? 12/5 : fontScale===1.2 ? 12/4 : 12/3}>
                            <Stack alignItems="center" spacing={0.5}>
                                <IconBox sx={{
                                    backgroundColor: icon.color,
                                    width: `${fontScale===1 ? screenWidth/5-15 : fontScale===1.2 ? screenWidth/4-15 : screenWidth/3-15}px`, 
                                    height: `${fontScale===1 ? screenWidth/5-15 : fontScale===1.2 ? screenWidth/4-15 : screenWidth/3-15}px`,}} 
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
    // height: '400px',
    color: 'white',
    marginTop: '10px',
}));

const TransBox = styled(Box)(() => ({
    transition: 'font-size 0.6s ease-in-out',
    padding: '2px',
}));

const GenderBox = styled(Stack)(() => ({
    width: '80%',
    opacity: 0.5,
    margin: '10px',
    height: '100px',
    transition: 'background-color 0.6s ease-in-out'
}));

const IconBox = styled(IconButton)(() => ({
    color: 'black',
    borderRadius: '20%',
    transition: 'all 0.6s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
        color: 'white',
        // backgroundColor: 'white',
    },
}));

export default MainPage;
