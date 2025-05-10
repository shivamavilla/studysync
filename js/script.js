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

    fetch('http://localhost:5001/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Student Login Successful!");
            // Optionally, redirect or show student dashboard
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
                    <button onclick="deleteStudent('${student.email}')">Delete</button>
                `;
                container.appendChild(card);
            });

            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
        })
        .catch(err => {
            console.error('Error fetching students:', err);
            alert('Failed to fetch student data.');
        });
}

// Smooth Scroll (for nav links)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});







// Delete student
function deleteStudent(email) {
    if (confirm("Are you sure you want to delete this student?")) {
        fetch(`http://localhost:5001/admin/students/${encodeURIComponent(email)}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Student deleted successfully!');
                fetchStudents();  // Refresh the student list
            } else {
                alert(data.message || 'Failed to delete the student.');
            }
        })
        .catch(error => {
            console.error('Error deleting student:', error);
            alert('Something went wrong. Please try again.');
        });
    }
}
