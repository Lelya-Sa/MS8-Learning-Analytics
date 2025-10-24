/**
 * Quick test script to verify mock users are loaded correctly
 */

const { userService } = require('./services/mockData');

console.log('Testing mock users...\n');

const testEmails = [
    'test@example.com',
    'trainer@example.com',
    'admin@example.com',
    'multi@example.com',
    'superadmin@example.com'
];

testEmails.forEach(email => {
    const user = userService.findByEmail(email);
    if (user) {
        console.log(`✓ Found: ${email}`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Roles: ${JSON.stringify(user.roles)}`);
        console.log(`  Password: ${user.password}`);
        console.log('');
    } else {
        console.log(`✗ NOT FOUND: ${email}\n`);
    }
});

