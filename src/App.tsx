import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, h: 0, w: 0 });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/data');

      const value = response.data;
      const valuesArray = value.split(",");
      const x = Number(valuesArray[0].trim());
      const y = Number(valuesArray[1].trim());
      const x2 = Number(valuesArray[2].trim());
      const y2 = Number(valuesArray[3].trim());

      setPosition({x: x, y: y, h: y2-y, w: x2-x});
      console.log(position);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   // 3초마다 fetchData 함수 호출
  //   const interval = setInterval(fetchData, 1000);

  //   // 컴포넌트 언마운트 시 clearInterval 호출하여 정리
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <p>{position.x}</p>
      <p>{position.y}</p>
      <p>{position.h}</p>
      <p>{position.w}</p>
      <div
        style={{
          width: `${position.w}px`,
          height: `${position.h}px`,
          backgroundColor: 'red',
          opacity: 0.5,
          position: 'absolute',
          top: `${position.y+30}px`,
          left: `${position.x}px`,
        }}
      />
    </div>
  );
};

export default App;
