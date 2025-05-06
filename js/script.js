// Toggle login forms based on selection
function showLoginForm(role) {
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("studentLogin").style.display = "none";

    if (role === "admin") {
        document.getElementById("adminLogin").style.display = "block";
    } else {
        document.getElementById("studentLogin").style.display = "block";
    }
}

// Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    fetch('http://localhost:5001/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchStudents();
        } else {
            alert('Login failed. Invalid credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong.');
    });
});

// Student Login
document.getElementById('studentLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;

    // Send the login details to the backend for validation or insertion
    fetch('http://localhost:5001/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Student Login Successful!");
            // Optionally, you can display a student's dashboard or details after successful login
        } else {
            alert('Login failed. Invalid credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong.');
    });
});

// Fetch and display student details for admin
function fetchStudents() {
    fetch('http://localhost:5001/admin/students')
        .then(res => res.json())
        .then(students => {
            const container = document.getElementById('studentsContainer');
            container.innerHTML = '';

            if (students.length === 0) {
                container.innerHTML = '<p>No students found.</p>';
                return;
            }

            students.forEach(student => {
                const card = document.createElement('div');
                card.classList.add('student-card');
                card.innerHTML = `
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Password:</strong> ${student.password}</p>
                `;
                container.appendChild(card);
            });

            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
        })
        .catch(err => {
            console.error('Error fetching students:', err);
        });
}
