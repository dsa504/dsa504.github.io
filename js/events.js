(() => {
    
    const getPrettyDate = (uglydateTime) => {
        const prettyPattern = "dddd, MMMM Do YYYY, h:mm a";
        const theMoment = moment(uglydateTime);
        
        const day = theMoment.clone().format("dddd");
        const month = theMoment.clone().format("MMMM");
        const date = theMoment.clone().format("Do");
        const year = theMoment.clone().format("YYYY");
        const time = theMoment.clone().format("h:mm");
        const ampm = theMoment.clone().format("a");
        const output = {day,month,date,year,time,ampm};
        return output;
    };

    const createVm = (config) => {
        const _vm = {
            el: '#dsa-cal-app',
            data: {
                calevents: '',
                errors:''
            },
            methods: {
                
            },
            mounted: () => {
                const today = new Date();
                // only get upcoming events:
                const uri = `https://www.googleapis.com/calendar/v3/calendars/${config.calendarId}/events?key=${config.apiKey}&timeMin=${today.toISOString()}`;
                try {
                    const response = await fetch(uri);
                }
                catch (r) {
                    vm.errors = "Derp. Something went wrong- if you're seeing this, please let us know on <a href='https://www.facebook.com/NewOrleansDSA/'>Facebook</a> or the <a href='https://twitter.com/neworleansdsa'>Twitters</a>!";
                    return;
                }
        
                const theEvents = (await response.json()).items;
                
                _vm.calevents = theEvents
                    // all day events don't have a dateTime, so will screw up the chonological order- so if there's no dateTime, just use date
                    .map((e) => {
                        const theStart = (e.start.dateTime == undefined) ? e.start.date : e.start.dateTime;
                        return {...e, theStart, prettyDate: getPrettyDate(e)};
                    })
                    // sort to make sure the events are in chron order
                    .sort((a,b) => { 
                        const a = new Date(a.theStart);
                        const b = new Date(b.theStart);
                        return a<b ? -1 : a>b ? 1 : 0;
                    });
            }
        };

        return _vm;
    };
    
    const configResponse = await fetch("/calendarconfig.json");
    const config = await configResponse.json();

    new Vue(createVm(config));
})();
