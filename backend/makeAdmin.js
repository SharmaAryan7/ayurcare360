require('dotenv').config();
const db = require('./src/config/db');

async function makeAdmin() {
    try {
        // Put your actual test email right here
        const email = 'giyusenpai79@gmail.com'; 
        
        const query = `UPDATE Users SET role = 'admin' WHERE email = $1 RETURNING email, role;`;
        const { rows } = await db.query(query, [email]);
        
        if (rows.length > 0) {
            console.log(`✅ Success! ${rows[0].email} is now an ${rows[0].role}.`);
        } else {
            console.log(`❌ Error: No user found with the email ${email}`);
        }
    } catch (error) {
        console.error('Database Error:', error);
    } finally {
        process.exit(0); // Closes the terminal script
    }
}

makeAdmin();