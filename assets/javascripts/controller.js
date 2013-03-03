var socket_wrapper;
var motion = {};
var lastLogged = new Date();


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

window.addEventListener('devicemotion', function (e) {
  motion.x = e.accelerationIncludingGravity.x;
  motion.y = -e.accelerationIncludingGravity.y;

  if ( lastLogged < (new Date()) - 1000 )
  {
    log(motion.x * -(40/7) + ", " + motion.x + ", " + motion.y);
    lastLogged = new Date();

    socket_wrapper.get('socket').send( motion.y );
  }
});

