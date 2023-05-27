import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Stack } from '@mui/material/'
import { styled } from '@mui/material/styles';

const MainPage: React.FC = () => {
    const [on, setOn] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [pos, setPos] = useState(0);

    const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/face_coordinates');
        console.log(response.data)

        const value = response.data;
        setPos(value.y-100>0 ? value.y-100 : 0);
    } catch (error) {
        console.error('Failed to retrieve face coordinates:', error);
    }
};

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (on) {
            fetchData();
            interval = setInterval(fetchData, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [on]);

    return (
        <Body alignItems="center" justifyContent="space-between" sx={{top: `${pos}px`}}>
            <Stack sx={{width: '100%'}}>
                <Day>{currentTime.toLocaleDateString()}</Day>
                <Time>{currentTime.toLocaleTimeString()}</Time>
            </Stack>
            <button onClick={() => setOn((prevOn) => !prevOn)}>Fetch Data: {on.toString()}</button>
            <CustomBox alignItems="center" justifyContent="center">
            </CustomBox>
            <CustomText>Pos is {pos}px</CustomText>
        </Body>
    );
};

const Body = styled(Stack)(() => ({
    position: 'relative',
    width: '100%',
    height: '400px',
    padding: '10px',
    color: 'white',
    transition: 'top 0.6s ease-in-out',
}));

const Time = styled(Box)(() => ({
    fontSize: '25px',
}));

const Day = styled(Box)(() => ({
    fontSize: '20px',
}));

const CustomBox = styled(Stack)(() => ({
    width: '80%',
    backgroundColor: 'white',
    opacity: 0.5,
    height: '200px',
}));

const CustomText = styled(Box)(() => ({
    fontSize: '20px',
}));

export default MainPage;
