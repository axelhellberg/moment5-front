'use strict'
// DOM element variables
const courseTable = document.getElementById('course-table');
const addBtn = document.getElementById('add-course');
const updateBtn = document.getElementById('update-course');
const codeInput = document.getElementById('code');
const nameInput = document.getElementById('name');
const progInput = document.getElementById('prog');
const urlInput = document.getElementById('url');

let updateId = null; // temp id variable

window.onload = getCourses; // get courses on load

// event listeners for update and add buttons
addBtn.addEventListener('click', addCourse);
updateBtn.addEventListener('click', updateCourse);

function getCourses() { // function for getting all courses
    courseTable.innerHTML = // create row of table head elements
    `<tr>
        <th>Code</th>
        <th>Name</th>
        <th>Progression</th>
        <th>Syllabus (URL)</th>
        <th></th>
    </tr>`;

    fetch('http://axelhellberg.se/courses/api') // fetch courses
        .then(response => response.json())
        .then(result => {
            result.forEach(course => { // print each course in a row, use id for delete and get button
                courseTable.innerHTML += 
                `<tr>
                    <td>${course.code}</td>
                    <td>${course.name}</td>
                    <td>${course.progress}</td>
                    <td><a href='${course.syllabus}' target='blank'>Link</a></td>
                    <td>
                        <button onClick='deleteCourse(${course.id})'>Delete</button>
                        <button onClick='getCourse(${course.id})'>Get</button>
                    </td>
                </tr>`
            })
        })
        .catch(error => {
            console.log('Error: ', error);
        });
}

function getCourse(id) { // get specific course values into form
    fetch(`http://axelhellberg.se/courses/api?id=${id}`)
        .then(response => response.json())
        .then(result => {
            updateId = result.id;
            codeInput.value = result.code;
            nameInput.value = result.name;
            progInput.value = result.progress;
            urlInput.value = result.syllabus;
        })
        .catch(error => {
            console.log('Error: ', error);
        });
}

function deleteCourse(id) { // delete specific course with id from get button
    fetch(`http://axelhellberg.se/courses/api`, { 
        method: 'DELETE',
        body: id
    })
        .then(response => response.json())
        .then(result => {
            console.log('Success: ', result);
            getCourses();
        })
        .catch(error => {
            console.log('Error: ', error);
        });
}  

function addCourse() { // add new course
    let course = { 
        'code': codeInput.value, 
        'name': nameInput.value, 
        'progress': progInput.value, 
        'syllabus': urlInput.value 
    };

    if (codeInput.value && nameInput.value) {
        fetch(`http://axelhellberg.se/courses/api`, { 
            method: 'POST',
            body: JSON.stringify(course),
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success: ', result);
                getCourses();
            })
            .catch(error => {
                console.log('Error: ', error);
                getCourses();
            });
    }
}

function updateCourse() { // update existing course
    let course = { 
        'id': updateId,
        'code': codeInput.value, 
        'name': nameInput.value, 
        'progress': progInput.value, 
        'syllabus': urlInput.value
    };

    if (codeInput.value && nameInput.value) {
        fetch(`http://axelhellberg.se/courses/api`, { 
            method: 'PUT',
            mode: 'cors',
            // headers: {
            //     'content-type': 'application/json'
            // },
            body: JSON.stringify(course),
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success: ', result);
            })
            .catch(error => {
                console.log('Error: ', error);
            });
    }
}




