//This section demonstartes how to grab DOM Elements for manipulation
const form = document.getElementById('resourceForm');
const resourceList=document.getElementById("resourceList");
const counter=document.getElementById('counter');
const searchInput=document.querySelector('.search-input');
const filterButtons=document.querySelectorAll('.filter-btn');

//This section demonstrates how to handles state management in Javascript
let resources = JSON.parse(localStorage.getItem('resources')) || [];
let currentFilter = "all";
let searchTerm = '';

//This section demonstrates how we should intialize our Javascript application
function init(){
    renderResources();
    bindEvents();
    updateCounter();

};

// In this section we demonstrate how to bind events in JS

function bindEvents(){
    form.addEventListener('submit',handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    resourceList.addEventListener('click',handleResourceClick);
    filterButtons.forEach(btn=>{
        btn.addEventListener('click',handleFilter);
    });
}

//This section demonstrates how to handle events in JS
function handleFormSubmit(e){
    e.preventDefault();

const formData= new FormData(form);
const resource ={
    name: formData.get('resourceName').trim(),
    type: formData.get('resourceType'),
    location: formData.get('resourceLocation').trim(),
    id: Date.now().toString(),
    dateAdded: new Date().toLocaleDateString()
};
if(validateForm(resource)){
    addResource(resource);
    form.reset();
    clearErrors();
}
};

//This seection demonstrates how to implment form validation in JS
function validateForm(resource){
let isValid=true;
if(!resource.name){
    showError('nameError', 'Resource name is required');
    isValid=false;
}
if(!resource.type){
    showError('typeError', 'Resource type is required');
    isValid=false;
}
if(!resource.location){
    showError('locationError', 'Resource location is required');
    isValid=false;
}
return isValid;

}

function showError(elementId, message){
    const errorElement=document.getElementById(elementId);
    errorElement.textContent=message;
}
function clearErrors(){
    document.querySelectorAll('.error-message').forEach(el=>{
        el.textContent='';
    });
}

//This section demonstrates how we implment the functionality for rendering and filtering of resources.
function renderResources(){
    let filteredResources = filterResources(resources, currentFilter, searchTerm);
    resourceList.innerHTML = filteredResources.map(resource =>
        `
        <div class="resource-card" data-type="${resource.type}">
            <button class="delete-btn" data-id="${resource.id}">&times;</button>
            <h3>${resource.name}</h3>
            <p class="meta">
                <span class="type">${getTypeIcon(resource.type)} ${resource.type}</span>
                <span class="location"> 📍 Zone ${resource.location}</span>
            </p>
            <small>Added: ${resource.dateAdded}</small>
        </div>
        `
    ).join('');
}

function filterResources(resources, filterType, searchTerm){
    return resources.filter(resource => {
        const matchesFilter = filterType === "all" || resource.type.toLowerCase() === filterType.toLowerCase();
        const matchesSearch = !searchTerm ||
            resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.location.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });
}

// Handle search functionality
function handleSearch(e) {
    searchTerm = e.target.value;
    renderResources();
}

// Handle resource click events (delete)
function handleResourceClick(e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        resources = resources.filter(resource => resource.id !== id);
        saveToLocalStorage();
        renderResources();
        updateCounter();
    }
}

// Get icon based on resource type
function getTypeIcon(type) {
    const icons = {
        'equipment': '🔧',
        'personnel': '👤',
        'vehicle': '🚗',
        'building': '🏢',
        'supply': '📦'
    };
    return icons[type.toLowerCase()] || '📍';
}

// Update resource counter
function updateCounter() {
    counter.textContent = resources.length;
}

// Add new resource
function addResource(resource) {
    resources.push(resource);
    saveToLocalStorage();
    renderResources();
    updateCounter();
}

//This last section demonstrates how to integrate local storage functionality to our app
function saveToLocalStorage(){
    localStorage.setItem('resources', JSON.stringify(resources));
}

//Initialize the App
init();