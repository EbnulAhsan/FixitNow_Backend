import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing old data (if any)...');

    // 1. Create or Find Technician User
    let user = await prisma.user.findFirst({ where: { email: 'tech@fixitnow.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Abir Hasan',
                email: 'tech@fixitnow.com',
                password: 'password123',
                role: 'TECHNICIAN' as any,
            },
        });
    }

    // 2. Create or Find Technician Profile
    const profile = await prisma.technicianProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            bio: 'Certified multi-disciplinary technician with 7+ years of experience across appliances and home repairs.',
            skills: ['AC Servicing', 'Electrical Wiring', 'Plumbing', 'Painting', 'Carpentry'],
            experience: 7,
            hourlyRate: 500,
        },
    });

    // 3. Category wise all services list
    const seedData = [
        {
            categoryName: 'AC Repair',
            services: [
                {
                    title: 'AC Master Cleaning & Servicing',
                    description: 'Comprehensive indoor and outdoor unit jet wash, filter cleaning, and overall checkup.',
                    price: 1200,
                },
                {
                    title: 'AC Gas Refill & Leak Fix',
                    description: 'Full refrigerant top-up along with pipe inspection and high-pressure leak testing.',
                    price: 2500,
                },
            ],
        },
        {
            categoryName: 'Electrical',
            services: [
                {
                    title: 'Switchboard & Socket Installation',
                    description: 'Safe wiring, breaker verification, and modular switch socket installation.',
                    price: 450,
                },
                {
                    title: 'Ceiling Fan & Light Fixture Setup',
                    description: 'Ceiling fan mounting, chandelier hanging, and smart LED fixture setup.',
                    price: 600,
                },
            ],
        },
        {
            categoryName: 'Plumbing',
            services: [
                {
                    title: 'Water Leakage & Pipe Repair',
                    description: 'Fixing ruptured pipelines, concealed pipe leakage detection, and faucet replacements.',
                    price: 700,
                },
                {
                    title: 'Bathroom Commode & Basin Fitting',
                    description: 'Installation of sanitary fittings, commodes, flush mechanisms, and sink basins.',
                    price: 1500,
                },
            ],
        },
        {
            categoryName: 'Painting',
            services: [
                {
                    title: 'Interior Wall Painting & Touch-up',
                    description: 'Premium acrylic paint finish with surface smoothing, primer, and double coat application.',
                    price: 3500,
                },
            ],
        },
        {
            categoryName: 'Cleaning',
            services: [
                {
                    title: 'Deep Kitchen & Bathroom Cleaning',
                    description: 'Anti-bacterial steam cleaning, grease removal, floor scrubbing, and sanitization.',
                    price: 1800,
                },
            ],
        },
        {
            categoryName: 'Carpentry',
            services: [
                {
                    title: 'Furniture Assembly & Lock Repair',
                    description: 'Door lock replacement, hinge alignment, and flat-pack furniture assembly.',
                    price: 650,
                },
            ],
        },
    ];

    console.log('Seeding categories and services...');

    for (const group of seedData) {
        // Find or create category
        let cat = await prisma.category.findFirst({
            where: { name: { equals: group.categoryName, mode: 'insensitive' } },
        });

        if (!cat) {
            cat = await prisma.category.create({
                data: { name: group.categoryName },
            });
        }

        for (const item of group.services) {
            // Check if service already exists
            const existingService = await prisma.service.findFirst({
                where: { title: item.title },
            });

            if (!existingService) {
                await prisma.service.create({
                    data: {
                        title: item.title,
                        description: item.description,
                        price: item.price,
                        technicianId: profile.id,
                        categoryId: cat.id,
                    },
                });
                console.log(`+ Added: [${group.categoryName}] ${item.title}`);
            } else {
                console.log(`= Already exists: ${item.title}`);
            }
        }
    }

    console.log('Successfully seeded all services into Neon Database!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });