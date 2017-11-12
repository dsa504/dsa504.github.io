//import Vue from "vue";
// import moment from "moment";
import {} from "babel-polyfill";

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
                showErrors: false,
            },
            methods: {
                
            },
            //showErrors:false,
            mounted: async () => {
                const today = moment(new Date());
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
                        
                        const prettyStartTime = getPrettyDate(startTime);
                        const prettyEndTime = getPrettyDate(endTime);

                        return {
                            ...e, 
                            startTime, 
                            endTime, 
                            hasStartTime, 
                            hasEndTime, 
                            prettyStartTime, 
                            prettyEndTime, 
                        };
                    })
                    // sort to make sure the events are in chron order
                    .sort((x,y) => { 
                        const a = new Date(x.startTime);
                        const b = new Date(y.startTime);
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