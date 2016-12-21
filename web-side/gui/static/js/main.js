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

    $scope.createCanvas = function () {
         jQuery( document ).ready(function() {
                jQuery('#canvas').attr({
                    'width': jQuery('#canvas-container').width(),
                    'height': jQuery('#canvas-container').height()
                });
                // отрисовку элементов на канвас надо вынести в отдельную функцию и уже ее вызывать.
                // + добавить resize

                $scope.canvas = new fabric.Canvas('canvas');
                $scope.canvas.objectCounter = {};
                $scope.canvas.objectCounter['group'] = 0;

                var greenWall = new fabric.Rect({
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

                });

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
                    fill: '#d3d3ab',
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true
                    //selectable: false

                });
                //console.log(redCar.id);

                var topGreenCarBody = new fabric.Rect({
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
                });

                $scope.canvas.add(walls, $scope.redCar, topGreenCar, bottomGreenCar, rhombus);
            });
    };

    $scope.createCanvas();

    $scope.editObject = function (actionType) {
        $scope.actionType = actionType;
        //$scope.redCar.on('selected',function () {
        if($scope.canvas.getActiveObject()) {
            switch (actionType) {
                case 'move':
                    $scope.canvas.getActiveObject().set('lockMovementX', false);
                    $scope.canvas.getActiveObject().set('lockMovementY', false);
                    break;
                case 'del':
                    $scope.redCar.remove();
                    break;
                case 'copy':
                    var x = $scope.redCar;
                    var object = fabric.util.x.clone($scope.canvas.getActiveObject());
                    object.set("top", object.top + 5);
                    object.set("left", object.left + 5);
                    $scope.canvas.add(object);
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


