import axios from 'axios';

const BASE_URL = 'http://localhost:3003/api/v1';

async function verify() {
    console.log("Starting Verification...");

    try {
        // 0. Health Check
        try {
            const health = await axios.get("http://localhost:3003/");
            console.log("Health Check:", health.data);
        } catch (e) {
            console.error("Health Check Failed:", e.message);
            // If health check fails, try to proceed but warn
        }

        const uniqueId = Date.now();
        const username = `user_${uniqueId}`;
        const email = `user_${uniqueId}@test.com`;
        const password = 'password123';

        // 1. Register User
        console.log(`\n1. Registering user: ${username}...`);
        await axios.post(`${BASE_URL}/users/register`, {
            username,
            email,
            password
        });
        console.log("   User registered.");

        // 2. Login User
        console.log(`\n2. Logging in user...`);
        const loginRes = await axios.post(`${BASE_URL}/users/login`, {
            username,
            password
        });
        const userToken = loginRes.data.data.access_token;
        const userId = loginRes.data.data.user._id;
        console.log("   User logged in.");

        // 3. Create Recipe
        console.log(`\n3. Creating recipe 'Test Recipe ${uniqueId}'...`);
        await axios.post(`${BASE_URL}/recipe/create`, {
            name: `Test Recipe ${uniqueId}`,
            description: "Test Description",
            ingredients: ["Test Ingredient"],
            instructions: "Test Instructions",
            recipeImg: "http://example.com/img.jpg",
            cookingTime: 30,
            userOwner: userId
        }, {
            headers: { authorization: userToken }
        });
        console.log("   Recipe created.");

        // 4. Login Admin
        console.log(`\n4. Logging in Admin...`);
        const adminRes = await axios.post(`${BASE_URL}/users/login`, {
            username: 'admin',
            password: 'admin'
        });
        const adminToken = adminRes.data.data.access_token;
        console.log("   Admin logged in.");

        // 5. Fetch Pending Recipes
        console.log(`\n5. Fetching Pending Recipes...`);
        const pendingRes = await axios.get(`${BASE_URL}/recipe/admin/pending`, {
            headers: { authorization: adminToken }
        });
        
        const pendingRecipes = pendingRes.data.data;
        console.log(`   Found ${pendingRecipes.length} pending recipes.`);

        const found = pendingRecipes.find(r => r.name === `Test Recipe ${uniqueId}`);
        
        if (found) {
            console.log("\n✅ VERIFICATION PASSED: New recipe found in pending list.");
        } else {
            console.error("\n❌ VERIFICATION FAILED: New recipe NOT found in pending list.");
            console.log("List:", pendingRecipes.map(r => r.name));
        }

    } catch (error) {
         console.error("\n❌ VERIFICATION ERROR:");
         if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
         } else if (error.request) {
            console.error("No response received. Request:", error.message);
         } else {
            console.error("Message:", error.message);
         }
    }
}

verify();
