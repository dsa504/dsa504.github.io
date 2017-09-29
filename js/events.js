(async () => {
    
    const getPrettyDate = (uglydateTime) => {
        const theMoment = moment(uglydateTime);
        
        const day = theMoment.format("dddd");
        const month = theMoment.format("MMMM");
        const date = theMoment.format("Do");
        const year = theMoment.format("YYYY");
        const time = theMoment.format("h:mm");
        const ampm = theMoment.format("a");
        const output = {day,month,date,year,time,ampm};
        
        return output;
    };

    const createVm = (config) => {
        const _vm = {
            el: '#dsa-cal-app',
            data: {
                calEvents: [],
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
                
                _vm.data.calEvents = theEvents
                    // all day events don't have a dateTime, so will screw up the chonological order- so if there's no dateTime, just use date
                    .map((e) => {
                        const hasStartTime = e.start.dateTime != undefined;
                        const startTime = (hasStartTime) ? e.start.dateTime : e.start.date;
                        
                        const hasEndTime = e.end.dateTime != undefined 
                        const endTime = (hasEndTime) ? e.end.dateTime : e.end.date;
                        
                        return {
                            ...e, 
                            hasStartTime,
                            hasEndTime,
                            prettyStartTime: getPrettyDate(startTime),
                            prettyEndTime: getPrettyDate(endTime),
                        };
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
