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
                    for (var j = 0; j < $scope.objectTypes.length; j++) {
                        if ($scope.objectTypes[j].children.length != 0) {
                            for (var k = 0; k < $scope.objectTypes[j].children.length; k++) {
                                if ($scope.objectTypes[j].children[k].id == $scope.listOfObject[i].type_id) {
                                    if (!$scope.objectListByTypes[$scope.objectTypes[j].id]) {
                                        $scope.objectListByTypes[$scope.objectTypes[j].id] = {};
                                        $scope.objectListByTypes[$scope.objectTypes[j].id].name = $scope.objectTypes[j].name;
                                        $scope.objectListByTypes[$scope.objectTypes[j].id].objects = [];
                                    }
                                    $scope.objectListByTypes[$scope.objectTypes[j].id].objects.push($scope.listOfObject[i]);
                                }
                            }
                        }
                    }
                }
            }
        });





        $scope.createObject = function (obj,objChild) {
            $.ajax('/api/objects', {
            method: 'POST',
            dataType: "json",
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
                "name": objChild.name,
                "type_id": objChild.id,
                "world_id": +$scope.worldID,
                "properties": {
                    "height":111,
                    "width": 71,
                    "left": 100,
                    "top": 150
                }
            })
        }).fail(function () {
        }).done(function () {
               switch (obj.name) {
               case 'Робот':
                    if(objChild.name == "Робот, умеющий разрушать препятствия") {
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

                    $scope.car = new fabric.Group([carBody, carWheel1, carWheel2, carWheel3, carWheel4], {
                        id: 'id-' + $scope.canvas.objectCounter['group']++,
                        fill: '#e91e63',
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true
                    });
                    $scope.canvas.add($scope.car);
                    }
                    else {
                        $scope.car.set("fill", "#8bc34a");
                        $scope.canvas.add($scope.car);
                        $scope.canvas.renderAll();
                    }

                    break;
                case 'Стена':
                     $scope.wall = new fabric.Rect({
                        left: 100,
                        top: 50,
                        width: 100,
                        height: 20,
                        fill: '#e3e2de'
                    });
                    $scope.canvas.add($scope.wall);
                    break;
                case 'Маркер':
                    $scope.marker = new fabric.Rect({
                        left: 100,
                        top: 50,
                        width: 20,
                        height: 20,
                        angle: 45,
                        fill:'#F44336;'
                    });
                    $scope.canvas.add($scope.marker);
                    break;
                }
            });
            $scope.$scan();
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


