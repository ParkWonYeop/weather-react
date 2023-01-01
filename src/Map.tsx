import {useEffect, useState} from 'react';
import type { LocalInfoType, WeatherInfoType } from "./typeInterface";

const { kakao } = window;

function Kakao(props: { readonly x: number; readonly y: number; readonly localInfo:readonly LocalInfoType[]; readonly weatherInfo:readonly WeatherInfoType[]}) {
    const [localInfoList, setLocalInfoList] = useState<any[]>([]);
    const [map, setMap] = useState<any>();

    useEffect(()=> {
        const container = document.getElementById("map");
        const options = {
            center: new kakao.maps.LatLng(props.x, props.y),
            level: 10
        };     
        setMap(new kakao.maps.Map(container, options));
    },[props.x, props.y]);

    useEffect(()=>{
        const localList = props.localInfo;
        const weatherInfo = props.weatherInfo
        const tempList = [];

        for(let i = 0; i<localList.length; i++){
            for(let j = 0; j<weatherInfo.length; j++){
                if(Number(weatherInfo[j].area) === Number(localList[i].id)){
                    tempList.push({
                        lating: new kakao.maps.LatLng(localList[i].latitude, localList[i].longitude), 
                        T1H: weatherInfo[j].T1H,
                        REH: weatherInfo[j].REH
                    })
                    break;
                }
            }
        }
        setLocalInfoList(tempList);
    },[props.localInfo, props.weatherInfo])

    useEffect(()=>{
        for(let i = 0; i<localInfoList.length;i++){
            try{
                const marker = new kakao.maps.Marker({
                    position:localInfoList[i].lating,
                    clickable: true
                });
                marker.setMap(map);

                const iwContent = '<div style="padding:5px;">'+
                '<p>기온 : '+localInfoList[i].T1H+' °C</p>'+
                '<p>습도: '+localInfoList[i].REH+' %</p>'+
                '</div>';

                const infoWindow = new kakao.maps.InfoWindow({
                    content : iwContent
                });

                kakao.maps.event.addListener(marker, 'mouseover', function() {
                    infoWindow.open(map, marker);
                });

                kakao.maps.event.addListener(marker, 'mouseout', function() {
                    infoWindow.close();
                });
            } catch(err) {
                console.log(err)
            }
        }
    },[map, localInfoList])
  
    return (
      <div id="map" style={{
        width: '500px',
        height: '500px'
      }}></div>
    )
}

export default Kakao;