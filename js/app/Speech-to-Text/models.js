exports.getModels = function(token) {
  var viewContext = {
    currentModel: 'en-US_BroadbandModel',
    models: null,
    token: token,
    bufferSize: BUFFERSIZE
  };
  var modelUrl = 'https://stream.watsonplatform.net/speech-to-text/api/v1/models';
  var sttRequest = new XMLHttpRequest();
  sttRequest.open('GET', modelUrl, true);
  sttRequest.withCredentials = true;
  sttRequest.setRequestHeader('Accept', 'application/json');
  sttRequest.setRequestHeader('X-Watson-Authorization-Token', token);
  sttRequest.onload = function() {
    var response = JSON.parse(sttRequest.responseText);
    var sorted = response.models.sort(function(a,b) {
    if(a.name > b.name) {
      return 1;
    }
    if( a.name < b.name) {
      return -1;
    }
    return 0;
    });
    response.models=sorted;
    localStorage.setItem('models', JSON.stringify(response.models));
  };
  sttRequest.send();
};
