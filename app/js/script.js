(function(){
    'use strict';
    var queryBase= "git&limit=",
        vacancies=[],
        limit = 50;

    function escapeHTML(unsafe){
        unsafe ="".concat(unsafe);
        return unsafe.replace(/[&<>"']/g, function(m) {
            switch (m) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';  
            case '"':
                return '&quot;';
            default:
                return '&#039;';
            }
        })
    }

    function Counter(){
        var that = this;
        that.val={};
        that.add = function(value){
            if(!that.val[value]){
                that.val[value] = 1;
            }
            else {
                that.val[value]++;
            }
        }
        that.toSortedArray = function(){
            var result=[], i =0;
            for(var item in that.val){
                i=0;
                while(i < result.length && result[i].count>that.val[item]) i++;
                result.splice(i,0,{count: that.val[item], description:item});
            }
            return result;
        }
    }

    function printTop(arr, desc) {
        var table = document.createElement('table'),
            row, td;
        for(var i = 0; i < arr.length; i++){
            row = document.createElement('tr');
            td = document.createElement('td');
            td.innerText=escapeHTML(arr[i].description);
            row.appendChild(td);
            td = document.createElement('td');
            td.innerText=escapeHTML(arr[i].count);
            row.appendChild(td);
            table.appendChild(row);
        }
        row = document.createElement('h2');
        row.innerText="Топ " + desc;
        document.body.appendChild(row);
        document.body.appendChild(table);
    }

    function makeReport(){
        var rubrics = new Counter(),
            words = new Counter(),
            temp;
        for(var i=0; i<vacancies.length; i++){
            for(var j=0; j<vacancies[i].rubrics.length; j++){
                rubrics.add(vacancies[i].rubrics[j].title)
            }
            temp=vacancies[i].header.match(/[а-яА-Яё0-9]+\-[а-яА-Яё0-9]+|[а-яА-Яё0-9]+/g);
            for(j=0; j<temp.length;j++){
                words.add(temp[j].toLowerCase());
            }
        }
        printTop(rubrics.toSortedArray(),"рубрик");
        printTop(words.toSortedArray(), "слов");
    }

    function loadData(url){
        return new Promise (function(resolve, reject){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);    
            xhr.onload = function(e){
                if(xhr.status !== 200) return reject("Не удалось загрузить данные с сервера");
                if (!xhr.responseText) return reject("Ответ от сервера пустой");
                try{
                    resolve(JSON.parse(xhr.responseText));
                } catch(e){
                    reject("Получены некорректные данные");
                }
            }
            xhr.onerror = function(e){return reject("LoadError")}
            xhr.send();
        })
    }

    function loadVacancies(offset){
        loadData(queryBase.concat(limit,"&offset=",offset)).then(
            function (result){ 
                var meta = result.metadata.resultset;
                vacancies=vacancies.concat(result.vacancies);
                if(meta.limit+meta.offset < meta.count){
                    loadVacancies(offset+limit);
                }
                else{
                    makeReport();
                }
            },
            function (error){
                console.log(error);
            }
        );
    }

    loadVacancies(0);
})();