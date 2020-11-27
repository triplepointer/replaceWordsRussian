(function(){
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
                // document.write(el.word_1);
                replacer.replaceWords(el.word_1, el.word_2);
                // document.write(el[word_1], el[word_2]);
            }
        )
    chrome.storage.local.remove("variable");// this is optional
    });    
})()