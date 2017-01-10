function mainScope($scope) {

    /** Получить ID мира из URL */

    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /** Флаг, находимся ли мы на странице моделирования или редактора */
    var isModeling = window.location.pathname.indexOf('modeling') >= 0;

    /** проверка на корректность url - должен содержать ID выбранного мира */

    if (!getParameterByName("worldid"))
        console.log("URL НЕ СОДЕРЖИТ ID МИРА - НАДО ЗАБЛОКИРОВАТЬ ЭКРАН");

    // иначе выводим данные

    else {
        var objDefault = {};            // параметры объектов по умолчанию
        $scope.world = {};                                  // переменная, содержащая данные о мире
        $scope.world.id = getParameterByName("worldid");


        // Рисуем форму робота
        var carBody = new fabric.Rect({
            left: 5,
            top: 7,
            width: 25,
            height: 35
        });
        var carWheel1 = new fabric.Rect({
            left: 0,
            top: 0,
            width: 5,
            height: 14
        });
        var carWheel2 = new fabric.Rect({
            left: 30,
            top: 0,
            width: 5,
            height: 14
        });
        var carWheel3 = new fabric.Rect({
            left: 0,
            top: 35,
            width: 5,
            height: 14
        });
        var carWheel4 = new fabric.Rect({
            left: 30,
            top: 35,
            width: 5,
            height: 14
        });

        $scope.objectListByTypes = {};              // объекты, отфильтрованные по типам

        /** Словарь объектов на канвасе для быстрого доступа при моделировании. */
        $scope.canvasObjects = {};

        /** Текущая временная отсечка процесса моделирования. */
        $scope.modelingTime = 0;



        /** запрос на получении имени мира */

        $.ajax('/api/worlds/' + $scope.world.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json"
        }).fail(function (e) {
            if (e.status === 401)
				window.location = '/login.html';
        }).done(function (result) {
            $scope.world.name = result.name;
            $scope.proj = {};                   // переменная, содержащая данные о проекте
            $scope.proj.id = result.project_id;
            getProjName();
        });

        /** запрос на получении имени проекта */

        function getProjName() {
            $.ajax('/api/projects/' + $scope.proj.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                dataType: "json"
            }).fail(function () {
            }).done(function (result) {
                $scope.proj.name = result.name;
                $scope.$scan();
            });
        }



        /** Запрос на получение списка типов объектов */

        $.ajax('/api/object_types', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json"
        })
            .fail(function () {})
            .done(function (result) {
            $scope.objectTypes = result;

            // Заполняем переменную для создания новых объектов дефолтными данными
            for (var i = 0; i < $scope.objectTypes.length; i++) {
                if ($scope.objectTypes[i].children.length != 0) {
                    for (var j = 0; j < $scope.objectTypes[i].children.length; j++) {
                        objDefault[$scope.objectTypes[i].children[j].id] = {};
                        objDefault[$scope.objectTypes[i].children[j].id].properties = {};
                        objDefault[$scope.objectTypes[i].children[j].id].type_id = $scope.objectTypes[i].children[j].id;
                        objDefault[$scope.objectTypes[i].children[j].id].name = 'new';
                        objDefault[$scope.objectTypes[i].children[j].id].properties.height = 50;
                        objDefault[$scope.objectTypes[i].children[j].id].properties.width = 35;
                        objDefault[$scope.objectTypes[i].children[j].id].properties.top = 150;
                        objDefault[$scope.objectTypes[i].children[j].id].properties.left = 150;
                        objDefault[$scope.objectTypes[i].children[j].id].properties.angle = 0;

                        // определяем цвет в зависимости от типа робота
                        switch ($scope.objectTypes[i].children[j].id) {
                            case 4:
                                objDefault[$scope.objectTypes[i].children[j].id].properties.fill = "#e91e63";
                                break;
                            case 5:
                                objDefault[$scope.objectTypes[i].children[j].id].properties.fill = "#8bc34a";
                                break;
                        }
                    }
                }

                // дефолтные данные для маркера или стены
                else {
                    objDefault[$scope.objectTypes[i].id] = {};
                    objDefault[$scope.objectTypes[i].id].properties = {};
                    objDefault[$scope.objectTypes[i].id].type_id = $scope.objectTypes[i].id;
                    objDefault[$scope.objectTypes[i].id].name = 'new';
                    objDefault[$scope.objectTypes[i].id].properties.top = 150;
                    objDefault[$scope.objectTypes[i].id].properties.left = 150;

                    // определяем параметры в зависимости от того, маркер или стена
                    switch ($scope.objectTypes[i].id) {
                        // стена
                        case 2:
                            objDefault[$scope.objectTypes[i].id].properties.height = 225;
                            objDefault[$scope.objectTypes[i].id].properties.width = 15;
                            objDefault[$scope.objectTypes[i].id].properties.fill = "#e3e2de";
                            objDefault[$scope.objectTypes[i].id].properties.angle = 0;
                            break;
                        // маркер
                        case 3:
                            objDefault[$scope.objectTypes[i].id].properties.height = 15;
                            objDefault[$scope.objectTypes[i].id].properties.width = 15;
                            objDefault[$scope.objectTypes[i].id].properties.fill = "#f44336";
                            objDefault[$scope.objectTypes[i].id].properties.angle = 45;
                            break;
                    }
                }
            }
            $scope.$scan();
        });



        /** Запрос на получение списка объектов */

        $.ajax('/api/worlds/'+$scope.world.id+'/objects', {
            method: 'GET',
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json"
        }).fail(function () {
            console.error("Нет мира с ID "+$scope.world.id);
        }).done(function (result) {
            $scope.listOfObject = result;
            $scope.$scan();
        });



        /** Сортируем список созданных объектов по типам и отрисовываем на канвас */

        $scope.$watch( "objectTypes != undefined && listOfObject != undefined", function (val) {
            if ($scope.objectTypes && $scope.listOfObject) {                // проверяем, что данные есть
                for (var i = 0; i < $scope.listOfObject.length; i++) {      // бежим по списку объектов
                    var type;
                    for (var j = 0; j < $scope.objectTypes.length; j++) {       // бежим по списку типов объектов

                        // если у объекта есть дочерние элементы (роботы)
                        if ($scope.objectTypes[j].children.length != 0) {
                            for (var k = 0; k < $scope.objectTypes[j].children.length; k++) {       // бежим по списку вложенных типов (если таковые есть)
                                if ($scope.objectTypes[j].children[k].id == $scope.listOfObject[i].type_id) {
                                    // если не создан объект с ключом id
                                    if (!$scope.objectListByTypes[$scope.objectTypes[j].id]) {
                                        $scope.objectListByTypes[$scope.objectTypes[j].id] = {};
                                        $scope.objectListByTypes[$scope.objectTypes[j].id].name = $scope.objectTypes[j].name;   // имя типа
                                        $scope.objectListByTypes[$scope.objectTypes[j].id].objects = [];
                                    }
                                    $scope.objectListByTypes[$scope.objectTypes[j].id].objects.push($scope.listOfObject[i]);    // записываем объект по типу
                                    type = $scope.objectListByTypes[$scope.objectTypes[j].id].name;                             // тип
                                    // вызываем функцию только в том случае, если есть совпадение по типу
                                    drawObject($scope.listOfObject[i].id, $scope.listOfObject[i]);                              // рисуем на канвас объект
                                }
                            }
                        }

                        // если это маркер или стена
                        else if ($scope.objectTypes[j].id == $scope.listOfObject[i].type_id) {
                            // если не создан объект с ключом id
                            if (!$scope.objectListByTypes[$scope.objectTypes[j].id]) {
                                $scope.objectListByTypes[$scope.objectTypes[j].id] = {};
                                $scope.objectListByTypes[$scope.objectTypes[j].id].name = $scope.objectTypes[j].name;   // имя типа
                                $scope.objectListByTypes[$scope.objectTypes[j].id].objects = [];
                            }
                            $scope.objectListByTypes[$scope.objectTypes[j].id].objects.push($scope.listOfObject[i]);    // записываем объект по типу
                            type = $scope.objectListByTypes[$scope.objectTypes[j].id].name;
                            drawObject($scope.listOfObject[i].id, $scope.listOfObject[i]);                              // рисуем на канвас объект
                        }
                    }
                }
            }
            $scope.$scan();
        });




        /** создание канваса */

        //$scope.createCanvas = function () {
            jQuery(document).ready(function () {
                // TODO: задаем жестко ширину, чтобы не растягивалось
                // TODO: почему width растягивается по контенту, а height - по высоте родителя (flex)???
                jQuery('#canvas-container').width(jQuery('#canvas-container').width());

                $scope.canvas = new fabric.Canvas('canvas');
                $scope.canvas.setWidth(9600);
                $scope.canvas.setHeight(9600);
                $scope.canvas.renderAll();
                $scope.canvas.objectCounter = {};
                $scope.canvas.objectCounter['group'] = 0;

                if (isModeling) {
                    $scope.canvas.selection = false;
                }
            });
        //};



        // Вывод объектов

        function drawObject(id, obj) {
            // TODO: Катя и Марина Ёповы! Переменные в JS именуются через camel - ипать его в сраку - case!!!  (drawObj)
            // TODO: Привыкайте к нормальному кодестайлу.
            var drawobj;
            switch (obj.type_id) {
                case 4:
                case 5:
                    // Собираем робота
                    drawobj = new fabric.Group([carBody, carWheel1, carWheel2, carWheel3, carWheel4], {
                        id: id,
                        type_id: obj.type_id,
                        name: obj.name,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        angle: obj.properties.angle
                    });
                    drawobj.setScaleX(obj.properties.width / drawobj.width);
                    drawobj.setScaleY(obj.properties.height / drawobj.height);
                    break;

                case 2:
                    drawobj = new fabric.Rect({
                        id: id,
                        type_id: obj.type_id,
                        name: obj.name,
                        height: +obj.properties.height,
                        width: +obj.properties.width,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        angle: obj.properties.angle
                    });
                    break;

                case 3:
                    drawobj = new fabric.Rect({
                        id: id,
                        type_id: obj.type_id,
                        name: obj.name,
                        height: +obj.properties.height,
                        width: +obj.properties.width,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        angle: obj.properties.angle
                    });
                    break;
            }
            if (isModeling) {
                drawobj.selectable = false;
            }
            $scope.canvas.add(drawobj);
            $scope.canvasObjects[id] = drawobj;
            $scope.canvas.renderAll();
        }


        /** Создание объекта */

        $scope.createObject = function (obj) {

            // если копируем
            if (obj.copy) {
                var setObj = obj;
            }
            // если создаем новый
            else {
                var setObj = objDefault[obj.id];
            }

            if (setObj) {
                $.ajax('/api/objects', {
                    method: 'POST',
                    dataType: "json",
                    contentType: 'application/json; charset=UTF-8',
                    data: JSON.stringify({
                        //TODO: Для роботов имена могут быть только на латинице. Пока делаем имена числами
                        "name": setObj.name,
                        "type_id": setObj.type_id,
                        "world_id": +$scope.world.id,
                        "properties": {
                            "height": +setObj.properties.height,
                            "width": +setObj.properties.width,
                            "left": +setObj.properties.left,
                            "top": +setObj.properties.top,
                            "fill": setObj.properties.fill,
                            "angle": setObj.properties.angle
                        }
                    })
                }).fail(function () {
                    alert('не удалось создать объект');
                }).done(function (data) {
                    drawObject(data.id, setObj);
                    $scope.$scan();
                });
            }
        };









        //  - !!! -   ВОТ ЗДЕСЬ НАЧИНАЕТСЯ ДИЧЬ, КОТОРУЮ НАДО ПЕРЕПИСАТЬ   - !!! -




        // заполняем инпуты данными выделенной фигуры
        $scope.canvas.on('object:selected', function () {
            var obj = $scope.canvas.getActiveObject();
            $scope.activeObjWidth = +obj.getWidth();
            $scope.activeObjHeight = +obj.getHeight();
            $scope.activeObjColor = obj.fill;
            $scope.$scan();
        });

        // очищаем инпуты после снятия выделения
        $scope.canvas.on('selection:cleared', function () {
            $scope.activeObjWidth = null;
            $scope.activeObjHeight = null;
            $scope.activeObjColor = null;
            $scope.$scan();
        });

        // объект изменен прямо на канвасе
        $scope.canvas.on('object:modified', function (options) {
            $scope.activeObjWidth = +options.target.getWidth();      // Отобразить ширину в инпуте
            $scope.activeObjHeight = +options.target.getHeight();    // Отобразить высоту в инпуте

            var param = {
                "properties": {
                    "left": options.target.left,
                    "top": options.target.top,
                    "angle": options.target.angle,
                    "width": +options.target.getWidth(),
                    "height": +options.target.getHeight()
                }
            };
            $scope.saveObjProp(param);
            $scope.$scan();
        });



        // Записыавем изменения объекта и отсылаем на сервер

        $scope.createParam = function (key,val) {
            if ($scope.canvas.getActiveObject()) {
                var properties = {};
                properties[key] = val;
                var param = {"properties": properties};
                if ($scope.canvas.getActiveObject())
                    $scope.saveObjProp(param,key,val);
            }
        };

        $scope.saveObjProp = function(param,key,val) {
            var activeObj = $scope.canvas.getActiveObject();

            $.ajax('/api/objects/'+ activeObj.id, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json; charset=UTF-8'},
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(param)
            }).fail(function () {
            }).done(function (data) {
                if (key && val) {
                    if (!(activeObj._objects && (key == 'width' || key == 'height'))) {
                        activeObj.set(key, val);
                    }
                    else {
                        if (key == 'width') {
                            activeObj.setScaleX(+val/activeObj.width);
                        }
                        else {
                            activeObj.setScaleY(+val/activeObj.height);
                        }
                    }
                }
                activeObj.set("fill", activeObj.fill);
                $scope.canvas.renderAll();
            });
        };




        /* Управление объектами на canvas */

        $scope.editObject = function (actionType) {
            $scope.actionType = actionType;
            var selectObject = $scope.canvas.getActiveObject();
            if (selectObject) {
                switch (actionType) {

                    // удалить объект
                    case 'del':
                        $.ajax('/api/objects/'+ selectObject.id, {
                            method: 'DELETE',
                            headers: {'Content-Type': 'application/json; charset=UTF-8'},
                            dataType: "json",
                            contentType: 'application/json; charset=UTF-8'
                        }).fail(function () {
                        }).done(function () {
                                $scope.canvas.remove(selectObject);
                        });
                        break;

                    // скопировать объект
                    case 'copy':
                        var obj = {};
                        obj.name = selectObject.name;
                        obj.type_id = selectObject.type_id;
                        obj.properties = {};
                        obj.properties.height = selectObject.cacheHeight;
                        obj.properties.width = selectObject.cacheWidth;
                        obj.properties.left = selectObject.left + 10 + selectObject.cacheWidth;
                        obj.properties.top = selectObject.top + 10;
                        obj.properties.fill = selectObject.fill;
                        obj.properties.angle = selectObject.angle;
                        obj.copy = true;
                        $scope.createObject(obj);
                        break;
                }
            }
        };







        /* Моделирование */

        /*
        if (isModeling) {
            var ws = new WebSocket("ws://" + location.host + "/experiment-data");
            ws.onmessage = function (e) {
                var data = JSON.parse(e.data);
                console.log(data.objects);
                var objectDcs = data.objects;
                for (var i = 0, l = objectDcs.length; i < l; ++i) {
                    var objectDc = objectDcs[i];
                    $scope.canvasObjects[objectDc.id].set({
                        left: objectDc.properties.left,
                        top: objectDc.properties.top,
                        angle: objectDc.properties.angle
                    });
                }
                $scope.modelingTime = data.time;
                $scope.$scan();
                $scope.canvas.renderAll();
            };
        }
        */

        $scope.intervalId = null;

        $scope.startModeling = function () {
            $.ajax('/api/worlds/' + $scope.world.id + '/experiment/start', {
                method: 'POST'
            }).fail(function(){
               alert('Не удалось запустить моделирование')
            }).done(function(){
                $scope.intervalId = setInterval(function(){
                    $.ajax('/api/worlds/' + $scope.world.id + '/experiment/data', {
                        method: 'GET',
                        dataType: 'json'
                    }).fail(function(e){
                        console.error(e);
                    }).done(function(items){
                        //var data = JSON.parse(e.data);
                        for (var i = 0, l = items.length; i < l; ++i) {
                            var data = items[i];
                            //if (!data) return;
                            //console.log(data.objects);
                            var objectDcs = data.objects;
                            for (var i = 0, l = objectDcs.length; i < l; ++i) {
                                var objectDc = objectDcs[i];
                                $scope.canvasObjects[objectDc.id].set({
                                    left: objectDc.properties.left,
                                    top: objectDc.properties.top,
                                    angle: objectDc.properties.angle
                                });
                            }
                            $scope.modelingTime = data.time;
                            $scope.$scan();
                            $scope.canvas.renderAll();
                        }
                    });
                }, 200);
            });
        };

        $scope.stopModeling = function () {
            $.ajax('/api/worlds/' + $scope.world.id + '/experiment/stop', {
                method: 'POST'
            }).fail(function(){
               alert('Не удалось остановить моделирование')
            }).done(function(){
                if ($scope.intervalId != null)
                    clearInterval($scope.intervalId);
            });
        };
    }

    window.S = $scope;
}


