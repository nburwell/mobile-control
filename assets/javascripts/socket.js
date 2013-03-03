var SocketWrapper = Backbone.Model.extend( {
    defaults : {
        connected : false,
        socket    : null
    },

    connect: function() {
        if ( this.get('socket') && this.get('socket').readyState == 1 )
        {
            console.log( "Already connected" );
            return;
        }

        var url = 'ws://' + this.get( 'host' ) + ':' + this.get( 'port');
        var self = this;

        console.log( "Connecting to " + url );

        this.set( { socket : new WebSocket( url ) } );
        this.set( { connected : true } );

        this.get('socket').onmessage = function( msg ) {
            try
            {
                var response = JSON.parse( msg.data );
                console.log( response );
            }
            catch( ex )
            {
                self.trigger( "socket:parse_error", "Could not parse message from socket: " + msg.data );
                return;
            }

            if ( response.type == "Connect" )
            {
                self.trigger( "socket:connect", response['data'] );
            }
            else
            {
                self.trigger( "socket:message", response['type'], response['data'] );
            }
        };

        this.get('socket').onerror = function(evt) {
            self.set( { connected : false } );
            self.trigger( "socket:error" );
        };

        this.get('socket').onclose = function(evt) {
            self.set( { connected : false } );
            console.log( evt );
        }
    },

    disconnect: function() {
        if ( this.get('socket') )
        {
            this.get('socket').close();
            this.set( { connected : false } );
        }
    }
} );


var socket_wrapper;
