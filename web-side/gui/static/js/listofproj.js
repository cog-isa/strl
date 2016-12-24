function listOfProjScope($scope) {
	
	console.log("Вошли в listOfProjScope");
	
	// *********************************************
	// Забиваем модель фейковыми данными
	//
	$scope.projects =
	[
	{id : 1, name : "Проект 1"},
	{id : 2, name : "Проект 2"},
	{id : 3, name : "Проект 3"}
	];
	
	// Индекс выделенного проекта
	$scope.selectedPrjIndex = 0;
	
	// список миров по каждому проекту
	$scope.projectsToWorlds =
	[
	{id : 1, world : {id : 1, name : "Мир 1", project_id : 1} },
	{id : 2, world : {id : 2, name : "Мир 2", project_id : 2} },
	{id : 3, world : {id : 3, name : "Мир 3", project_id : 3} }
	];	
	
	//***************************************    
	
	
	
	/*
	$scope.getProjectIndexById(proj_id)
	{		
		for (var i = 0; i < projects.length; i++) {
			if (projects[i].id == proj_id)
				return i;
		}
		
		console.error("Не найден проект с id = " + proj_id);
		
		return -1;
	}*/
	
	
	// получить список всех проектов
	$.ajax('/api/projects', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json"
        }).fail(function () {
			console.error("Ошибка получения списка проектов");
        }).done(function (result) {
			$scope.selectedPrjIndex = 0;
            $scope.projects = result;
			if ($scope.projects.length)
            $scope.$scan();
        });
		
	// получить список всех миров заданного проекта
	$.ajax('/api/projects/' + $scope.projects[$scope.selectedPrjIndex].id + '/worlds', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json"
        }).fail(function () {
			console.error("Ошибка получения списка миров проекта " + $scope.projects[$scope.selectedPrjIndex]);
        }).done(function (result) {
            $scope.projectsToWorlds[$scope.selectedPrjIndex] = result;
            $scope.$scan();
        });
	
	

    window.S = $scope;
}


