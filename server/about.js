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
            }
         ]
      }
   }
}