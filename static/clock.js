const setTime = () => document.querySelector('time').innerText = dayjs().format('YYYY-MM-DD HH:mm:ss');
setTime();
setTimeout(() => { setTime(); setInterval(setTime, 1000) }, 1000 - Date.now() % 1000);
const turnTime = { hour: 43200000, minute: 3600000, second: 60000 }
const now = Date.now() + dayjs().utcOffset() * 60000;
for (const div of document.querySelectorAll('div#clock > div'))
	div.style.transform = `rotate(${now % turnTime[div.id] / turnTime[div.id] * 360}deg)`;
