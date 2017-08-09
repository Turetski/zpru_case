(function(){
    'use strict';
    var queryBase= "https://api.zp.ru/v1/vacancies/?period=today&is_new_only=true&geo_id=826&limit=",
        vacancies=[],
        limit = 50;

    function formReport(){
        console.log(vacancies);
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
                    formReport();
                }
            },
            function (error){
                console.log(error);
            }
        );
    }
    loadVacancies(0);
})();