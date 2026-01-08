import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            email: 'admin@admin.com',
            name: 'Administrator',
            password: adminPassword,
            role: 'ADMIN',
            active: true,
        },
    });

    console.log('Default admin created:', admin.email);

    const categories = [
        'Monitor/Screen',
        'Keyboard/Mouse',
        'Software/OS',
        'Network/Internet',
        'Printer/Scanner',
        'Other'
    ];

    for (const name of categories) {
        await prisma.damageCategory.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log('Basic damage categories created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
