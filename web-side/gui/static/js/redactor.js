function mainScope($scope) {

    /* Получить ID мира из URL */

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

    // проверка на корректность url - должен содержать ID выбранного мира

    if (!getParameterByName("worldid"))
        console.log("URL НЕ СОДЕРЖИТ ID МИРА - НАДО ЗАБЛОКИРОВАТЬ ЭКРАН");

    else {
        $scope.world = {};
        $scope.world.id = getParameterByName("worldid");


        // Рисуем форму робота
        var carBody = new fabric.Rect({
            left: 260,
            top: 60,
            width: 50,
            height: 70
        });
        var carWheel1 = new fabric.Rect({
            left: 250,
            top: 40,
            width: 10,
            height: 40
        });
        var carWheel2 = new fabric.Rect({
            left: 310,
            top: 40,
            width: 10,
            height: 40
        });
        var carWheel3 = new fabric.Rect({
            left: 310,
            top: 110,
            width: 10,
            height: 40
        });
        var carWheel4 = new fabric.Rect({
            left: 250,
            top: 110,
            width: 10,
            height: 40
        });

        $scope.objectListByTypes = {};
        /** Словарь объектов на канвасе для быстрого доступа при моделировании. */
        $scope.canvasObjects = {};


        // запрос на получении имени проекта и мира

        $.ajax('/api/worlds/' + $scope.world.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json"
        }).fail(function () {
        }).done(function (result) {
            $scope.world.name = result.name;
            $scope.proj = {};
            $scope.proj.id = result.project_id;
            getProjName();
        });

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



        /* Запрос на получение списка типов объектов */

        $.ajax('/api/object_types', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json"
        }).fail(function () {

        }).done(function (result) {
            $scope.objectTypes = result;
            $scope.$scan();
        });


        /* Запрос на получение списка объектов */

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


        /* Сортируем список созданных объектов по типам */

        $scope.$watch( "objectTypes != undefined && listOfObject != undefined", function (val) {
            if ($scope.objectTypes && $scope.listOfObject) {
                for (var i = 0; i < $scope.listOfObject.length; i++) {      // бежим по списку объектов
                    var type;
                    for (var j = 0; j < $scope.objectTypes.length; j++) {       // бежим по списку типов объектов
                        if ($scope.objectTypes[j].children.length != 0) {
                            for (var k = 0; k < $scope.objectTypes[j].children.length; k++) {       // бежим по списку вложенных типов (если таковые есть)
                                if ($scope.objectTypes[j].children[k].id == $scope.listOfObject[i].type_id) {
                                    if (!$scope.objectListByTypes[$scope.objectTypes[j].id]) {
                                        $scope.objectListByTypes[$scope.objectTypes[j].id] = {};
                                        $scope.objectListByTypes[$scope.objectTypes[j].id].name = $scope.objectTypes[j].name;
                                        $scope.objectListByTypes[$scope.objectTypes[j].id].objects = [];
                                    }
                                    $scope.objectListByTypes[$scope.objectTypes[j].id].objects.push($scope.listOfObject[i]);
                                    type = $scope.objectListByTypes[$scope.objectTypes[j].id].name;
                                    drawObject($scope.listOfObject[i],type);
                                }
                            }
                        }
                        else if ($scope.objectTypes[j].id == $scope.listOfObject[i].type_id) {
                            if (!$scope.objectListByTypes[$scope.objectTypes[j].id]) {
                                $scope.objectListByTypes[$scope.objectTypes[j].id] = {};
                                $scope.objectListByTypes[$scope.objectTypes[j].id].name = $scope.objectTypes[j].name;
                                $scope.objectListByTypes[$scope.objectTypes[j].id].objects = [];
                            }
                            $scope.objectListByTypes[$scope.objectTypes[j].id].objects.push($scope.listOfObject[i]);
                            type = $scope.objectListByTypes[$scope.objectTypes[j].id].name;
                            drawObject($scope.listOfObject[i],type);
                        }
                    }
                    //drawObject($scope.listOfObject[i],type);
                }
            }
            $scope.$scan();
        });



        // Вывод объектов

        function drawObject(obj,type) {
            switch (type) {
                case 'Робот':
                    // Собираем робота
                    var car = new fabric.Group([carBody, carWheel1, carWheel2, carWheel3, carWheel4], {
                        id: obj.id,
                        type_id: obj.type_id,
                        name: obj.name,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        angle: obj.properties.angle,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    });
                    car.setScaleX(obj.properties.width/car.width);
                    car.setScaleY(obj.properties.height/car.height);

                    $scope.canvas.add(car);
                    $scope.canvasObjects[obj.id] = car;
                    $scope.canvas.renderAll();
                    break;

                case 'Стена':
                    var wall = new fabric.Rect({
                        id: obj.id,
                        type_id: obj.type_id,
                        name: obj.name,
                        height: +obj.properties.height,
                        width: +obj.properties.width,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        angle: obj.properties.angle,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    });
                    $scope.canvas.add(wall);
                    $scope.canvasObjects[obj.id] = wall;
                    $scope.canvas.renderAll();
                    break;

                case 'Маркер':
                    var marker = new fabric.Rect({
                        id: obj.id,
                        type_id: obj.type_id,
                        name: obj.name,
                        height: +obj.properties.height,
                        width: +obj.properties.width,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        angle: obj.properties.angle,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    });
                    $scope.canvas.add(marker);
                    $scope.canvasObjects[obj.id] = marker;
                    $scope.canvas.renderAll();
                    break;
            }
        }


        // Создание объектов

        $scope.createObject = function (obj,objChild) {
            if (obj.name != "Робот" || (obj.name == "Робот" && objChild)) {
                var setObj = {};
                (objChild) ? setObj = objChild : setObj = obj;
                setObj.type_id = setObj.id;
                setObj.angle = 0;
                setObj.left = 100;
                setObj.top = 50;
                console.log(setObj);
                switch (obj.name) {
                    case 'Робот':
                        setObj.height = 60;
                        setObj.width = 35;
                        if (objChild.name == "Робот, умеющий разрушать препятствия") {
                            setObj.fill = "#e91e63";
                        }
                        else {
                            setObj.fill = "#8bc34a";
                        }
                        break;
                    case 'Стена':
                        setObj.height = 15;
                        setObj.width = 225;
                        setObj.fill = "#e3e2de";
                        break;
                    case 'Маркер':
                        setObj.height = 15;
                        setObj.width = 15;
                        setObj.fill = "#F44336";
                        setObj.angle = 45;
                        break;
                }
            createObjectRequest(setObj, false, obj);
            }
        };


        function createObjectRequest(setObj,copy, obj) {
            console.log(setObj);
            if (!setObj.cacheHeight || !setObj.cacheWidth)  {
                setObj.cacheHeight = setObj.height;
                setObj.cacheWidth = setObj.width;
            }
            $.ajax('/api/objects', {
                method: 'POST',
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify({
                    //"name": setObj.name,
                    //TODO: Для роботов имена могут быть только на латинице. Пока делаем имена числами
                    "name": '' + +new Date(),
                    "type_id": setObj.type_id,
                    "world_id": +$scope.world.id,
                    "properties": {
                        "height": +setObj.cacheHeight,
                        "width": +setObj.cacheWidth,
                        "left": 100,
                        "top": 50,
                        "fill": setObj.fill,
                        "angle": setObj.angle
                    }
                })
            }).fail(function () {
            }).done(function (data) {
                if (copy) {
                    setObj.clone(function (o) {
                        var cloneObject = o;
                        if (cloneObject) {
                            cloneObject.set({
                                id: data.id,
                                type_id: setObj.type_id,
                                left: 150,
                                top: 150,
                                height: +setObj.height,
                                width: +setObj.width,
                                fill: setObj.fill
                            });
                            $scope.canvas.add(cloneObject);
                            //cloneObject.set("fill", setObj.fill);
                            $scope.canvas.renderAll();
                        } else {
                            alert("Объект для клонирования не выбран");
                        }
                    });
                }
                else {
                    switch (obj.name) {
                        case 'Робот':
                            // Собираем робота
                            $scope.car = new fabric.Group([carBody, carWheel1, carWheel2, carWheel3, carWheel4], {
                                id: data.id,
                                top: 150,
                                left: 150,
                                lockScalingX: true,
                                lockScalingY: true,
                                lockRotation: true
                            });
                            $scope.car.setScaleX(setObj.width / $scope.car.width);
                            $scope.car.setScaleY(setObj.height / $scope.car.height);

                            // Красим робота
                            if (setObj.name == "Робот, умеющий разрушать препятствия") {
                                $scope.car.set("fill", setObj.fill);
                                $scope.canvas.add($scope.car);
                            }
                            else {
                                $scope.car.set("fill", setObj.fill);
                                $scope.canvas.add($scope.car);
                            }
                            $scope.canvas.renderAll();
                            break;

                        case 'Стена':
                            var wall = new fabric.Rect({
                                id: data.id,
                                left: 150,
                                top: 150,
                                width: setObj.width,
                                height: setObj.height,
                                fill: setObj.fill
                            });
                            $scope.canvas.add(wall);
                            break;

                        case 'Маркер':
                            var marker = new fabric.Rect({
                                id: data.id,
                                left: 150,
                                top: 150,
                                width: setObj.width,
                                height: setObj.height,
                                angle: 45,
                                fill: setObj.fill
                            });
                            $scope.canvas.add(marker);
                            break;
                    }
                }

                $scope.$scan();
            });
        }



        // Записыавем изменения объекта и отсылаем на сервер

        $scope.createParam = function (key,val) {
            if ($scope.canvas.getActiveObject()) {
                var properties = {};
                properties[key] = val;
                var param = {"properties": properties};
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
                    if (!(activeObj._objects && (key == 'width' || key == 'height')))
                        activeObj.set(key, val);
                    else {
                        if (key == 'width') {
                            activeObj.setScaleX(+val/activeObj.width);
                        }
                        else {
                            activeObj.setScaleY(+val/activeObj.height);
                        }
                    }
                    $scope.canvas.renderAll();
                }
            });
        };






        /* CANVAS */

        $scope.createCanvas = function () {
            jQuery(document).ready(function () {
                // задаем жестко ширину, чтобы не растягивалась
                // почему width растягивается, а height - нет???
                // TODO: придумать альтернативу
                jQuery('#canvas-container').width(jQuery('#canvas-container').width());

                $scope.canvas = new fabric.Canvas('canvas');
                // 1 inch = 96 pixels (1000 х 1000 - в чем измеряется?)
                // при 96000 x 96000 элементы прекращают отображаться
                $scope.canvas.setWidth(9600);
                $scope.canvas.setHeight(9600);
                $scope.canvas.renderAll();
                $scope.canvas.objectCounter = {};
                $scope.canvas.objectCounter['group'] = 0;
            });
        };

        $scope.createCanvas();

        $scope.canvas.on('object:selected', function () {
            var obj = $scope.canvas.getActiveObject();
            $scope.activeObjWidth = +obj.getWidth();
            $scope.activeObjHeight = +obj.getHeight();
            $scope.activeObjColor = obj.fill;
            $scope.selectObjTop = obj.top;
            $scope.selectObjLeft = obj.left;
            $scope.$scan();
        });
        $scope.canvas.on('selection:cleared', function () {
            $scope.activeObjWidth = null;
            $scope.activeObjHeight = null;
            $scope.activeObjColor = null;
            $scope.$scan();

        });

        // Запись новых координат
        $scope.canvas.on('mouse:up', function (options) {
            if (options.target) {
                if ($scope.selectObjTop != options.target.top && $scope.selectObjLeft != options.target.left) {
                    var param = {
                        "properties": {
                            "left": options.target.left,
                            "top": options.target.top
                        }
                    };
                    $scope.saveObjProp(param);
                    $scope.selectObjTop = options.target.top;
                    $scope.selectObjLeft = options.target.left;
                }
           }
        });


        /* Управление объектами на canvas */

        $scope.editObject = function (actionType) {
            $scope.actionType = actionType;
            if ($scope.canvas.getActiveObject()) {
                switch (actionType) {
                    case 'del':
                        var activeObject = $scope.canvas.getActiveObject();
                        $.ajax('/api/objects/'+ activeObject.id, {
                            method: 'DELETE',
                            headers: {'Content-Type': 'application/json; charset=UTF-8'},
                            dataType: "json",
                            contentType: 'application/json; charset=UTF-8'
                        }).fail(function () {
                        }).done(function () {
                                $scope.canvas.remove(activeObject);
                        });
                        break;
                    case 'copy':
                        var selectObject = $scope.canvas.getActiveObject();
                        createObjectRequest(selectObject,true);
                        break;
                    case 'route':
                        var param = {"properties": {"angle": ($scope.canvas.getActiveObject().get('angle') + 90)}};
                        $scope.saveObjProp(param);

                        // TODO Перенести в done

                        var objAngle = $scope.canvas.getActiveObject().getAngle();
                        $scope.canvas.getActiveObject().setAngle(objAngle + 90);
                        $scope.canvas.renderAll();
                        break;
                }
            }
        };


        /* Моделирование */

        var ws = new WebSocket("ws://" + location.host + "/experiment-data");
        ws.onmessage = function(e){
            var data = JSON.parse(e.data);
            var objectDcs = data.objects;
            for (var i = 0, l = objectDcs.length; i < l; ++i) {
                var objectDc = objectDcs[i];
                $scope.canvasObjects[objectDc.id].set({
                    left: objectDc.properties.left,
                    top: objectDc.properties.top,
                    angle: objectDc.properties.angle
                });
                //objectsDc[objectDcs[i].id] = objectDcs[i];
            }
            console.log(data);
            $scope.canvas.renderAll();
        };

        $scope.startModeling = function () {
            $.ajax('/api/worlds/' + $scope.world.id + '/experiment/start', {
                method: 'POST'
            }).fail(function(){
               alert('Не удалось запустить моделирование')
            }).done(function(){
            });
        };

        $scope.stopModeling = function () {
            $.ajax('/api/worlds/' + $scope.world.id + '/experiment/stop', {
                method: 'POST'
            }).fail(function(){
               alert('Не удалось остановить моделирование')
            }).done(function(){
            });
        };
    }

    window.S = $scope;
}


