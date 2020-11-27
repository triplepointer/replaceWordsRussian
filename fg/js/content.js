(function(){
    var s = document.createElement('script');
    // TODO: add "script.js" to web_accessible_resources in manifest.json
    s.src = chrome.runtime.getURL('lib/findAndReplaceDOMText.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
    class Replacer {
        constructor() {
            this.elements = document.getElementsByTagName('*');
        }
    
        replaceWords(word, synonym) {
            findAndReplaceDOMText(document.body, {
                find: word,
                replace: synonym
                }
              );
        }
    }

    let replacer = new Replacer();
    chrome.storage.local.get("variable", function (data) {
        var getdata=data.variable
        // document.write(typeof getdata);
            getdata.forEach((el, index) => {
                replacer.replaceWords(el.word_1, el.word_2);
                // document.write(el[word_1], el[word_2]);
            }
        )
    chrome.storage.local.remove("variable");// this is optional
    });    
})()