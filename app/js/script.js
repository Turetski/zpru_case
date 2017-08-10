(function(){
    'use strict';
    var queryBase= "https://api.zp.ru/v1/vacancies/?period=today&is_new_only=true&geo_id=826&limit=",
        vacancies=[],
        limit = 50;
    function Counter(){
        var that = this;
        that.val={};
        that.add = function(value, description){
            if(!that.val[value]){
                that.val[value]={
                    count:1,
                    description:description
                }
            }
            else {
                that.val[value].count++;
            }
        }
        that.toSortedArray = function(){
            var result=[], i =0;
            for(var item in that.val){
                i=0;
                while(i < result.length && result[i].count>that.val[item].count) i++;
                result.splice(i,0,that.val[item]);
            }
            return result;
        }
    }
    function printTop(arr) {
        var table = document.createElement('table'),
            row, td;
        //packLink.classList.add("app-packages__face");
        for(var i = 0; i < arr.length; i++){
            row = document.createElement('tr');
            td = document.createElement('td');
            td.innerText=arr[i].description;
            row.appendChild(td);
            td = document.createElement('td');
            td.innerText=arr[i].count;
            row.appendChild(td);
            table.appendChild(row);
        }
        document.body.appendChild(table);
//        packName.innerHTML=$$.escapeHTML(package.name);
    }
    function makeReport(){
        var topRubric = new Counter();
        for(var i=0; i<vacancies.length; i++)
            for(var j=0; j<vacancies[i].rubrics.length; j++){
                topRubric.add(vacancies[i].rubrics[j].id,vacancies[i].rubrics[j].title)
            }
        printTop(topRubric.toSortedArray());
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