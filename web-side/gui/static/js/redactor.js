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
        $scope.worldID = getParameterByName("worldid");


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

        $.ajax('/api/worlds/'+$scope.worldID+'/objects', {
            method: 'GET',
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json"
        }).fail(function () {
            console.error("Нет мира с ID "+$scope.worldID);
        }).done(function (result) {
            $scope.listOfObject = result;
            $scope.$scan();
        });


        /* Сортируем список созданных объектов по типам */

        $scope.$watch( "objectTypes != undefined && listOfObject != undefined", function (val) {
            if ($scope.objectTypes && $scope.listOfObject) {
                for (var i = 0; i < $scope.listOfObject.length; i++) {
                    var type;
                    for (var j = 0; j < $scope.objectTypes.length; j++) {
                        if ($scope.objectTypes[j].children.length != 0) {
                            for (var k = 0; k < $scope.objectTypes[j].children.length; k++) {
                                if ($scope.objectTypes[j].children[k].id == $scope.listOfObject[i].type_id) {
                                    if (!$scope.objectListByTypes[$scope.objectTypes[j].id]) {
                                        $scope.objectListByTypes[$scope.objectTypes[j].id] = {};
                                        $scope.objectListByTypes[$scope.objectTypes[j].id].name = $scope.objectTypes[j].name;
                                        $scope.objectListByTypes[$scope.objectTypes[j].id].objects = [];
                                        type = $scope.objectListByTypes[$scope.objectTypes[j].id].name;
                                    }
                                    $scope.objectListByTypes[$scope.objectTypes[j].id].objects.push($scope.listOfObject[i]);
                                }
                            }
                        }
                    }
                    drawObject($scope.listOfObject[i],type);
                }
            }
            $scope.$scan();
        });

        // Вывод объектов
        function drawObject(obj,type) {
            console.log(obj);
            switch (type) {
                case 'Робот':
                    // Собираем робота
                    $scope.car = new fabric.Group([carBody, carWheel1, carWheel2, carWheel3, carWheel4], {
                        id: obj.id,
                        height: obj.properties.height,
                        width: obj.properties.width,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    });

                    $scope.canvas.add($scope.car);
                    $scope.canvas.clear().renderAll();
                    break;

                case 'Стена':
                    var wall = new fabric.Rect({
                        id: obj.id,
                        height: obj.properties.height,
                        width: obj.properties.width,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    });
                    $scope.canvas.add(wall);
                    break;

                case 'Маркер':
                    var marker = new fabric.Rect({
                        id: obj.id,
                        height: obj.properties.height,
                        width: obj.properties.width,
                        top: obj.properties.top,
                        left: obj.properties.left,
                        fill: obj.properties.fill,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    });
                    $scope.canvas.add(marker);
                    break;
            }
        };


        // Создание объектов

        $scope.createObject = function (obj,objChild) {
            if (obj.name != "Робот" || (obj.name == "Робот" && objChild)) {
                var setObj = {}, color = '';
                (obj == "Робот") ? setObj = objChild : setObj = obj;
                switch (obj.name) {
                    case 'Робот':
                        setObj = objChild;
                        if (objChild.name == "Робот, умеющий разрушать препятствия") {
                            color = "#e91e63";
                        }
                        else {
                            color = "#8bc34a";
                        }
                        break;
                    case 'Стена':
                        setObj = obj;
                        color = "#e3e2de";
                        break;
                    case 'Маркер':
                        setObj = obj;
                        color = "#F44336";
                        break;
                }
                $.ajax('/api/objects', {
                    method: 'POST',
                    dataType: "json",
                    contentType: 'application/json; charset=UTF-8',
                    data: JSON.stringify({
                        "name": setObj.name,
                        "type_id": setObj.id,
                        "world_id": +$scope.worldID,
                        "properties": {
                            "height": 111,
                            "width": 71,
                            "left": 500,
                            "top": 500,
                            "fill":color
                        }
                    })
                }).fail(function () {
                }).done(function (data) {
                    switch (obj.name) {
                        case 'Робот':

                            // Собираем робота
                            $scope.car = new fabric.Group([carBody, carWheel1, carWheel2, carWheel3, carWheel4], {
                                id: data.id,
                                lockScalingX: true,
                                lockScalingY: true,
                                lockRotation: true,
                                top: 300,
                                left: 300
                            });

                            // Красим робота
                            if (objChild.name == "Робот, умеющий разрушать препятствия") {
                                $scope.car.set("fill", color);
                                $scope.canvas.add($scope.car);
                            }
                            else {
                                $scope.car.set("fill", color);
                                $scope.canvas.add($scope.car);
                            }
                            $scope.canvas.renderAll();
                            break;

                        case 'Стена':
                            var wall = new fabric.Rect({
                                id: data.id,
                                left: 100,
                                top: 50,
                                width: 100,
                                height: 20,
                                fill: color
                            });
                            $scope.canvas.add(wall);
                            break;

                        case 'Маркер':
                            var marker = new fabric.Rect({
                                id: data.id,
                                left: 100,
                                top: 50,
                                width: 20,
                                height: 20,
                                angle: 45,
                                fill: color
                            });
                            $scope.canvas.add(marker);
                            break;
                    }
                });
                $scope.$scan();
            }
        };

        // Записыавем изменения объекта и отсылаем на сервер

        /*$scope.$watch('#objHeight', function (val) { saveObjProp(val, 'height'); });
        $scope.$watch('#objWidth', function (val) { saveObjProp(val, 'width'); });
        $scope.$watch('#objColor', function (val) { saveObjProp(val, 'color'); });*/
        $scope.saveObjProp = function(key,val) {
            var activeObj = $scope.canvas.getActiveObject();
            var properties = {};
            properties[key] = val;
            $.ajax('/api/objects/'+ activeObj.id, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json",
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
                "properties": properties
            })
        }).fail(function () {
        }).done(function () {
                activeObj.set(properties);
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
            $scope.activeObjWidth = obj.getWidth();
            $scope.activeObjHeight = obj.getHeight();
            $scope.activeObjColor = obj.fill;
            $scope.$scan();
        });
        /* Управление объектами на canvas */

        $scope.editObject = function (actionType) {
            $scope.actionType = actionType;
            if ($scope.canvas.getActiveObject()) {
                switch (actionType) {
                    case 'del':
                        var activeObject = $scope.canvas.getActiveObject();
                        $scope.canvas.remove(activeObject);
                        break;
                    case 'copy':
                        var selectObject = $scope.canvas.getActiveObject();
                        selectObject.clone(function (o) {
                            var cloneObject = o;
                            if (cloneObject) {
                                cloneObject.set({
                                    left: 150,
                                    top: 150
                                });
                                $scope.canvas.add(cloneObject);
                                cloneObject.set('fill', '#000');
                                //cloneObject.set('width', 60);
                                $scope.canvas.renderAll();
                                $scope.canvas.calcOffset();
                            } else {
                                alert("Объект для клонирования не выбран");
                            }
                        });
                        break;
                    case 'route':
                        $scope.canvas.getActiveObject().set('angle', ($scope.canvas.getActiveObject().get('angle') + 90));
                        $scope.canvas.renderAll();
                        break;
                }
            }
        };
    }

    window.S = $scope;
}


