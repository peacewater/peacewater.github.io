var database = firebase.database(); //gets reference to database root
var query = database.ref().child('projects').child('raw-data').orderByChild('name');
var projects;
var project;
var i = 0;
var currentSolution = '';
var clicked;
var clickedId;


function getProjects() {
	/*
	database.ref('/projects').once('value', function(snapshot) {
		snapshot.forEach( (project) => {
			console.log(project);
			projectArray[i++] = project;
		});
	});*/

	query.once("value", function(snapshot) {
		projects = snapshot.val();
	});
}

//Slideshow logic- maybe relocate to it's own file if search page remains seperate
var slideIndex = [1,1,1];
var slideId = ["mySlides1", "mySlides2", "mySlides3"];

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  var i;
  var x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) {slideIndex[no] = 1}    
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex[no]-1].style.display = "block";  
}

//search logic
function search() {
	//The search() function will fire upon a search button click.
	//It will read the data currently input by the user, and will
	//update a table for the user to interact with.

	//retrieve all inputs to use
	var searchBar = document.getElementById('search-bar');
	var outcomeFilter = document.getElementById('outcome-filter'); //once this is changed to accomodate multiple i need to fix the logic here...
	var budgetFilter = document.getElementById('budget-filter');
	var techFilter = document.getElementById('tech-filter');
	var envFilter = document.getElementById('env-filter');
	var climateFilter = document.getElementById('climate-filter');
	//define search data structure based on above inputs
	var searchData = {
		searchString : '',
		outcome : '',//will need to change when switched to a checklist
		budget : '',
		tech : '',
		climate : '',
	};
	//fill in data to above structure
	searchData.searchString = searchBar.value;
	searchData.outcome = outcomeFilter.value;
	searchData.budget = budgetFilter.value;
	searchData.tech = techFilter.value;
	searchData.climate = climateFilter.value;

	//query the database
	//Currently just checks for matching words
	//Should eventually arrange based on budget, outcome, technical support, climate, and others
	getProjects();
	document.getElementById('result-table').style.visibility = 'visible';
	var data = document.querySelectorAll('tr');
	data.forEach( (datum) => {
		if(datum.id != 'header') {
			datum.remove();
		}
		document.getElementById('no-results-message').style.visibility = 'visible';
	});

	for(var project in projects) {
		if(document.getElementById(project) === null) {
			var newDiv = document.createElement('tr');
			newDiv.id = project;
			newDiv.className = 'search-result';
			var newName = document.createElement('td');
			newName.textContent = projects[project]['Project Name'];
			newName.className = 'project-name-link';
			newName.id = project;
			newName.addEventListener('click', pageLauncher);
			newDiv.appendChild(newName);
			var newDesc = document.createElement('td');
			newDesc.textContent = projects[project]['Description'];
			newDiv.appendChild(newDesc);
			var newOutcome = document.createElement('td');
			newOutcome.textContent = projects[project]['Please choose some of the desired outcomes'];
			newDiv.appendChild(newOutcome);
			var newBudget = document.createElement('td');
			newBudget.textContent = projects[project]['Planning budget'];
			newDiv.appendChild(newBudget);
			var newTech = document.createElement('td');
			newTech.textContent = projects[project]['Technical requirements of this project'];
			newDiv.appendChild(newTech);
			var newClimate = document.createElement('td');
			newClimate.textContent = projects[project]['Climate'];
			newDiv.appendChild(newClimate);
			
			//logic for search with only keyword use
			if(newName.textContent.toLowerCase().includes(searchData.searchString.toLowerCase()) || 
				newDesc.textContent.toLowerCase().includes(searchData.searchString.toLowerCase())) {	
				document.getElementById('result-container').appendChild(newDiv);
				document.getElementById('no-results-message').style.visibility = 'hidden';
			}
		}
	}
}

function allResultsLoader() {
	getProjects();
	document.getElementById('result-table').style.visibility = 'visible';

	for(var project in projects) {
		if(document.getElementById(project) === null) {
			var newDiv = document.createElement('tr');
			newDiv.id = project;
			newDiv.className = 'search-result';
			var newName = document.createElement('td');
			newName.textContent = projects[project]['Project Name'];
			newName.className = 'project-name-link';
			newName.id = project;
			newName.addEventListener('click', pageLauncher);
			newDiv.appendChild(newName);
			var newDesc = document.createElement('td');
			newDesc.textContent = projects[project]['Description'];
			newDiv.appendChild(newDesc);
			var newOutcome = document.createElement('td');
			newOutcome.textContent = projects[project]['Please choose some of the desired outcomes'];
			newDiv.appendChild(newOutcome);
			var newBudget = document.createElement('td');
			newBudget.textContent = projects[project]['Planning budget'];
			newDiv.appendChild(newBudget);
			var newTech = document.createElement('td');
			newTech.textContent = projects[project]['Technical requirements of this project'];
			newDiv.appendChild(newTech);
			var newClimate = document.createElement('td');
			newClimate.textContent = projects[project]['Climate'];
			newDiv.appendChild(newClimate);

			document.getElementById('result-container').appendChild(newDiv);
			
		}
	}
}

