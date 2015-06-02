module.exports = {

    undefinedError : {
        log:true,
        humanReadable: 'Unresolved error code',
        sendToClient: {
            code:500
        }
    },

    invalidAttrs : {
        log:true,
        humanReadable: 'Invalid attributes passed',
        sendToClient: {
            code:400,
            data:'err.details'
        }
    },

    fourZeroFour : {
        log:false,
        humanReadable: 'The requested resource does not exist',
        sendToClient: {
            code:404
        }
    },

    noMockData : {
        log: true,
        humanReadable: 'There is no mock data available for this route yet',
        sendToClient: {
            code: 404,
            data:'There is no mock data available for this route yet'
        }
    },

    underDevelopment : {
        log: false,
        humanReadable: 'A call to a route under development has been made',
        sendToClient:{
            code:501,
            data:'This route is currently under development'
        }
    }
}
