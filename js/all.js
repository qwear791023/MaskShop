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
if ( today_num == 1 ) maskShop.innerHTML = '身分證末號為<h3>1,3,5,7,9</h3>可購買';
if ( today_num == 2 ) maskShop.innerHTML = '身分證末號為<h3>0,2,4,6,8</h3>可購買';
if ( today_num == 3 ) maskShop.innerHTML = '身分證末號為<h3>1,3,5,7,9</h3>可購買';
if ( today_num == 4 ) maskShop.innerHTML = '身分證末號為<h3>0,2,4,6,8</h3>可購買';
if ( today_num == 5 ) maskShop.innerHTML = '身分證末號為<h3>1,3,5,7,9</h3>可購買';
if ( today_num == 6 ) maskShop.innerHTML = '身分證末號為<h3>0,2,4,6,8</h3>可購買';

function dayNumToZh(dayNum) {
    if ( dayNum == 0 ) return '星期日';
    if ( dayNum == 1 ) return '星期一';
    if ( dayNum == 2 ) return '星期二';
    if ( dayNum == 3 ) return '星期三';
    if ( dayNum == 4 ) return '星期四';
    if ( dayNum == 5 ) return '星期五';
    if ( dayNum == 6 ) return '星期六';
}
// 年月日
let newDate;
let newMooth;
if ( get_day.getDate() < 10 ) {
    // let newDate = get_day.getDate();
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
    let OpenTime;

    // DOM
    const search = document.querySelector('.search');
    const barBody = document.querySelector('.bar-body');
    const btnSearch = document.getElementById('btnSearch');

    // OpenTime
    

    function init() {
        showMarker('all');
    }

    function opentimeCheck(available) {
        // Get Hours 
        let nowNoon;
        let Time;
        let nextDay;
        let nextNoon;
        let nextTime;



        if ( 9 <= nowHour < 12 ) {
            nowNoon = '上午看診';
        } else if ( 14 <= nowHour < 17 ) {
            nowNoon = '下午看診';
        } else if ( 18 <= nowHour < 21 ) {
            nowNoon = '晚上看診';
        }
        Time = day + nowNoon;

        function NoonToHours(noon) {
            if ( noon === '上午看診' ) {
                return '09:00 ~ 12:00';
            } else if ( noon = '下午看診' ) {
                return '14:00 ~ 17:00';
            } else if ( noon = '晚上看診' ) {
                return '18:00 ~ 21:00';
            }
        }

        if ( available.includes(Time) ) {
            // 有營業
            return day + ' ' + NoonToHours(nowNoon);
        } else {
            // 無營業
            toNext(today_num, nowHour);
        }

        // toNext
        function toNext(day, nowHour) {

            // 21~ & ~9 & 12~14 & 17~18
            if ( !Time ) {
                if ( nowHour >= 21 ) { 
                    nextTime = tomorrow_zh + '上午看診';
                } else if ( nowHour < 9 ) {
                    nextTime = day + '上午看診';
                } else if ( 12 <= nowHour < 14 ) {
                    nextTime = day + '下午看診';
                } else if ( nowHour === 17 ) {
                    nextTime = day + '晚上看診';
                }
            }

            while( !available.includes(nextTime) ) {
                if ( day == 6 ) {
                    nextDay = 0;
                } else { nextDay = day + 1 }

                if ( nowNoon === '晚上看診' ) {
                    nextNoon = '上午看診';
                    nextTime = dayNumToZh(nextDay) + nextNoon;
                    day = nextDay;
                } else {
                    if ( nowNoon === '上午看診' ) nextNoon = '下午看診';
                    if ( nowNoon === '下午看診' ) { nextNoon = '晚上看診';}
                    nextTime = dayNumToZh(day) + nextNoon;
                }
                nowNoon = nextNoon;
            }

            if( available.includes(nextTime) ) return '已打烊，開始營業時間為：' + NoonToHours(nowNoon);
        }
    }

    function showMarker(area) {
        let markers = new L.MarkerClusterGroup().addTo(map);
        if(area === 'all') {
            FilterMaskData = data;
            for(let i = 0; i < data.length; i++) {
                if (data[i].properties.mask_adult == 0 && data[i].properties.mask_child) {
                    // 無口罩
                    markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], {icon: greyMask})
                        .bindPopup(`<h1>${data[i].properties.name}</h1><p>成人口罩: ${data[i].properties.mask_adult}<br>兒童口罩:${data[i].properties.mask_child}</p>`));
                } else {
                    // 有口罩
                    markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], {icon: greenMask})
                        .bindPopup(`<h1>${data[i].properties.name}</h1><p>成人口罩: ${data[i].properties.mask_adult}<br>兒童口罩:${data[i].properties.mask_child}</p>`));
                }
            }
            map.addLayer(markers);
        } else {
            for(let i = 0; i < data.length; i++) {
                console.log(typeof(data[i].properties.name));
                if ( data[i].properties.name.includes(area) ) {
                    FilterMaskData.push(data[i].properties)
                } else if ( data[i].properties.address.includes(area) ) {
                    FilterMaskData.push(data[i].properties)
                } else if ( data[i].properties.cunli.includes(area) ) {
                    FilterMaskData.push(data[i].properties)
                }
            }
            console.log(FilterMaskData);
            // for ( let j = 0; j < FilterMaskData.length; j++ ) { 
            //     str += `<div class="card"><h4>${FilterMaskData[j].name}</h4><h5><i class="fas fa-location-dot"></i>${FilterMaskData[j].address}</h5><h5><i class="fas fa-solid fa-phone"></i>${FilterMaskData[j].phone}</h5>
            //     <h5><i class="fas fa-timer"></i>${opentimeCheck(FilterMaskData[j].available)}</h5>
            //     <div class="mask">div class="maskAdult"><h6>成人口罩</h6> <h4>${FilterMaskData[j].mask_adult}</h4></div><div class="maskChild"><h6>兒童口罩</h6> <h4>${FilterMaskData[j].mask_child}</h4></div></div></div>`
            // }
        }
    }

    function filterMarker() {
        // console.dir(search.value);
        showMarker(search.value);
    }

    btnSearch.addEventListener('click', filterMarker);

    init();
}