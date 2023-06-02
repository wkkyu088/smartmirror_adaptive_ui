import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { WiDaySunny, WiCloudy, WiDayCloudy, WiRain, WiSnow, WiNightClear, WiNightCloudy, WiNightAltRain } from 'react-icons/wi';
import { Box, Stack, Grid } from '@mui/material/'
import { FadeLoader } from 'react-spinners';

const WeatherWidget: React.FC<{fontScale: number, fontSize: number}> = ({fontScale, fontSize}) => {    
    const api = {
        key: "bd5cf52571826a90733a70b8c519da0b",
        base: "https://api.openweathermap.org/data/2.5/",
    };
    const city = "Seoul";
    const url = `${api.base}weather?q=${city}&appid=${api.key}&units=metric&lang=kr`;

    const getWeatherData = async () => {
        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.error('Error fetching weather data:', error);
          return null;
        }
    };

    interface WeatherData {
        weather: {
          main: string;
          description: string;
          icon: string;
        }[];
        main: {
          temp: number;
          feels_like: number;
          temp_min: number;
          temp_max: number;
        };
    }

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    useEffect(() => {
      const fetchWeatherData = async () => {
        const data = await getWeatherData();
        setWeatherData(data);
      };

      fetchWeatherData();
    }, [city]);

    if (!weatherData) {
      return <Box p={2} sx={{transform: `scale(${fontScale===1 ? 0.5 : fontScale===1.2 ? 0.8 : 1.2})`}}>
          <FadeLoader color="white" />
        </Box>
    }

    const { main, description, icon } = weatherData.weather[0];
    const { temp, feels_like, temp_min, temp_max } = weatherData.main;

    const getIcon = (code: string) => {
        const isDaytime = code.includes('d');

        switch (code.substring(0, 2)) {
          case '01':
            return isDaytime ? <WiDaySunny /> : <WiNightClear />;
          case '02':
            return isDaytime ? <WiDayCloudy /> : <WiNightCloudy />;
          case '03':
          case '04':
            return <WiCloudy />;
          case '09':
            return <WiRain />;
          case '10':
            return isDaytime ? <WiDayCloudy /> : <WiNightAltRain />;
          case '11':
            return <WiRain />;
          case '13':
            return <WiSnow />;
          default:
            return null;
        }
    };

    function translateMain(main: string): string {
        switch (main) {
          case 'Thunderstorm':
            return '천둥 번개';
          case 'Drizzle':
            return '이슬비';
          case 'Rain':
            return '비';
          case 'Snow':
            return '눈';
          case 'Mist':
            return '안개';
          case 'Smoke':
            return '연기';
          case 'Haze':
            return '실안개';
          case 'Dust':
            return '먼지';
          case 'Fog':
            return '안개';
          case 'Sand':
            return '모래';
          case 'Ash':
            return '화산재';
          case 'Squall':
            return '돌풍';
          case 'Tornado':
            return '토네이도';
          case 'Clear':
            return '맑음';
          case 'Clouds':
            return '구름';
          default:
            return '';
        }
    }

    return (
        <Grid container alignItems="center" justifyContent='center' px={4} py={2}>
            <Grid item xs={4} justifyContent='center'>
                <Box sx={{fontSize: `${(fontSize+60)*fontScale}px`, padding: '30px 0 0 0', textAlign: 'center'}}>{getIcon(icon)}</Box>
            </Grid>
            <Grid item xs={8}>
                <Stack>
                    <Stack direction="row" alignItems="end" spacing={fontScale===1 ? 1 : fontScale===1.2 ? 1.5 : 2}>
                        <Box sx={{fontSize: `${(fontSize+30)*fontScale}px`}}>{temp.toFixed(0)}º</Box>
                        <Box sx={{fontSize: `${(fontSize-6)*fontScale}px`, paddingBottom: '10px'}}>{translateMain(main)}</Box>
                    </Stack>
                    <Stack direction="row" spacing={fontScale===1 ? 1.5 : fontScale===1.2 ? 2 : 2.5}>
                        <Box sx={{fontSize: `${(fontSize-10)*fontScale}px`, paddingBottom: '10px'}}>{temp_max.toFixed(0)}º / {temp_min.toFixed(0)}º</Box>
                        <Box sx={{fontSize: `${(fontSize-10)*fontScale}px`, paddingBottom: '10px'}}>체감온도 {feels_like.toFixed(0)}º</Box>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default WeatherWidget;