var logger;

document.addEventListener('DOMContentLoaded',function() {
  logger = document.getElementById("output");
  log("Window loaded");

  run();
});

function log( message ) {
  console.log('log: ' + message );
  if ( logger )
  {
    logger.innerHTML = message + "\n";
  }
}
