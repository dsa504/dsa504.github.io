(async () => {
    
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
                calevents: [],
                showErrors:false,
            },
            methods: {
                
            },
            //showErrors:false,
            mounted: async () => {
                const today = moment(new Date()).add("month", -1);
                // only get upcoming events:
                const uri = `https://www.googleapis.com/calendar/v3/calendars/${config.calendarId}/events?key=${config.apiKey}&timeMin=${today.toISOString()}`;
                
                let response;
                try {
                    response = await fetch(uri);
                }
                catch (r) {
                    _vm.showErrors = true;
                    return;
                }
        
                if (!response.ok) {
                    return _vm.showErrors = true 
                }

                const theEvents = (await response.json()).items;
                
                _vm.data.calevents = theEvents
                    // all day events don't have a dateTime, so will screw up the chonological order- so if there's no dateTime, just use date
                    .map((e) => {
                        const theStart = (e.start.dateTime == undefined) ? e.start.date : e.start.dateTime;
                        return {...e, theStart, prettyDate: getPrettyDate(e)};
                    })
                    // sort to make sure the events are in chron order
                    .sort((x,y) => { 
                        const a = new Date(x.theStart);
                        const b = new Date(y.theStart);
                        return a<b ? -1 : a>b ? 1 : 0;
                    });
            }
        };

        return _vm;
    };
    
    let configResponse
    
    try {
        configResponse = await fetch("/calendarconfig.json");
    }
    catch(e){
        console.log(e);
    }
    const config = await configResponse.json();

    const vm = createVm(config);

    window.vm = vm;
    new Vue(vm);
})();
