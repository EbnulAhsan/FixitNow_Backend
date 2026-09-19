import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const techniciansData = [
    {
        name: 'Abir Hasan',
        email: 'abir@fixitnow.com',
        phone: '01711000001',
        bio: 'Certified multi-disciplinary technician with 7+ years of experience in cooling and carpentry.',
        skills: ['AC Servicing', 'Gas Refill', 'Furniture Assembly'],
        experience: 7,
        hourlyRate: 500,
        services: [
            {
                categoryName: 'AC Repair',
                title: 'AC Master Cleaning & Servicing',
                description: 'Comprehensive indoor and outdoor unit jet wash, filter cleaning, and overall checkup.',
                price: 1200,
            },
            {
                categoryName: 'Carpentry',
                title: 'Furniture Assembly & Lock Repair',
                description: 'Door lock replacement, hinge alignment, and flat-pack furniture assembly.',
                price: 650,
            },
        ],
    },
    {
        name: 'Tanvir Ahmed',
        email: 'tanvir@fixitnow.com',
        phone: '01711000002',
        bio: 'Licensed electrical engineer & master electrician handling commercial and residential units.',
        skills: ['Electrical Wiring', 'Switchboard Setup', 'Fan Fixture'],
        experience: 6,
        hourlyRate: 600,
        services: [
            {
                categoryName: 'Electrical',
                title: 'Switchboard & Socket Installation',
                description: 'Safe wiring, breaker verification, and modular switch socket installation.',
                price: 450,
            },
            {
                categoryName: 'Electrical',
                title: 'Ceiling Fan & Light Fixture Setup',
                description: 'Ceiling fan mounting, chandelier hanging, and smart LED fixture setup.',
                price: 600,
            },
        ],
    },
    {
        name: 'Rafiqul Islam',
        email: 'rafiq@fixitnow.com',
        phone: '01711000003',
        bio: 'Expert master plumber with deep experience in sanitary fittings and leakage detection.',
        skills: ['Pipe Fitting', 'Sanitary Work', 'Leak Detection'],
        experience: 8,
        hourlyRate: 550,
        services: [
            {
                categoryName: 'Plumbing',
                title: 'Water Leakage & Pipe Repair',
                description: 'Fixing ruptured pipelines, concealed pipe leakage detection, and faucet replacements.',
                price: 700,
            },
            {
                categoryName: 'Plumbing',
                title: 'Bathroom Commode & Basin Fitting',
                description: 'Installation of sanitary fittings, commodes, flush mechanisms, and sink basins.',
                price: 1500,
            },
        ],
    },
    {
        name: 'Mahbub Alam',
        email: 'mahbub@fixitnow.com',
        phone: '01711000004',
        bio: 'Professional wall painter and finishing expert using modern weather and acrylic coats.',
        skills: ['Wall Painting', 'Waterproofing', 'Texture Paint'],
        experience: 5,
        hourlyRate: 450,
        services: [
            {
                categoryName: 'Painting',
                title: 'Interior Wall Painting & Touch-up',
                description: 'Premium acrylic paint finish with surface smoothing, primer, and double coat application.',
                price: 3500,
            },
        ],
    },
    {
        name: 'Farhana Akter',
        email: 'farhana@fixitnow.com',
        phone: '01711000005',
        bio: 'Professional home hygiene and deep sanitation specialist trained in eco-friendly chemical tools.',
        skills: ['Deep Cleaning', 'Sanitization', 'Pest Control'],
        experience: 4,
        hourlyRate: 400,
        services: [
            {
                categoryName: 'Cleaning',
                title: 'Deep Kitchen & Bathroom Cleaning',
                description: 'Anti-bacterial steam cleaning, grease removal, floor scrubbing, and sanitization.',
                price: 1800,
            },
        ],
    },
    {
        name: 'Sabbir Hossain',
        email: 'sabbir@fixitnow.com',
        phone: '01711000006',
        bio: 'Specialist in commercial cooling, inverter AC troubleshooting, and heavy compressor overhaul.',
        skills: ['Inverter AC', 'Gas Charging', 'Leak Test'],
        experience: 9,
        hourlyRate: 700,
        services: [
            {
                categoryName: 'AC Repair',
                title: 'AC Gas Refill & Leak Fix',
                description: 'Full refrigerant top-up along with pipe inspection and high-pressure leak testing.',
                price: 2500,
            },
        ],
    },
];

async function main() {
    console.log('--- Starting Admin, Technician & Service Seeding ---');

    // 1. Password hash create
    const defaultTechPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('Admin1721@', 10);

    // 2. Admin User Create / Update
    const admin = await prisma.user.upsert({
        where: { email: 'admin99@fixitnow.com' },
        update: {
            password: adminPassword,
            role: 'ADMIN' as any,
        },
        create: {
            name: 'Super Admin',
            email: 'admin99@fixitnow.com',
            password: adminPassword,
            role: 'ADMIN' as any,
        },
    });
    console.log(`✅ Admin Ready: ${admin.email} (Password: Admin1721@)`);

    // 3. Technicians & Services Seed
    for (const tech of techniciansData) {
        let user = await prisma.user.findFirst({ where: { email: tech.email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: tech.name,
                    email: tech.email,
                    password: defaultTechPassword,
                    role: 'TECHNICIAN' as any,
                },
            });
            console.log(`+ Created Technician User: ${tech.name}`);
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: { password: defaultTechPassword, role: 'TECHNICIAN' as any },
            });
        }

        const profile = await prisma.technicianProfile.upsert({
            where: { userId: user.id },
            update: {
                bio: tech.bio,
                skills: tech.skills,
                experience: tech.experience,
                hourlyRate: tech.hourlyRate,
            },
            create: {
                userId: user.id,
                bio: tech.bio,
                skills: tech.skills,
                experience: tech.experience,
                hourlyRate: tech.hourlyRate,
            },
        });

        for (const s of tech.services) {
            let cat = await prisma.category.findFirst({
                where: { name: { equals: s.categoryName, mode: 'insensitive' } },
            });

            if (!cat) {
                cat = await prisma.category.create({
                    data: { name: s.categoryName },
                });
            }

            const existingService = await prisma.service.findFirst({
                where: { title: s.title },
            });

            if (!existingService) {
                await prisma.service.create({
                    data: {
                        title: s.title,
                        description: s.description,
                        price: s.price,
                        technicianId: profile.id,
                        categoryId: cat.id,
                    },
                });
                console.log(`  └─ Added Service: ${s.title}`);
            } else {
                await prisma.service.update({
                    where: { id: existingService.id },
                    data: {
                        technicianId: profile.id,
                        categoryId: cat.id,
                        price: s.price,
                        description: s.description,
                    },
                });
                console.log(`  └─ Updated Service: ${s.title} to ${tech.name}`);
            }
        }
    }

    console.log('--- Seeding Complete: Admin, Technicians & Services are fully synced! ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });