import type { ChangeEvent} from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import Kakao from "./Map";
import type { CountyType, LocalInfoType, WeatherInfoType } from "./typeInterface";

const requestLocalInfo = async () => {
  const requestUrl = "http://203.232.193.177:8080/weather/all";
  try {
    const res = await axios.post(requestUrl);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const requestCountyInfo = async () => {
  const requestUrl = "http://203.232.193.177:8080/weather";
  try {
    const res = await axios.get(requestUrl);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const requestWeatherInfo = async (body: { readonly area: number; readonly time: number; readonly date: string; }) => {
  const requestUrl = "http://203.232.193.177:8080/weather";
  try{
    const res = await axios.post(requestUrl,body);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

const requestAllWeatherInfo = async (body: { readonly time: number; readonly date: string; }) => {
  const requestUrl = "http://203.232.193.177:8080/weather/allWeather";
  try{
    const res = await axios.post(requestUrl,body);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

const requestAllLocalInfo = async () => {
  const requestUrl = "http://203.232.193.177:8080/weather/all";
  try {
    const res = await axios.get(requestUrl);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

function App() {
  const [localList, setLocalList] = useState<LocalInfoType[]>([]);
  const [allWeatherInfo, setAllWeatherInfo] = useState<WeatherInfoType[]>([]);

  const [countyList, setCountyList] = useState<CountyType[]>([]);
  const [cityList, setCityList] = useState<LocalInfoType[]>([]);
  const [selectedCityList, setSelectedCityList] = useState<LocalInfoType[]>([]);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfoType>();
  const [selectedCounty, setSelectedCounty] = useState<string>("강원도");
  const [selectedCity, setSelectedCity] = useState<number>(1);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("0");
  const [selectedTime, setSelectedTime] = useState<number>(15);
  const [x , SetX] = useState<number>(37.87854);
  const [y , SetY] = useState<number>(127.73231);
  
  useEffect(()=>{
    const tempList: CountyType[] = [];

    requestCountyInfo()
    .then((result)=> {
      const list = result?.data;

      for (const data of list){
        tempList.push({
          County: data.County
        })
      }

      setCountyList(tempList);
    })
  },[])

  useEffect(()=>{
    const tempList: LocalInfoType[] = [];

    requestAllLocalInfo()
    .then((result)=>{
      const list = result?.data;
        for(const data of list){
          tempList.push({
            id: data.id,
            county: data.County,
            city: data.City,
            latitude : data.latitude,
            longitude : data.longitude
          })
        }
        setLocalList(tempList);
    })
  },[])

  useEffect(()=>{
    const tempList: LocalInfoType[] = [];
    requestLocalInfo()
    .then((result)=>{
        const list = result?.data;
        for(const data of list){
          tempList.push({
            id: data.id,
            county: data.County,
            city: data.City,
            latitude : data.latitude,
            longitude : data.longitude
          })
        }
        setCityList(tempList);
    })
  },[])

  useEffect(()=>{
    const tempList: LocalInfoType[] = [];

    for (const data of cityList) {
      if(data.county === selectedCounty){
        tempList.push({
          id: data.id,
          county: data.county,
          city: data.city,
          latitude : data.latitude,
          longitude : data.longitude
        });
      }
    }

    setSelectedCityList(tempList);
    if(tempList.length !== 0 ){
      setSelectedCity(tempList[0].id);
    }
  },[cityList, selectedCounty]);

  useEffect(() => {
    for(let i = 0; i < cityList.length; i++) {
      if(Number(cityList[i].id) === Number(selectedCity)){
        SetX(cityList[i].latitude);
        SetY(cityList[i].longitude);
        break;
      }
    }
  },[cityList, selectedCity]);

  const clickButton = () => {
    requestWeatherInfo({
      area: Number(selectedCity),
      time: Number(selectedTime),
      date: String(selectedDate)
    }).then((res) => {
      const tempList: WeatherInfoType[] = [];
      const list = res.data;
      try{
        tempList.push({
          area: list.area,
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
      } catch(err){
        setWeatherInfo(undefined);
      }
    })

    requestAllWeatherInfo({
      time: Number(selectedTime),
      date: String(selectedDate) 
    }).then((result)=>{
        const tempList: WeatherInfoType[] = [];
        const list = result.data;
        try{
          for(const data of list){
            tempList.push({
              area: data.area,
              PTY: data.PTY,
              REH: data.REH,
              RN1: data.RN1,
              T1H: data.T1H,
              UUU: data.UUU,
              VVV: data.VVV,
              VEC: data.VEC,
              WSD: data.WSD,
            })
          }
          
          setAllWeatherInfo(tempList);
      } catch(err){
        setAllWeatherInfo(undefined);
      }
    })
  }

  const selectCounty = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCounty(e.target.value);
  }

  const selectCity = (e: ChangeEvent<HTMLSelectElement>) => {
    const select = Number(e.target.value)
    setSelectedCity(select);
  }

  const selectDate = (date: Date) => {
    const year = String(date.getFullYear());

    let month:string;
    let day:string;

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

    const selectDate:string = year + month + day;

    let selectHour:number = date.getHours();

    if (selectHour === 0) {
      selectHour = 24;
    }

    setSelectedDate(selectDate);
    setSelectedTime(selectHour);
  }

  return <div>
    <Kakao x = {x} y= {y} localInfo = {localList} weatherInfo = {allWeatherInfo}/>
      <select onChange={(e) => selectCounty(e)}>
        {countyList.map((data) => {
          return (<option key={data.County} value={data.County}>
            {data.County}
          </option>)
        })}
      </select>
      <select onChange={(e) => selectCity(e)}>
        {selectedCityList.map((data) => {
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
      <button onClick={clickButton}>확인</button>
      <br/>
      {weatherInfo === undefined && <p>데이터를 찾을 수 없거나 오류가 발생했습니다.</p>}
    </div>
}

export default App;