const leftBar = document.querySelector('.leftBar');
const btn_leftBar = document.querySelector('.btn_leftBar');
let showBar = false;

btn_leftBar.addEventListener('click', ()=> {
    leftBar.classList.toggle("open");
    if( showBar ) {
        btn_leftBar.innerHTML = '&rsaquo;';
        showBar = false;
    } else {
        btn_leftBar.innerHTML = '&lsaquo;';
        showBar = true;
    }
});




// Get Date
let day = document.querySelector('.get-day');
let date = document.querySelector('.get-date');
let maskShop = document.querySelector('.mask-shop');

let get_day = new Date();
// 星期
let today_num = get_day.getDay();
day.textContent = dayNumToZh(today_num);
if ( today_num != 0 ) {
    if ( today_num%2 == 0 ) {
        maskShop.innerHTML = '身分證末號為<h3>0,2,4,6,8</h3>可購買';
    } else if ( today_num%2 == 1 ) {
        maskShop.innerHTML = '身分證末號為<h3>1,3,5,7,9</h3>可購買';
    }
} else { maskShop.innerHTML=''; }

function dayNumToZh(dayNum) {
    switch( dayNum ) {
        case 0: return '星期日';
        case 1: return '星期一';
        case 2: return '星期二';
        case 3: return '星期三';
        case 4: return '星期四';
        case 5: return '星期五';
        case 6: return '星期六';
    }
}


// 年月日
let newDate;
let newMooth;
if ( get_day.getDate() < 10 ) {
    newDate = Math.abs(get_day.getDate()).toString(10);
    newDate = `0${newDate}`;
} else { newDate = get_day.getDate(); }
if ( get_day.getMonth() < 10 ) {
    newMooth = Math.abs(get_day.getMonth()).toString(10);
    newMooth = `${newMooth+1}`;
} else { newMooth = get_day.getMonth() + 1; }
date.textContent = `${get_day.getFullYear()}-${newMooth}-${newDate}`;
// get Hours
let nowHour = get_day.getHours();







