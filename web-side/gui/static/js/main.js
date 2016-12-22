function mainScope($scope) {
    (function($){
        $(window).on("load",function(){

            $(".overflow-list").mCustomScrollbar({
                theme: "dark-2",
                mouseWheel:{
                    deltaFactor: 9
                }
            });

        });


        // Добавить свернуть/развернуть список для слоев

    })(jQuery);


    $scope.test = 10;
    /***/
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

       /* for(var i = 0; i < $scope.objectTypes.length; i++) {
            var objectName = $scope.objectTypes[i].name;
            switch (objectName) {
                case 'Робот':
                    $scope.objectRobot = $scope.objectTypes[i];
                    break;
                case 'Стена':
                    $scope.objectWall = $scope.objectTypes[i];
                    break;
                case 'Маркер':
                    $scope.objectMarker = $scope.objectTypes[i];
                    break;
            }
        }*/

    });



    $scope.createCanvas = function () {
         jQuery( document ).ready(function() {
                jQuery('#canvas').attr({
                    'width': jQuery('#canvas-container').width(),
                    'height': jQuery('#canvas-container').height()
                });
                // отрисовку элементов на канвас надо вынести в отдельную функцию и уже ее вызывать.
                // + добавить resize

                $scope.canvas = new fabric.Canvas('canvas');
                $scope.canvas.on('object:selected', function(){
                    var obj = $scope.canvas.getActiveObject();
                    $scope.activeObjWidth = obj.getWidth();
                    $scope.activeObjWidth =obj.getHeight();
                });
                $scope.canvas.objectCounter = {};
                $scope.canvas.objectCounter['group'] = 0;

              /*  var greenWall = new fabric.Rect({
                    left: 200,
                    top: 10,
                    fill: '#92d050',
                    width: 200,
                    height: 20
                });

                var wall1 = new fabric.Rect({
                    left: 400,
                    top: 10,
                    fill: '#d3d3ab',
                    width: 20,
                    height: 200
                });

                var wall2 = new fabric.Rect({
                    left: 130,
                    top: 230,
                    fill: '#d3d3ab',
                    width: 340,
                    height: 20
                });

                var wall3 = new fabric.Rect({
                    left: 20,
                    top: 230,
                    fill: '#d3d3ab',
                    width: 90,
                    height: 20
                });

                var wall4 = new fabric.Rect({
                    left: 200,
                    top: 10,
                    fill: '#d3d3ab',
                    width: 20,
                    height: 220
                });

                var walls = new fabric.Group([greenWall, wall1, wall2, wall3, wall4], {
                    // left: 260,
                    //top: 60,

                });*/

                var redCarBody = new fabric.Rect({
                    left: 260,
                    top: 60,
                    width: 50,
                    height: 70
                });

                var redCarWheel1 = new fabric.Rect({
                    left: 250,
                    top: 40,
                    width: 10,
                    height: 40
                });

                var redCarWheel2 = new fabric.Rect({
                    left: 310,
                    top: 40,
                    width: 10,
                    height: 40
                });

                var redCarWheel3 = new fabric.Rect({
                    left: 310,
                    top: 110,
                    width: 10,
                    height: 40
                });

                var redCarWheel4 = new fabric.Rect({
                    left: 250,
                    top: 110,
                    width: 10,
                    height: 40
                });

                $scope.redCar = new fabric.Group([redCarBody, redCarWheel1, redCarWheel2, redCarWheel3, redCarWheel4], {
                    // left: 260,
                    //top: 60,
                    id: 'id-' + $scope.canvas.objectCounter['group']++,
                    fill: '#d99690',
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true
                    //selectable: false

                });
                //console.log(redCar.id);

               /* var topGreenCarBody = new fabric.Rect({
                    left: 50,
                    top: 60,
                    width: 50,
                    height: 70
                });

                var topGreenWheel1 = new fabric.Rect({
                    left: 40,
                    top: 40,
                    width: 10,
                    height: 40
                });

                var topGreenWheel2 = new fabric.Rect({
                    left: 100,
                    top: 40,
                    width: 10,
                    height: 40
                });

                var topGreenWheel3 = new fabric.Rect({
                    left: 100,
                    top: 110,
                    width: 10,
                    height: 40
                });

                var topGreenWheel4 = new fabric.Rect({
                    left: 40,
                    top: 110,
                    width: 10,
                    height: 40
                });

                var topGreenCar = new fabric.Group([topGreenCarBody, topGreenWheel1, topGreenWheel2, topGreenWheel3, topGreenWheel4], {
                    // left: 260,
                    // top: 60,
                    fill: '#d3d3ab'
                });

                var bottomGreenCarBody = new fabric.Rect({
                    left: 90,
                    top: 280,
                    width: 50,
                    height: 70
                });

                var bottomGreenWheel1 = new fabric.Rect({
                    left: 80,
                    top: 260,
                    width: 10,
                    height: 40
                });

                var bottomGreenWheel2 = new fabric.Rect({
                    left: 140,
                    top: 260,
                    width: 10,
                    height: 40
                });

                var bottomGreenWheel3 = new fabric.Rect({
                    left: 140,
                    top: 330,
                    width: 10,
                    height: 40
                });

                var bottomGreenWheel4 = new fabric.Rect({
                    left: 80,
                    top: 330,
                    width: 10,
                    height: 40
                });

                var bottomGreenCar = new fabric.Group([bottomGreenCarBody, bottomGreenWheel1, bottomGreenWheel2, bottomGreenWheel3, bottomGreenWheel4], {
                    //left: 260,
                    // top: 60,
                    fill: '#d99690',
                });

                var rhombus = new fabric.Rect({
                    left: 350,
                    top: 180,
                    fill: '#bfcfe2',
                    width: 30,
                    height: 30,
                    angle: 45
                });*/

                $scope.canvas.add($scope.redCar);
            });
    };

    $scope.createCanvas();

    $scope.editObject = function (actionType) {
        //var activeObject = e.target;
        $scope.actionType = actionType;
        //$scope.redCar.on('selected',function () {
        if($scope.canvas.getActiveObject()) {
            switch (actionType) {
                case 'move':
                    $scope.canvas.getActiveObject().set('lockMovementX', false);
                    $scope.canvas.getActiveObject().set('lockMovementY', false);
                    break;
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
                            cloneObject.set('width', 60);
                            $scope.canvas.renderAll();
                            $scope.canvas.calcOffset();
                        } else {
                            alert("Объект для клонирования не выбран");
                        }
                    });
                    break;
                case 'route':
                    console.log('повернуть');
                    $scope.canvas.getActiveObject().set('angle', ($scope.canvas.getActiveObject().get('angle') + 90));
                    break;
                case 'choose':
                    $scope.canvas.getActiveObject().set('selectable', true);
                    break;
            }
        };
            //console.log('выполнилось');
        //});
        console.log('click');
    };



    $scope.selectObject = function () {

    };

    window.S = $scope;
};