function pageLauncher(event) {
	clicked = event.currentTarget;
	clickedId = clicked.id;

	window.open('./result.html','_self',false);

	localStorage.setItem('project-id', clickedId);

	var project = {
		'Project Name': projects[clickedId]['Project Name'],
		'Description': projects[clickedId]['Description'],
		'Cost (USD)': projects[clickedId]['Cost (USD)'],
		'Technical requirements of this project': projects[clickedId]['Technical requirements of this project'],
		'Environmental impact': projects[clickedId]['Environmental impact'],
		'Please choose some of the desired outcomes': projects[clickedId]['Please choose some of the desired outcomes'],
		'Climate': projects[clickedId]['Climate'],
		'How long will the solution take to implement': projects[clickedId]['How long will the solution take to implement'],
		'Assembly process for solution implementation': projects[clickedId]['Assembly process for solution implementation'],
		'Source website(s)': projects[clickedId]['Source website(s)'],
	};

	localStorage.setItem('project', JSON.stringify(project));
}

function pageLoader() {
	clickedId = localStorage.getItem('project-id');
	project = JSON.parse(localStorage.getItem('project'));
	document.getElementById('project-name').textContent = project['Project Name'];
	document.getElementById('project-desciption').textContent = project['Description'];
	document.getElementById('cost').textContent = project['Cost (USD)'];
	document.getElementById('tech-requirements').textContent = project['Technical requirements of this project'];
	document.getElementById('env-impact').textContent = project['Environmental impact'];
	document.getElementById('outcomes').textContent = project['Please choose some of the desired outcomes'];
	document.getElementById('climate').textContent = project['Climate'];
	document.getElementById('steps-instructions').textContent = project['Assembly process for solution implementation'];
	document.getElementById('resources').textContent = project['Source website(s)'];
	for (var i = 1; i < 5; i++) {  
		var imageContainer1 = document.createElement('div');
		imageContainer1.classList.add('mySlides2', 'fade', 'slideShow');
		var imageContainer2 = document.createElement('div');
		imageContainer2.classList.add('mySlides3', 'fade', 'slideShow');
		var image1 = document.createElement('img');
		image1.classList.add('slide-image');
		var image2 = document.createElement('img');
		image2.classList.add('slide-image');
		image1.src = './images/' + clickedId + '/Other/other-' + i + '.jpg';
		image2.src = './images/' + clickedId + '/Schematics/schematic-' + i + '.jpg';
		image1.onerror = function() {
			this.onerror=null;
			this.src='./no-images-found.jpg';
		}
		image2.onerror = function() {
			this.onerror=null;
			this.src='./no-images-found.jpg';
		}
		imageContainer1.appendChild(image1);
		imageContainer2.appendChild(image2);
		document.querySelector('.slideshow-container.schematic').appendChild(imageContainer1);
		document.querySelector('.slideshow-container.project-images').appendChild(imageContainer2);
		var imageContainer01 = document.createElement('div');
		imageContainer01.classList.add('mySlides1', 'fade', 'slideShow');
		var imageContainer02 = document.createElement('div');
		imageContainer02.classList.add('mySlides1', 'fade', 'slideShow');
		var image01 = document.createElement('img');
		image01.classList.add('slide-image');
		var image02 = document.createElement('img');
		image02.classList.add('slide-image');
		image01.src = './images/' + clickedId + '/Other/other-' + i + '.jpg';
		image02.src = './images/' + clickedId + '/Schematics/schematic-' + i + '.jpg';
		image01.onerror = function() {
			this.onerror=null;
			this.src='./no-images-found.jpg';
		}
		image02.onerror = function() {
			this.onerror=null;
			this.src='./no-images-found.jpg';
		}
		imageContainer01.appendChild(image01);
		imageContainer02.appendChild(image02);
		
		document.querySelector('.slideshow-container.all-images').appendChild(imageContainer01);
		document.querySelector('.slideshow-container.all-images').appendChild(imageContainer02);
		showSlides(1, 0);
		showSlides(1, 1);
		showSlides(1, 2);
	}
}

getProjects();
var aboutUs = document.querySelector('#about-us-nav');
aboutUs.addEventListener('click', () => {
	window.open('./about-us.html','_self',false);
});
var documentation = document.querySelector('#documentation-nav');
documentation.addEventListener('click', () => {
	window.open('https://www.peacewater.link/');
});
var diagrams = document.querySelector('#diagrams-nav');
diagrams.addEventListener('click', () => {
	window.open('./diagrams.html','_self',false);
});
var resources = document.querySelector('#resources-nav');
resources.addEventListener('click', () => {
	window.open('./resources.html','_self',false);
});
var allSolutions = document.querySelector('#all-solutions-nav');
allSolutions.addEventListener('click', () => {
	window.open('./all-solutions.html','_self',false);
});

if( window.location.href.includes('all-solutions')) {
	query.once("value", function(snapshot) {
		projects = snapshot.val();
	}).then( () => { allResultsLoader(); } );
}
if( window.location.href.includes('result')) {
	getProjects();
	pageLoader();
}
if( window.location.href.includes('index')) {
var searchButton = document.getElementById('search-submit');
	searchButton.addEventListener('click', search);
	document.getElementById("search-bar").addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode && event.keyCode === 13 || event.key && 'Enter' === event.key) {
			document.getElementById("search-submit").click();
		}
	});
}
