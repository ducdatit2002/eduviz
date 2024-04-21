// Load the CSV data
d3.csv("../data/Data.csv", function(error, data) {
    if (error) throw error;

    // Convert scores to numbers and handle missing values
    data.forEach(function(student) {
        student.totalScore = calculateTotalScore(student);
    });

    // Display details for a specific student (modify as needed)
    displayStudentDetails(); // Display the first student as an example
});

function calculateTotalScore(student) {
    const subjects = ['toán', 'ngữ văn', 'khxh', 'khtn', 'lịch sử', 'địa lí', 'gdcd', 'sinh học', 'vật lí', 'hóa học', 'tiếng anh'];
    return subjects.reduce(function(total, subject) {
        return total + (student[subject] !== "" ? parseFloat(student[subject]) : 0);
    }, 0);
}

function analyzeStudentPerformance(student) {
    const subjects = ['toán', 'ngữ văn', 'khxh', 'khtn', 'lịch sử', 'địa lí', 'gdcd', 'sinh học', 'vật lí', 'hóa học', 'tiếng anh'];
    let strengths = [];
    let weaknesses = [];

    subjects.forEach(function(subject) {
        const score = parseFloat(student[subject]);
        if (score > 8) {
            strengths.push(`${subject}: ${score}`);
        } else if (score > 0 && score < 5) {
            weaknesses.push(`${subject}: ${score}`);
        }
    });

    return { strengths, weaknesses };
}

function displayStudentDetails(student) {
    const detailsContainer = document.getElementById('student-details');
    detailsContainer.innerHTML = '<h2>Student Scores</h2>'; // Reset the details container

    const scoreTable = createScoreTable(student);
    detailsContainer.appendChild(scoreTable);

    const analysisResults = analyzeStudentPerformance(student);

    const strengthsContainer = document.createElement('div');
    strengthsContainer.innerHTML = '<h4 style="font-weight: bold;">STRENGTHS</h4>';
    analysisResults.strengths.forEach(function(str) {
        strengthsContainer.innerHTML += `<p>${str}</p>`;
    });
    if (analysisResults.strengths.length === 0) {
        strengthsContainer.innerHTML += '<p>No strengths identified</p>';
    }
    detailsContainer.appendChild(strengthsContainer);

    const weaknessesContainer = document.createElement('div');
    weaknessesContainer.innerHTML = '<h4 style="font-weight: bold;">WEAKNESS</h4>';
    analysisResults.weaknesses.forEach(function(weak) {
        weaknessesContainer.innerHTML += `<p>${weak}</p>`;
    });
    if (analysisResults.weaknesses.length === 0) {
        weaknessesContainer.innerHTML += '<p>No weaknesses identified</p>';
    }
    detailsContainer.appendChild(weaknessesContainer);

    detailsContainer.style.display = 'block';
}

function createScoreTable(student) {
    const subjects = ['toán', 'ngữ văn', 'khxh', 'khtn', 'lịch sử', 'địa lí', 'gdcd', 'sinh học', 'vật lí', 'hóa học', 'tiếng anh'];
    const table = document.createElement('table');
    table.classList.add('score-table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    subjects.forEach(function(subject) {
        const headerCell = document.createElement('th');
        headerCell.textContent = subject;
        headerRow.appendChild(headerCell);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const bodyRow = document.createElement('tr');
    subjects.forEach(function(subject) {
        const scoreCell = document.createElement('td');
        scoreCell.textContent = student[subject] !== '-1' ? student[subject] : 'N/A';
        bodyRow.appendChild(scoreCell);
    });
    tbody.appendChild(bodyRow);
    table.appendChild(tbody);

    return table;
}

function handleSubmit() {
    const studentId = document.getElementById('student-id').value;
    searchAndDisplayStudent(studentId);
}

function searchAndDisplayStudent(studentId) {
    d3.csv("../data/Data.csv", function(error, data) {
        if (error) throw error;

        var student = data.find(function(s) { return s.sbd === studentId; });
        if (student) {
            displayStudentDetails(student);
            document.getElementById('student-details').style.display = 'block';
        } else {
            alert('Student not found');
            document.getElementById('student-details').style.display = 'none';
        }
    });
}

