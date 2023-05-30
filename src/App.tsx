import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled, Stack } from '@mui/material/'
import MainPage from './MainPage';

const App: React.FC = () => {
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState(0);
  const [age, setAge] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [gender, setGender] = useState('');

  // Fetch data from the API
  const fetchData = async () => {
      try {
          const response = await axios.get('http://localhost:5000/detect_age');
          console.log(response.data)

          const value = response.data;
          setPos(value.y-100>0 ? value.y-100 : 0);
          setAge(value.age);
          setFontScale(value.age===5 ? 1.2 : value.age<5 ? 1 : 1.5);
          setGender(value.gender);
      } catch (error) {
          console.error('Failed to retrieve face coordinates:', error);
      }
  };

  // Fetch data every second
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
    setFontScale(1); 
    setGender('');
    console.log(`Reset!`);
};

  return (
    <Frame sx={{top: `${pos}px`}}>
      <button onClick={onToggle}>Fetch Data: {on.toString()}</button>
      <button onClick={onReset}>RESET</button>
      <MainPage age={age} pos={pos} gender={gender} fontScale={fontScale} />
      <button onClick={() => {
        setGender(gender==="Male" ? "Female" : "Male");
        setAge(age+1<8 ? age+1 : age); 
        setFontScale(age+1===5 ? 1.2 : age+1<5 ? 1 : 1.5);
        setPos(pos+50<251 ? pos+50 : pos);
        }}>ALL TRANS TEST</button>
    </Frame>
  );
};

const Frame = styled(Stack)(() => ({
  position: 'relative',
  transition: 'top 0.6s ease-in-out',
  overflowX: 'hidden',
  overflowY: 'hidden',
}));

export default App;
