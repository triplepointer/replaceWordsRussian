// Predefined conditions
var data = null;
var chooseFile = 0;
var chooseUrl = 0;
var url = '';
var dataUrl = null;

// Get the saved values
chrome.storage.sync.get('data', function(innerData) {
  data = innerData.data;
});
chrome.storage.sync.get('dataUrl', function(innerDataUrl) {
  dataUrl = innerDataUrl.dataUrl;
});
var chooseFileNode = document.querySelector('#choose-file');
chrome.storage.sync.get( "chooseFile", function(innerChooseFile) {
  chooseFile = innerChooseFile.chooseFile;
  chooseFileNode.checked = chooseFile;
});
var chooseUrlNode = document.querySelector('#choose-url');
chrome.storage.sync.get( "chooseUrl", function(innerChooseUrl) {
  chooseUrl = innerChooseUrl.chooseUrl;
  chooseUrlNode.checked = chooseUrl;
});
var fileIsAlreadyChosenNode = document.querySelector('#file-is-already-choosed');
chrome.storage.sync.get("fileIsAlreadyChosen",function(innerfileIsAlreadyChosen) {
  if(innerfileIsAlreadyChosen.fileIsAlreadyChosen == undefined) {
    return;
  }
  fileIsAlreadyChosenNode.innerHTML = innerfileIsAlreadyChosen.fileIsAlreadyChosen
});
var urlNode = document.querySelector('#JSON-dictionary-url');
chrome.storage.sync.get("url", function(innerUrl) {
  urlNode.value = innerUrl.url;
}
);

// Functions
function IsJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}
  function readBlob() {

    let files = document.getElementById('JSON-dictionary').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
    let file = files[0];
    let reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      if(IsJsonString(evt.target.result)) {
        data = (JSON.parse(evt.target.result));
        document.querySelector('#file-is-already-choosed').innerHTML = "файл "+ file.name +" уже был выбран, можете выбрать новый";
        }
        else {
          alert("Это не тот формат!");
        }
    }
  }

    reader.readAsText(file);
  }

  function getDataFromUrl(url) {
    $.get( url, function( data ) {
      dataUrl = JSON.parse(data); // HTML content of the jQuery.ajax page
    });
    }

// When the user finishes selecting a file, read the file as text
  document.querySelector('#JSON-dictionary').addEventListener('change', function() {
      readBlob();
  });

// When the user finishes typing an url to the input
  document.querySelector('#confirm-url').addEventListener('click', function() {
    url = document.querySelector('#JSON-dictionary-url').value;
    getDataFromUrl(url);
  });

// Determine what method is used to get a dictionary
  document.querySelector('#choose-file').addEventListener('click', function() {
    chooseFile = 1;
    chooseUrl = 0;
  });
  document.querySelector('#choose-url').addEventListener('click', function() {
    chooseFile = 0;
    chooseUrl = 1;
  })

  document.querySelector('#activate-replacing').addEventListener(
    'click', function() {
      if(chooseFile && data === null) {
        alert('Please select a file or wait!');
        return;
      }
      if(chooseUrl && document.querySelector('#JSON-dictionary-url').value.length === 0){
        alert('Please enter an url or wait!');
        return;
      }
      if(chooseFile && data !== null) {
        chrome.storage.local.set({ variable: data }, function () {
          chrome.tabs.executeScript({
                file: "fg/js/content.js"
          });
          });
      }
      else if(chooseUrl && dataUrl !== null) {
        chrome.storage.local.set({ variable: dataUrl }, function () {
          chrome.tabs.executeScript({
                file: "fg/js/content.js"
          });
          });
      }
    }
  );
  document.querySelector('#save-settings').addEventListener(
    'click', function() {
      chooseFile = document.querySelector('#choose-file').checked;
      chrome.storage.sync.set({ "chooseFile" : chooseFile }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      });
      chooseUrl = document.querySelector('#choose-url').checked;
      chrome.storage.sync.set({ "chooseUrl" : chooseUrl }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      });
      chrome.storage.sync.set({ "data" : data }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      });
      chrome.storage.sync.set({"dataUrl": dataUrl}, function() {
        if(chrome.runtime.error) {
          console.log("Runtime error");
        }
      })
      var fileIsAlreadyChosen = document.querySelector('#file-is-already-choosed').innerHTML;
      chrome.storage.sync.set({ "fileIsAlreadyChosen" : fileIsAlreadyChosen }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        }
      })
      chrome.storage.sync.set({ "url" : url }, function() {
           if (chrome.runtime.error) {
             console.log("Runtime error.");
          }
      });
    }
  )