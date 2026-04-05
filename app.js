let logintoform = document.getElementById('logintoform');
let formtologin = document.getElementById('formtologin');
let loginSection = document.getElementById('loginSection');
let createSection = document.getElementById('createAccount');
let login = document.getElementById('loginBTN');
let createAccForm = document.getElementById('createaccform');
let allUser = JSON.parse(localStorage.getItem('allUser')) || [];

function initAuth() {

    if (logintoform) {
        logintoform.addEventListener('click', () => {
            loginSection.style.display = "none";
            createSection.style.display = "block";
        });
    }

    if (formtologin) {
        formtologin.addEventListener('click', () => {
            createSection.style.display = "none";
            loginSection.style.display = "block";
        });
    }

    if (login) {

        login.addEventListener('click', () => {

            let loginEmail = document.getElementById('loginEmail').value;
            let loginPassword = document.getElementById('loginPassword').value;


            if (loginEmail === "" || loginPassword === "") {
                Swal.fire({
                    title: 'Credentials Missing',
                    text: 'Please enter your credentials to log in.',
                    icon: 'warning',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#007bff',
                    background: '#f8f9fa',
                });
            }
            else {


                let foundUser = allUser.find(user =>
                    user.email == loginEmail && user.password == loginPassword
                );
                if (foundUser) {
                    if (foundUser.email == "admin@gmail.com") {
                        localStorage.setItem('admin', "xk82_admin_99");
                        localStorage.setItem('currentUser', JSON.stringify(foundUser));
                        Swal.fire({
                            title: 'Welcome Back Admin!',
                            text: 'You have logged in successfully.',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2500,
                            timerProgressBar: true
                        }).then(() => {
                            window.location.href = "admin.html";
                        });
                        return;
                    }

                    if (foundUser.status === "pending") {
                        Swal.fire({
                            title: 'Account Pending',
                            text: 'Bhai, Admin ne abhi tak approve nahi kiya. Thora sabr karein!',
                            icon: 'info',
                            confirmButtonText: 'Theek hai'
                        });
                        return; // Login process yahan khatam
                    }
                    localStorage.setItem('currentUser', JSON.stringify(foundUser));


                    if (foundUser.isPasswordChanged === false) {
                        Swal.fire({
                            title: 'First Login!',
                            text: 'Security ke liye apna password change karein.',
                            icon: 'info',
                            confirmButtonText: 'Change Now'
                        }).then(() => {

                            window.location.href = "change-password.html";
                        });
                    } 
                    else {
                        Swal.fire({
                            title: 'Welcome Back!',
                            text: 'You have logged in successfully.',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2500,
                            timerProgressBar: true
                        }).then(() => {
                            window.location.href = "dashboard.html";
                        });
                    }
                }
                else {
                    document.getElementById('loginPassword').value = "";
                    Swal.fire({
                        title: 'Invalid Credentials',
                        text: 'The email or password you entered is incorrect. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'Try Again',
                        confirmButtonColor: '#d33'
                    });
                }
            }
        })
    }
    if (createAccForm) {
        createAccForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let userName = document.getElementById('userName').value.trim();
            let userEmail = document.getElementById('userEmail').value.trim();
            let userFather = document.getElementById('userFather').value.trim();
            let genderElement = document.querySelector('input[name="gender"]:checked');
            let dob = document.getElementById('userbirthDate').value;
            let userCnic = document.getElementById('userCnic').value.trim();
            let userNumber = document.getElementById('userNumber').value.trim();
            let courses = document.getElementById('Corses').value;
            if (!userName || !userEmail || !genderElement || !dob || !userCnic || !courses) {
                Swal.fire({
                    title: 'Missing Information',
                    text: 'Please fill in all the required fields to proceed.',
                    icon: 'warning',
                    confirmButtonColor: '#007bff',
                    confirmButtonText: 'Understood'
                });
                return;
            }

            if (!userEmail.includes('@')) {
                return;
            }
            if (userCnic.length !== 13) {
                Swal.fire({
                    title: 'Invalid CNIC Length',
                    text: 'CNIC must be exactly 13 digits long (without dashes).',
                    icon: 'warning',
                    confirmButtonColor: '#f39c12',
                    confirmButtonText: 'Correct It'
                });
                return;
            }
            let gender = genderElement.value;

            let userData = {
                name: userName,
                email: userEmail,
                fatherName: userFather,
                gender: gender,
                dob: dob,
                cnic: userCnic,
                number: userNumber,
                password: userCnic,
                isPasswordChanged: false,
                courses: courses,
                status: "pending"
            }

            let userExits = allUser.some(user => user.cnic === userCnic);

            if (userExits) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Looks like you’re already part of the family! Try logging in instead.',
                });
            }
            else {
                allUser.push(userData);
                localStorage.setItem('allUser', JSON.stringify(allUser));
                createAccForm.reset();
                Swal.fire({
                    title: 'Account Created!',
                    text: 'Redirecting you to dashboard...',
                    icon: 'success',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        createSection.style.display = "none";
                        loginSection.style.display = "block";
                    }
                });
            }
        })
    }
}


//   dashboard logic

let loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
let logoutBtn = document.getElementById('logOut');
let allUsers = JSON.parse(localStorage.getItem('allUser')) || [];
let tableBody = document.getElementById('tableBody');
function initDashboard() {
    if (!tableBody) return;

    function displayUsers() {
        tableBody.innerHTML = "";

        allUsers.forEach((user) => {
            let row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.fatherName}</td>
                <td>${user.email}</td>
                <td>${user.cnic}</td>
                <td>${user.courses}</td>
                <td>${user.number}</td>
            </tr>
        `;
            tableBody.innerHTML += row;
        });
    }
    displayUsers();
    if (!loggedInUser) {
        Swal.fire({
            title: 'Access Denied!',
            html: 'Unauthorized access detected. <br> <b>Redirecting to Login for authentication...</b>',
            icon: 'error',
            iconColor: '#ff4757',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,


            customClass: {
                popup: 'premium-swal-popup',
                title: 'premium-swal-title',
                htmlContainer: 'premium-swal-text'
            },

            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },

            didClose: () => {
                window.location.href = "index.html";
            }
        });

    } else {

        console.log('correct')
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you really want to log out of your account?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#ff4757',
                cancelButtonColor: '#2f3542',
                confirmButtonText: 'Yes, Log me out',
                cancelButtonText: 'No, stay here',

                customClass: {
                    popup: 'premium-swal-popup',
                    title: 'premium-swal-title',
                    htmlContainer: 'premium-swal-text'
                },
                backdrop: `rgba(0,0,0,0.6)`,
                showClass: {
                    popup: 'animate__animated animate__fadeInUp'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Success Toast
                    Swal.fire({
                        title: 'Logged Out',
                        text: 'See you again soon!',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true
                    }).then(() => {
                        localStorage.removeItem('currentUser');
                        window.location.href = "/index.html";
                    });
                }
            });
        })
    }
}

initAuth();
initDashboard();