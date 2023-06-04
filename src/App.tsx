import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled, Stack, IconButton, Box } from '@mui/material/'
import StartIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/PauseRounded';
import RefreshIcon from '@mui/icons-material/RefreshRounded';
import DownIcon from '@mui/icons-material/ArrowDropDownCircleRounded';
import TextUp from '@mui/icons-material/TextIncreaseRounded';
import TextDown from '@mui/icons-material/TextDecreaseRounded';
import { BeatLoader } from 'react-spinners';

import { useSelector, useDispatch } from 'react-redux';
import { setAge, setPos, setScale } from './redux/actions';
import RootState from './redux/RootState';

import MainPage from './MainPage';

const App: React.FC = () => {
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(42);

  let age = useSelector((state: RootState) => state.age);
  let pos = useSelector((state: RootState) => state.pos);
  let scale = useSelector((state: RootState) => state.scale);
  const dispatch = useDispatch();

  // Fetch data from server
  const fetchOnce = async () => {
      setLoading(true);

      try {
          const response = await axios.get('http://localhost:5000/detect_age', {timeout: 15000});
          
          const v = {'age': response.data.age, 'y': response.data.y};
          console.log(v)

          handleButtonClick(v.age, v.y*2);
      } catch (error) {
          console.error('Failed to retrieve face coordinates:', error);
      } finally {
        setLoading(false);
      }
  };

  // Fetch data from server every 10 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (on) {
        fetchOnce();
        interval = setInterval(fetchOnce, 10000);
    }

    return () => {
        clearInterval(interval);
    };
  }, [on]);

  // Print the current state
  useEffect(() => {
    console.log(`### age: ${age}, pos: ${pos}, scale: ${scale}`);
  }, [age, pos, scale]);

  // Toggle the fetch data
  const onToggle = () => {
      setOn((prevOn) => !prevOn);
      console.log(`fetch data : ${!on.toString()}`);
  };

  // Reset the fetch data
  const onReset = () => {
    setOn(false);
    dispatch(setPos(0));
    dispatch(setAge(25));
    dispatch(setScale(1));
    setFontSize(40);
    console.log('Reset!')
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

  // Handle the button click
  const handleButtonClick = (age: number, pos: number) => {
    dispatch(setAge(age));
    dispatch(setPos(pos));
    dispatch(setScale(age>55 ? 1.5 : age>38 ? 1.2 : 1));
  }

  return (
    <Frame sx={{top: `${pos}px`}}>
      <Stack direction="row" justifyContent="space-between" p={1}>
        <Stack direction="row" alignItems="center">
          <CustomIconButton onClick={onToggle}>
            {
              on ? <PauseIcon sx={{fontSize: '34px'}} /> : <StartIcon sx={{fontSize: '34px'}} />
            }
          </CustomIconButton>
          <Box sx={{fontSize: '20px'}}>{on ? 'Now On' : 'Now Off'}</Box>
        </Stack>
        {
          loading ? 
          <Stack alignItems="center" justifyContent='center' sx={{transform: 'scale(0.8)'}}>
            <BeatLoader color="white" margin={3} />
          </Stack> : null
        }
        <Stack direction="row" spacing={0.5}>
          <FontWidget onClick={onClickUp}>
              <TextUp sx={{fontSize: '24px', marginRight: '2px'}} />
              <Box sx={{fontSize: '20px'}}>크게</Box>
          </FontWidget>
          <FontWidget onClick={onClickDown}>
              <TextDown sx={{fontSize: '24px', marginRight: '2px'}} />
              <Box sx={{fontSize: '20px'}}>작게</Box>
          </FontWidget>
          <CustomIconButton onClick={onReset}><RefreshIcon sx={{fontSize: '34px'}} /></CustomIconButton>
        </Stack>
      </Stack>
      <MainPage fontScale={scale} fontSize={fontSize} />
      <CustomIconButton onClick={() => handleButtonClick(age+30, pos+600)}><DownIcon /></CustomIconButton>
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
  borderRadius: '8px',
  border: '1px solid white',
  fontSize: '14px'
}));

export default App;
