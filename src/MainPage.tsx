import React, { useState, useEffect } from 'react';
import { styled, Box, Stack } from '@mui/material/'

const MainPage: React.FC<{age: number, pos: number, gender: string, fontScale: number}> = ({age, pos, gender, fontScale}) => {    
    const ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Body alignItems="center" justifyContent="space-between">
            <Stack sx={{width: '100%'}}>
                <TransBox sx={{fontSize: `${20*fontScale}px`}}>{currentTime.toLocaleDateString()}</TransBox>
                <TransBox sx={{fontSize: `${25*fontScale}px`}}>{currentTime.toLocaleTimeString()}</TransBox>
            </Stack>
            <GenderBox alignItems="center" justifyContent="center" sx={{backgroundColor: gender==='Male' ? 'lightblue' : 'pink',}}>
            </GenderBox>
            <TransBox sx={{fontSize: `${20*fontScale}px`}}>Pos is {pos}px</TransBox>
            <TransBox sx={{fontSize: `${20*fontScale}px`}}>Age is {ageList[age]}</TransBox>
            <TransBox sx={{fontSize: `${20*fontScale}px`}}>FontScale is {fontScale}</TransBox>
            <TransBox sx={{fontSize: `${20*fontScale}px`}}>Gender is {gender}</TransBox>
        </Body>
    );
};

const Body = styled(Stack)(() => ({
    width: '100%',
    height: '400px',
    padding: '10px',
    color: 'white',
}));

const TransBox = styled(Box)(() => ({
    transition: 'font-size 0.6s ease-in-out',
}));

const GenderBox = styled(Stack)(() => ({
    width: '80%',
    opacity: 0.5,
    height: '200px',
    transition: 'background-color 0.6s ease-in-out'
}));

export default MainPage;
