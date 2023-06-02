import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled, Stack, IconButton, Box } from '@mui/material/'
import StartIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/PauseRounded';
import RefreshIcon from '@mui/icons-material/RefreshRounded';
import DownIcon from '@mui/icons-material/ArrowDropDownCircleRounded';
import TextUp from '@mui/icons-material/TextIncreaseRounded';
import TextDown from '@mui/icons-material/TextDecreaseRounded';

import MainPage from './MainPage';

const App: React.FC = () => {
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState(0);
  const [age, setAge] = useState(0);
  const [age2, setAge2] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [gender, setGender] = useState('');
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);
  const [fontSize, setFontSize] = useState(25);

  // Fetch data from the API
  const fetchData = async () => {
      try {
          const response = await axios.get('http://localhost:5000/detect_age');
          console.log(response.data)

          const value = response.data;
          setPos(value.y);
          // setAge(value.age);
          setAge2(value.age);
          // setFontScale(value.age===5 ? 1.2 : value.age<5 ? 1 : 1.5);
          setFontScale(value.age>55 ? 1.5 : value.age>38 ? 1.2 : 1);
          setGender(value.gender);
      } catch (error) {
          console.error('Failed to retrieve face coordinates:', error);
      }
  };

  // Fetch data every 3 seconds
  useEffect(() => {
      let interval: NodeJS.Timeout;

      if (on) {
          fetchData();
          interval = setInterval(fetchData, 3000);
      }

      return () => {
          clearInterval(interval);
      };
  }, [on]);

  // Toggle the fetch data
  const onToggle = () => {
      setOn((prevOn) => !prevOn);
      console.log(`fetch data : ${!on.toString()}`);
  };

  // Reset the fetch data
  const onReset = () => {
    setOn(false);
    setPos(0);
    setAge(0);
    setAge2(0);
    setFontScale(1); 
    setGender('');
    setFontSize(25);
    console.log(`Reset!`);
  };

  // Increase the font size
  const onClickUp = () => {
    setFontSize(fontSize+5);
    console.log({fontSize: fontSize+5});
  };

  // Decrease the font size
  const onClickDown = () => {
    setFontSize(fontSize-5);
    console.log({fontSize: fontSize-5});
  };

  return (
    <Frame sx={{top: `${pos}px`}}>
      <Stack direction="row" justifyContent="space-between" p={1}>
        <Stack direction="row" alignItems="center">
          <CustomIconButton onClick={onToggle}>
            {
              on ? <PauseIcon sx={{fontSize: '24px'}} /> : <StartIcon sx={{fontSize: '24px'}} />
            }
          </CustomIconButton>
          <Box sx={{fontSize: '14px'}}>{on ? 'Now On' : 'Now Off'}</Box>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <FontWidget onClick={onClickUp}>
              <TextUp sx={{fontSize: '20px', marginRight: '2px'}} />
              <Box>크게</Box>
          </FontWidget>
          <FontWidget onClick={onClickDown}>
              <TextDown sx={{fontSize: '20px', marginRight: '2px'}} />
              <Box>작게</Box>
          </FontWidget>
          <CustomIconButton onClick={onReset}><RefreshIcon sx={{fontSize: '24px'}} /></CustomIconButton>
        </Stack>
      </Stack>
      <MainPage fontScale={fontScale} fontSize={fontSize} />
      <CustomIconButton onClick={() => {
        setGender(gender==="Male" ? "Female" : "Male");
        setAge2(age2+30<100 ? age2+30 : age2); 
        setFontScale(age2+30>60 ? 1.5 : age2+30>40 ? 1.2 : 1);
        setPos(pos+50<screenHeight-50 ? pos+50 : pos);
        console.log({gender, age2, fontScale, pos});
        }}><DownIcon /></CustomIconButton>
    </Frame>
  );
};

const Frame = styled(Stack)(() => ({
  fontFamily: 'Pretendard',
  position: 'relative',
  transition: 'top 0.6s ease-in-out',
  overflowX: 'hidden',
  overflowY: 'hidden',
}));

const CustomIconButton = styled(IconButton)(() => ({
  color: 'white',
  fontSize: '14px',
  padding: 0,
}));

const FontWidget = styled(IconButton)(() => ({
  color: 'white',
  padding: '3px 6px',
  borderRadius: '10px',
  border: '1px solid white',
  fontSize: '14px'
}));

export default App;
