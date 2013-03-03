function run()
{
    socket_wrapper = new SocketWrapper( { host : location.hostname, port : 8080 } );
    socket_wrapper.connect();

    socket_wrapper.bind('socket:message', function( type, data ){
        console.log( "got the message: " + type );
        if ( data ) {
            document.getElementById("tilt").innerHTML = data * 10;
        }
    });

};
