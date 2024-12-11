// 1. INitialize data
// 2. Update user display
// 3. add username
// 4.delete user
// 5. add email
// votes
// update sidebar
// display votes
// registration
// login
// logout


document.addEventListener("DOMContentLoaded", () => {
    // Local storage se users aur votes data initialize karte hain.
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let votes = JSON.parse(localStorage.getItem("votes")) || {};
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Sidebar me user list update karne ke liye function
    const updateUserSidebar = () => {
        const sidebar = document.getElementById("user-list");
        sidebar.innerHTML = ""; // Purane data ko clear karte hain.

        // Har user ke liye ek list item banate hain
        users.forEach((user) => {
            const userItem = document.createElement("li");
            userItem.classList.add("user-item");

            // User ka email display karte hain
            const userName = document.createElement("span");
            userName.textContent = user.email;
            userName.style.marginRight = "10px";
            userItem.appendChild(userName);

            // Delete button banate hain
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.marginLeft = "10px";
            deleteButton.style.color = "red";
            deleteButton.style.border = "1px solid red";
            deleteButton.style.padding = "2px 5px";
            deleteButton.style.cursor = "pointer";

            // Delete button ka click event
            deleteButton.addEventListener("click", () => {
                deleteUser(user.email);
            });

            userItem.appendChild(deleteButton);

            // User votes dikhane ke liye click event
            userItem.addEventListener("click", (event) => {
                if (event.target === deleteButton) return; // Agar delete button pe click ho to kuch na karein.
                const userVotes = votes[user.email] || { "Option 1": 0, "Option 2": 0 };
                alert(`${user.email}'s votes:\nOption 1: ${userVotes["Option 1"]}\nOption 2: ${userVotes["Option 2"]}`);
            });

            // Sidebar me user item add karte hain
            sidebar.appendChild(userItem);
        });
    };

    // User ko delete karne ka function
    const deleteUser = (email) => {
        // User list me se email ke basis pe filter karte hain
        users = users.filter((user) => user.email !== email);
        localStorage.setItem("users", JSON.stringify(users)); // Updated list ko save karte hain
        delete votes[email]; // Us user ke votes bhi delete karte hain
        localStorage.setItem("votes", JSON.stringify(votes));

        // Agar current user delete ho gaya, to logout karte hain
        if (currentUser && currentUser.email === email) {
            logout();
            alert("Your account has been deleted. Please register again.");
        }

        updateUserSidebar(); // Sidebar ko update karte hain
    };

    // Vote count display update karne ka function
    const updateVoteDisplay = () => {
        if (currentUser) {
            const userVotes = votes[currentUser.email] || { "Option 1": 0, "Option 2": 0 };
            document.getElementById("option1-count").textContent = userVotes["Option 1"];
            document.getElementById("option2-count").textContent = userVotes["Option 2"];
        }
    };

    // User registration ka function
    const register = (email, password) => {
        if (users.some((user) => user.email === email)) {
            alert("User already exists!");
            return;
        }

        users.push({ email, password }); // Naya user add karte hain
        localStorage.setItem("users", JSON.stringify(users)); // Local storage me save karte hain
        alert("User registered successfully!");
        updateUserSidebar(); // Sidebar update karte hain
    };

    // User login ka function
    const login = (email, password) => {
        const user = users.find((user) => user.email === email && user.password === password);

        if (user) {
            currentUser = user; // Current user set karte hain
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert("Login successful!");
            document.getElementById("auth-section").style.display = "none"; // Auth section ko hide karte hain
            document.getElementById("vote-section").style.display = "block"; // Vote section ko show karte hain
            updateVoteDisplay();
        } else {
            alert("Invalid credentials!");
        }
    };

    // User logout ka function
    const logout = () => {
        currentUser = null; // Current user ko null karte hain
        localStorage.removeItem("currentUser");
        document.getElementById("auth-section").style.display = "block"; // Auth section wapas dikhate hain
        document.getElementById("vote-section").style.display = "none"; // Vote section hide karte hain
    };

    // Voting ka function
    const vote = (option) => {
        if (!currentUser) {
            alert("You must be logged in to vote!");
            return;
        }

        // Current user ke votes update karte hain
        votes[currentUser.email] = votes[currentUser.email] || { "Option 1": 0, "Option 2": 0 };
        votes[currentUser.email][option] += 1;
        localStorage.setItem("votes", JSON.stringify(votes));
        updateVoteDisplay();
    };

    // Register button ke liye event listener
    document.getElementById("register-btn").addEventListener("click", () => {
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        register(email, password);
    });

    // Login button ke liye event listener
    document.getElementById("login-btn").addEventListener("click", () => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        login(email, password);
    });

    // Logout button ke liye event listener
    document.getElementById("logout-btn").addEventListener("click", logout);

    // Option 1 ke liye vote button
    document.getElementById("vote-option1").addEventListener("click", () => vote("Option 1"));

    // Option 2 ke liye vote button
    document.getElementById("vote-option2").addEventListener("click", () => vote("Option 2"));

    // Pehli baar sidebar ko update karte hain
    updateUserSidebar();

    // Agar current user logged in hai to UI update karte hain
    if (currentUser) {
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("vote-section").style.display = "block";
        updateVoteDisplay();
    }
});
