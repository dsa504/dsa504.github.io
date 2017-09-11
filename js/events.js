var mykey = 'AIzaSyAHAKS3oeDgnsknND2GVeCTiDgKqy7uMrw'; // sumthin like Gtg-rtZdsreUr_fLfhgPfgff
var calendarid = 'nbq9d5kvi60fj6m34ml77a6hdc@group.calendar.google.com'; // looks like nbq9d5kvi60fj6m34ml77a6hdc@group.calendar.google.com

var caldata = "";

new Vue({
    el: '#dsa-cal-app',
    data: {
        calevents: '',
        errors:''
    },
    methods: {
        getPrettyDate: function(uglydateTime){
            prettyPattern = "dddd, MMMM Do YYYY, h:mm a";
            
            if(uglydateTime == undefined){
                console.log("derp");
            }
            var theMoment = moment(uglydateTime);
            // this is maybe the not most rational way to do this <_<
            var day = theMoment.clone().format("dddd");
            var month = theMoment.clone().format("MMMM");
            var date = theMoment.clone().format("Do");
            var year = theMoment.clone().format("YYYY");
            var time = theMoment.clone().format("h:mm");
            var ampm = theMoment.clone().format("a");
            var output = [{day,month,date,year,time,ampm}];
            return output;
        }
    },
    mounted: function() {
        var th = this;
        var today = new Date();
        $.ajax({
            type: 'GET',
            url: encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + calendarid+ '/events?key=' + mykey +'&timeMin='+ today.toISOString()), //only get upcoming events
            dataType: 'json',
            success: function (response) {
                var theEvents = response.items;
                console.log(theEvents);

                // all day events don't have a dateTime, so will screw up the chonological order- so if there's no dateTime, just use date
                theEvents.forEach(function(event){
                    if(event.start.dateTime == undefined){
                        console.log("no dateTime for "+event.summary+", using date");
                        event.theStart = event.start.date;
                    } else {
                        event.theStart = event.start.dateTime;
                    }
                });
                
                theEvents.sort(function(a,b){ // sort to make sure the events are in chron order
                    a = new Date(a.theStart);
                    b = new Date(b.theStart);
                    return a<b ? -1 : a>b ? 1 : 0;}
                );
                
                th.calevents = theEvents;
            },
            error: function (response) {
                th.errors = "Derp. Something went wrong- if you're seeing this, please let us know on <a href='https://www.facebook.com/NewOrleansDSA/'>Facebook</a> or the <a href='https://twitter.com/neworleansdsa'>Twitters</a>!"; 
            }
        });
    }
    
})
