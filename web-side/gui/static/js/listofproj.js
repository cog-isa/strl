function listOfProjScope($scope) {

	initScope();
	getProjects(); 
	
	// ---------------------------------
	// Ниже идет определение всех функций
	
	function initScope() 
	{
		$scope.getProjects = getProjects;
		$scope.createProject = createProject;
		$scope.editProject = editProject;
		$scope.deleteProject = deleteProject;
		$scope.getWorlds = getWorlds;
		$scope.createWorld = createWorld;	
		$scope.editWorld = editWorld;
		$scope.deleteWorld = deleteWorld;
		$scope.selectProject = selectProject;
		$scope.selectWorld = selectWorld;
		
		$scope.selectedPrjIndex = 0; // Индекс выделенного проекта в списке проектов
		$scope.selectedWorldIndex = 0; // Индекс выделенного мире в списке проектов
				
		$scope.projects = [		// список проектов 
			{id : 1, name : "Проект 1"},
			{id : 2, name : "Проект 2"},
			{id : 3, name : "Проект 3"}
		];			

		$scope.projectsToWorlds = [		// список миров по каждому проекту				
			[ {id : 1, name : "Мир 1_1", project_id : 1} ], // массив миров 1-го проекта
			[ {id : 2, name : "Мир 2_1", project_id : 2} ], // массив миров 2-го проекта 
			[ {id : 3, name : "Мир 3_1", project_id : 3} ]	// массив миров 3-го проекта 	
		];	
	}				
		
	function getProjects() =  {
		$.ajax('/api/projects', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json"			
        }).fail(function () {
			console.error("Ошибка получения списка проектов");
        }).done(function (result) {	
			//var oldSelectedPrjId = $scope.projects[$scope.selectedPrjIndex].id;
			$scope.projects = result;
			$scope.selectedPrjIndex = 0;			
			getWorlds($scope.selectedPrjIndex);			
        });	
			
	function createProject() =  {		
		$.ajax('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json",
			data: JSON.stringify({
                        "name": "Новый проект"
                    })
        }).fail(function () {
			console.error("Ошибка создания проекта");
        }).done(function (result) {			
			getProjects();            
        });		
	}
	
	function editProject(projIndex, newName) =  {		 
		$.ajax('/api/projects/' + $scope.projects[projIndex], {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json",
			data: JSON.stringify({
                        "name": newName
                    })
        }).fail(function () {
			console.error("Ошибка редактирования проекта");
        }).done(function (result) {			
			getProjects();            
        });		
	}
	
	function deleteProject(projIndex) =  {		 
		$.ajax('/api/projects/' + $scope.projects[projIndex], {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            dataType: "json"			
        }).fail(function () {
			console.error("Ошибка удаления проекта");
        }).done(function (result) {			
			getProjects();            
        });		
	}	
		
	function getWorlds(proj_index) {		
		$.ajax('/api/projects/' + proj_id + '/worlds', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            dataType: "json"
        }).fail(function () {
			console.error("Ошибка получения списка миров проекта");
        }).done(function (result) {			
			$scope.projectsToWorlds[proj_index] = worlds;
			$scope.$scan();            
        });	
		
	function createWorld(proj_index, name) =  {		
		$.ajax('/api/worlds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json",
			data: JSON.stringify({
				"name": name,
				"project_id": projects[proj_index].id
			})
        }).fail(function () {
			console.error("Ошибка создания мира");
        }).done(function (result) {			
			getWorlds(proj_index);
        });		
	}
	
	function editWorld(proj_index, world_index, newName) =  {		
		$.ajax('/api/worlds/' + $scope.projectsToWorlds[proj_index][world_index].id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json",
			data: JSON.stringify({
				"name": newName,
			})
        }).fail(function () {
			console.error("Ошибка редактирования мира");
        }).done(function (result) {			
			getWorlds(proj_index);
        });		
	}
	
	function deleteWorld(projIndex, worldIndex) =  {		 
		$.ajax('/api/worlds/' + $scope.projectsToWorlds[projIndex][worldIndex].id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            dataType: "json",
			data: ""
        }).fail(function () {
			console.error("Ошибка удаления мира");
        }).done(function (result) {			
			getWorlds(projIndex);
        });		
	}	
	
	function selectProject(index) = {
		$scope.selectedPrjIndex = index;
		$scope.selectedWorldIndex = 0;
		getWorlds(index);
	}
	
	function selectWorld(index) = {		
		$scope.selectedWorldIndex = index;
		$scope.scan();
	}
	
	/*
	function getProjectIndexById(proj_id) {		
		for (var i = 0; i < $scope.projects.length; i++) {
			if ($scope.projects[i].id == proj_id)
				return i;
		}
		
		console.error("Не найден проект с id = " + proj_id);
		
		return -1;
	}	
	*/	

    window.S = $scope;
}


