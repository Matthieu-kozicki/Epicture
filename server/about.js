module.exports = {
   about: {
      customer:{
         host:"10.101.53.35"
      },
      server:{
         current_time: 1531680780,
         services:[
            {
               name: "currency",
               widgets:[
                  {
                     name:"currency",
                     description:"Display currency comparaisons between euro and parameter value",
                     params:[
                        {
                           name:"currency",
                           type:"string"
                        }
                     ]
                  }
               ]
            },
            {
               name:"imgur",
               widgets:[
                  {
                     name:"imgurprofile",
                     description:"Displays stats about a imgur user",
                     params:[
                        {
                           name:"user",
                           type:"string"
                        },
                     ]
                  },
                  {
                     name:"imgursearch",
                     description:"Displays search results",
                     params:[
                        {
                           name:"value",
                           type:"string"
                        },
                     ]
                  },
               ]
            },
            {
               name:"spotify",
               widgets:[
                  {
                     name:"spotifyartist",
                     description:"Displays stats an artist",
                     params:[
                        {
                           name:"artistId",
                           type:"string"
                        },
                     ]
                  },
                  {
                     name:"spotifyprofile",
                     description:"Displays stats about a user",
                     params:[
                        {
                           name:"profileId",
                           type:"string"
                        },
                     ]
                  },
                  {
                     name:"spotifytop",
                     description:"Displays a user top stats",
                     params:[
                        {
                           name:"typeParam",
                           type:"string"
                        },
                        {
                           name:"delayParam",
                           type:"string"
                        },
                     ]
                  }
               ]
            },
            {
               name:"weather",
               widgets: [
                  {
                     name:"weathercity",
                     description:"Displays meteo stats about a city",
                     params: [
                        {
                        name:"city",
                        type:"string"
                        }
                     ]
                  }
               ]
            },
            {
               name:"youtube",
               widgets: [
                  {
                     name:"ytbchannel",
                     description:"Displays stats about a channel",
                     params: [
                        {
                        name:"channelName",
                        type:"string"
                        }
                     ]
                  }
               ]
            },
         ]
      }
   }
}