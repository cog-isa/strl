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

                $scope.canvas.add($scope.redCar);
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
                            alert("Sorry Object Not Initialized");
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


