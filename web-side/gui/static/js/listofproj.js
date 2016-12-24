function listOfProjScope($scope) {
	
	console.log("Вошли в listOfProjScope");	

	$scope.getAllProjects = getAllProjects;	
	$scope.getProjectWorlds = getProjectWorlds;
	$scope.createProject = createProject;
	$scope.getProjectIndexById = getProjectIndexById;	
	
	initFakeStrucs(); // создать структуры даннных с фейковыми данными	
	
	getAllProjects();
	
	// ---------------------------------
	// Ниже идет определение всех функций
		
	function initFakeStrucs() // Забить модель фейковыми данными
	{			
		$scope.selectedPrjIndex = 0; // Индекс выделенного проекта в списке проектов
				
		$scope.projects = // список проектов
		[
		{id : 1, name : "Проект 1"},
		{id : 2, name : "Проект 2"},
		{id : 3, name : "Проект 3"}
		];			

		$scope.projectsToWorlds = // список миров по каждому проекту
		[
		{id : 1, world : {id : 1, name : "Мир 1", project_id : 1} },
		{id : 2, world : {id : 2, name : "Мир 2", project_id : 2} },
		{id : 3, world : {id : 3, name : "Мир 3", project_id : 3} }
		];	
	}
			
	function createProject() =  {		
		$.ajax('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json",
			data: JSON.stringify({
                        "name": "Динамически новый проект"
                    })
        }).fail(function () {
			console.error("Ошибка получения списка проектов");
        }).done(function (result) {			
			var abc = result;
            $scope.$scan();
        });
		
		$scope.$scan();
	}
			
	function getProjectIndexById(proj_id) {		
		for (var i = 0; i < $scope.projects.length; i++) {
			if ($scope.projects[i].id == proj_id)
				return i;
		}
		
		console.error("Не найден проект с id = " + proj_id);
		
		return -1;
	}	
	
	// получить список всех проектов
	function getProjects() =  {
		$.ajax('/api/projects', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json"			
        }).fail(function () {
			console.error("Ошибка получения списка проектов");
        }).done(function (result) {	
			//var oldSelectedPrjId = $scope.projects[$scope.selectedPrjIndex].id;
			$scope.projects = result;
			$scope.selectedPrjIndex = 0;
			$scope.getProjectWorlds($scope.projects[$scope.selectedPrjIndex].id);
			$scope.$scan();
        });		
		
	// получить список всех миров заданного проекта
	function getProjectWorlds (proj_id) {		
		$.ajax('/api/projects/' + proj_id + '/worlds', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            dataType: "json"
        }).fail(function () {
			console.error("Ошибка получения списка миров проекта " + proj_id);
        }).done(function (result) {			
			$scope.projectsToWorlds[getProjectIndexById(proj_id)] = worlds;
			$scope.$scan();
            updateProjectWorlds(, result)
        });	

	// установить список миров в проект
	function updateProjectWorlds(proj_index, worlds){
		
	}

    window.S = $scope;
}