var map = L.map('map', {
    center: [23.879624,121.030431],
    // center: [25.0174467, 121.6415693],
    zoom: 10
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let greenMask = new L.Icon({
    iconUrl: 'mask-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let greyMask = new L.Icon({
    iconUrl: 'mask-none.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var maskXHR = new XMLHttpRequest();
maskXHR.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json', true);
maskXHR.send(null);
maskXHR.onload = function() {
    if(maskXHR.status !== 200) return
    var data = JSON.parse(maskXHR.responseText).features;
    console.log(data.length);

    let FilterMaskData = [];


    // DOM
    const search = document.querySelector('.search');
    const barBody = document.querySelector('.bar-body');
    const btnSearch = document.getElementById('btnSearch');
    

    function init() {
        FilterMask('all');
        showMarker();
    }

    function opentimeCheck(available) {
        let nowNoon;
        let openTime;
        let getDay = new Date();
        let day = getDay.getDay();
        let nowHour = getDay.getHours();

        if ( 9 <= nowHour && nowHour < 12 ) {
            nowNoon = '上午看診'
        } else if ( 14<= nowHour && nowHour < 17 ) {
            nowNoon = '下午看診'
        } else if ( 18<= nowHour && nowHour < 21 ) {
            nowNoon = '晚上看診'
        } else { nowNoon = undefined }

        openTime = dayNumToZh(day) + nowNoon;

        if ( available.includes(openTime) ) {
            return '營業中 ' + dayNumToZh(day) + NoonToHours(nowNoon)
        } else {
            if( !nowNoon ) {
                if ( nowHour < 9 ) {
                    nowNoon = '上午看診'
                } else if ( 12<= nowHour && nowHour < 14 ) {
                    nowNoon = '下午看診'
                } else if ( 17 == nowHour ) {
                    nowNoon = '晚上看診'
                } else if ( nowHour >= 21 ) {
                    nowNoon = '上午看診'
                    if ( day == 6 ) {
                        day = 0
                    } else { day += 1 }
                }
            }
            openTime = dayNumToZh(day) + nowNoon;
            if ( available.includes(openTime) ) {
                return '已打烊，開始營業時間: ' + dayNumToZh(day) + NoonToHours(nowNoon);
            } else {
                let count = 0;
                while ( !available.includes(openTime) ) {
                    if ( count > 5 ) {
                        return ' 已打烊 '
                    } else { count += 1 }
                    if ( nowNoon == '晚上看診' ) {
                        if ( day == 6 ) {
                            day = 0
                        } else { day += 1 }
                        nowNoon = '上午看診'
                    } else {
                        if ( nowNoon === '上午看診' ) nowNoon = '下午看診'
                        if ( nowNoon === '下午看診' ) nowNoon = '晚上看診'
                    }
                    openTime = dayNumToZh(day) + nowNoon;
                }
                openTime = dayNumToZh(day) + NoonToHours(nowNoon);
                return '已打烊，開始營業時間: ' + openTime;
            }
        }
    }

    function FilterMask(area) {
        if(area === 'all') {
            let maskData = data;
            FilterMaskData = maskData;
        } else {
            let maskData = data.filter(mask =>  
                mask.properties.name.includes(area) || mask.properties.address.includes(area) || mask.properties.cunli.includes(area) );
            FilterMaskData = maskData;
        }
        showBar();
    }

    function showMarker() {
        let markers = new L.MarkerClusterGroup().addTo(map);
        for(let i = 0; i < FilterMaskData.length; i++) {
            if (FilterMaskData[i].properties.mask_adult == 0 && FilterMaskData[i].properties.mask_child) {
                // 無口罩
                markers.addLayer(L.marker([FilterMaskData[i].geometry.coordinates[1], FilterMaskData[i].geometry.coordinates[0]], {icon: greyMask})
                    .bindPopup(`<h1>${FilterMaskData[i].properties.name}</h1><p>成人口罩: ${FilterMaskData[i].properties.mask_adult}<br>兒童口罩:${FilterMaskData[i].properties.mask_child}</p>`));
            } else {
                // 有口罩
                markers.addLayer(L.marker([FilterMaskData[i].geometry.coordinates[1], FilterMaskData[i].geometry.coordinates[0]], {icon: greenMask})
                    .bindPopup(`<h1>${FilterMaskData[i].properties.name}</h1><p>成人口罩: ${FilterMaskData[i].properties.mask_adult}<br>兒童口罩:${FilterMaskData[i].properties.mask_child}</p>`));
            }
        }
        map.addLayer(markers);
    }

    function showBar() {
        let str = '';
        for( let i = 0; i < FilterMaskData.length; i++ ) {
            str += `<div class="card"><h4>${FilterMaskData[i].properties.name}</h4><h5><i class="fas fa-location-dot"></i>${ToCDB(FilterMaskData[i].properties.address)}</h5><h5><i class="fas fa-solid fa-phone"></i>${FilterMaskData[i].properties.phone}</h5><h5 class="timeControl"><i class="fas fa-timer"></i> ${opentimeCheck(FilterMaskData[i].properties.available)} </h5><div class="mask"><div class="maskAdult"><h6>成人口罩</h6> <h4>${FilterMaskData[i].properties.mask_adult}</h4></div><div class="maskChild"><h6>兒童口罩</h6> <h4>${FilterMaskData[i].properties.mask_child}</h4></div></div></div>`
        }
        barBody.innerHTML = str;
        openORclose();
    }

    function openORclose() {
        let timeControl = document.querySelectorAll('.timeControl');
        for ( let i = 0; i < timeControl.length; i++ ) {
            if ( timeControl[i].innerText.includes('已打烊') ) {
                console.log(typeof(timeControl[i]));
                timeControl[i].classList.add('closeTime');
            }
        }
    }

    function NoonToHours(noon) {
        switch(noon) {
            case '上午看診': return '09:00~12:00';
            case '下午看診': return '14:00~17:00';
            case '晚上看診': return '18:00~21:00';
        }
    }

    function filterMarker() {
        FilterMask(search.value);
    }

    btnSearch.addEventListener('click', filterMarker);

    init();
}


// 全形字轉半形字
function ToCDB(str) { 
    var tmp = ""; 
    for(var i=0;i<str.length;i++){ 
        if (str.charCodeAt(i) == 12288){
            tmp += String.fromCharCode(str.charCodeAt(i)-12256);
            continue;
        }
        if(str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375){ 
            tmp += String.fromCharCode(str.charCodeAt(i)-65248); 
        } 
        else{ 
            tmp += String.fromCharCode(str.charCodeAt(i)); 
        } 
    } 
    return tmp 
}
