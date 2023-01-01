import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import Kakao from "./src/Map";

const requestLocalInfo = async () => {
  const requestUrl = "http://203.232.193.177:8080/weather";
  try {
    const res = await axios.get(requestUrl);
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

const requestCityInfo = async (county:string) => {
  const requestUrl = "http://203.232.193.177:8080/weather/county";
  try{
    const res = await axios.post(requestUrl,{
      "county": county
    });
    return res?.data;
  } catch (error) {
    console.log(error);
  }
}

const requestWeatherInfo = async (body: { area: number; time: number; date: string; }) => {
  const requestUrl = "http://203.232.193.177:8080/weather";
  try{
    const res = await axios.post(requestUrl,body);
    return res?.data;
  } catch (error) {
    console.log(error)
  }
}

interface CountyType {
  County: string;
}

interface LocalInfoType {
  id: number,
  county: string,
  city: string,
  latitude: number,
  longitude: number
}

interface WeatherInfoType {
  PTY: number,
  REH: number,
  RN1: number,
  T1H: number,
  UUU: number,
  VVV: number,
  VEC: number,
  WSD: number,
}


function App() {
  const [countyList, setCountyList] = useState<CountyType[]>([]);
  const [cityList, setCityList] = useState<LocalInfoType[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [selectArea, setSelectArea] = useState<number>(0);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfoType>();
  const [isSearched , setIsSearched] = useState<boolean>(false);
  const [x , SetX] = useState<number>(37.37781);
  const [y , SetY] = useState<number>(128.39235);

  useEffect(() => {
    const tempList: CountyType[] = [];

    requestLocalInfo().then((res) => {

      const list = res?.data;

      for (const e of list) {
        tempList.push({
          County: e.County,
        });
      }

      setCountyList(tempList);
    });
  }, []);

  useEffect(() => {
    setCityList((e)=>e);
  }, [])

  useEffect(() => {
    setWeatherInfo((e)=>e);
  }, [])

  useEffect(() => {
    SetX((e) => e);
    SetY((e) => e);
  }, [])

  useEffect(()=>{
    setSelectArea((e) => e);
    for(let i = 0; i < cityList.length; i++) {
      if(cityList[i].id == selectArea){
        SetX(cityList[i].latitude);
        SetY(cityList[i].longitude);
        break;
      }
    }
  },[cityList, selectArea])

  const selectCity = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectArea(Number(e.target.value));
  }

  const selectCounty = (e: ChangeEvent<HTMLSelectElement>) => {
    requestCityInfo(e.target.value).then((res)=>{
      const list = res?.data;
      const tempList:LocalInfoType[] = [];

      for (const data of list) {
        tempList.push({
          id: data.id,
          county: data.County,
          city: data.City,
          latitude : data.latitude,
          longitude : data.longitude
        });
      }
      setCityList(tempList);
      setSelectArea(tempList[0].id);
    })
  }

  const selectDate = (date: Date) => {
    const year = String(date.getFullYear());
    let month;
    let day;
    if(date.getMonth()+1 >= 10){
      month = String(date.getMonth()+1);
    } else {
      month = "0" + String(date.getMonth()+1)
    }
    
    if(date.getDate() >= 10) {
      day = String(date.getDate());
    } else {
      day = "0"+String(date.getDate());
    }

    const selectedDate:string = year + month + day;
    let selectedHour:number = date.getHours();

    if (selectedHour === 0) {
      selectedHour = 24;
    }

    requestWeatherInfo({
      "area": selectArea,
      "time": selectedHour,
      "date": selectedDate
    }).then((res) => {
      const tempList: WeatherInfoType[] = [];
      const list = res.data;
      tempList.push({
          PTY: list.PTY,
          REH: list.REH,
          RN1: list.RN1,
          T1H: list.T1H,
          UUU: list.UUU,
          VVV: list.VVV,
          VEC: list.VEC,
          WSD: list.WSD,
      })

      setWeatherInfo(tempList[0]);

      if (isSearched===false){
        setIsSearched(true);
      }

    })
  }

  return <><div>
        <select onChange={(e) => selectCounty(e)}>
        {countyList.map((data) => {
          return (<option key={data.County} value={data.County}>
            {data.County}
          </option>)
        })}
        </select>
        <select onChange={(e) => selectCity(e)}>
        {cityList.map((data) => {
          return (<option key={data.city} value={data.id}>
            {data.city}
          </option>)
        })}
        </select>
        <DatePicker 
          locale={ko}
          selected={startDate}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          timeCaption="time"
          onChange={(date) => {
            setStartDate(date)
            selectDate(date);
          }}/>
        <br/>
        {isSearched && 
        <p>기온:{weatherInfo.T1H}°C </p>}
        {isSearched && 
        <p>동서바람성분: {weatherInfo.UUU}m/s</p>}
        {isSearched && 
        <p>남북바람성분: {weatherInfo.VVV}m/s</p>}
        {isSearched && 
        <p>습도: {weatherInfo.REH}%</p>}
        {isSearched && 
        <p>풍향: {weatherInfo.VEC}deg</p>}
        {isSearched && 
        <p>풍속: {weatherInfo.WSD}m/s</p>}
      </div>
      </>
}

export default App;