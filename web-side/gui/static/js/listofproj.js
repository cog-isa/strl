function listOfProjScope($scope) {

	initScope();
	getProjects(); 
	
	// ---------------------------------
	// Ниже идет определение всех функций
	
	function initScope() {
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
		
		$scope.selectedPrj; // Индекс выделенного проекта в списке проектов
		$scope.selectedWorld; // Индекс выделенного мире в списке проектов
				
		$scope.projects = [		// список проектов 
			{id : 1, name : "Проект 1"},
			{id : 2, name : "Проект 2"},
			{id : 3, name : "Проект 3"}
		];

		$scope.worlds = [ // список миров		
			{id : 1, name : "Мир 1_1", project_id : 1}, 
			{id : 2, name : "Мир 2_1", project_id : 2}, 
			{id : 3, name : "Мир 3_1", project_id : 3}
		];	
	}				
		
	function getProjects() {
		$.ajax('/api/projects', {
            method: 'GET',
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json"			
        }).fail(function () {
			console.error("Ошибка получения списка проектов");
			$scope.$scan();
        }).done(function (result) {		
			$scope.projects = result;
			$scope.selectedPrj = null;
			$scope.worlds = [];			
			$scope.$scan();
        });			
	}
			
	function createProject() {		
		$.ajax('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json",
			data: JSON.stringify({
                        "name": "Новый проект"
                    })
        }).fail(function () {
			console.error("Ошибка создания проекта");
			getProjects();
        }).done(function (result) {			
			getProjects();
        });					
	}
	
	function editProject(proj) {
		var name = prompt('Новое название проекта:');
		if (name == null || !name.trim())
			return;
		$.ajax('/api/projects/' + proj.id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},
			data: JSON.stringify({
				"name": name.trim()
			})
        }).fail(function () {
			console.error("Ошибка редактирования проекта");
			getProjects();
        }).done(function (result) {			
			getProjects();
        });
	}
	
	function deleteProject(proj) {		 
		$.ajax('/api/projects/' + proj.id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            dataType: "json"			
        }).fail(function () {
			console.error("Ошибка удаления проекта");
			getProjects();
        }).done(function (result) {			
			getProjects();
        });			
	}	
		
	function getWorlds(proj_id) {		
		$.ajax('/api/projects/' + proj_id + '/worlds', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            dataType: "json"
        }).fail(function () {
			console.error("Ошибка получения списка миров проекта");
			$scope.$scan();
        }).done(function (result) {			
			$scope.worlds = result;	
			$scope.$scan();
        });				
	}
		
	function createWorld(proj) {		
		$.ajax('/api/worlds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},
            dataType: "json",
			data: JSON.stringify({
				"name": "Новый мир",
				"project_id": proj.id
			})
        }).fail(function () {
			console.error("Ошибка создания мира");
			getWorlds(proj.id);
        }).done(function (result) {			
			getWorlds(proj.id);
        });			
	}
	
	function editWorld(world) {
		var name = prompt('Новое название мира:');
		if (name == null || !name.trim())
			return;
		$.ajax('/api/worlds/' + world.id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json; charset=UTF-8'},            
			data: JSON.stringify({
				"name": name.trim()
			})
        }).fail(function () {
			console.error("Ошибка редактирования мира");
			getWorlds(world.project_id);
        }).done(function (result) {			
			getWorlds(world.project_id);
        });			
	}
	
	function deleteWorld(world) {		 
		$.ajax('/api/worlds/' + world.id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            dataType: "json",
			data: ""
        }).fail(function () {
			console.error("Ошибка удаления мира");
			getWorlds(world.project_id);
        }).done(function (result) {			
			getWorlds(world.project_id);
        });			
	}	
	
	function selectProject(proj) {
		$scope.selectedPrj = proj;
		$scope.selectedWorld = null;
		getWorlds(proj.id);
	}
	
	function selectWorld(world) {		
		$scope.selectedWorld = world;
		$scope.$scan();
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


