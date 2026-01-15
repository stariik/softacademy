import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@softacademy.ge' },
    update: {},
    create: {
      email: 'admin@softacademy.ge',
      name: 'ადმინისტრატორი',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
    },
  })
  console.log('Admin user created:', admin.email)

  // Create categories
  const categories = [
    { name: 'პროგრამირება', slug: 'programming', description: 'პროგრამირების კურსები' },
    { name: 'დიზაინი', slug: 'design', description: 'გრაფიკული და UI/UX დიზაინი' },
    { name: 'მარკეტინგი', slug: 'marketing', description: 'ციფრული მარკეტინგი' },
    { name: 'ბიზნესი', slug: 'business', description: 'ბიზნეს მენეჯმენტი' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Categories created')

  // Create sample courses
  const programmingCat = await prisma.category.findUnique({ where: { slug: 'programming' } })
  const designCat = await prisma.category.findUnique({ where: { slug: 'design' } })

  if (programmingCat) {
    await prisma.course.upsert({
      where: { slug: 'javascript-fundamentals' },
      update: {},
      create: {
        title: 'JavaScript საფუძვლები',
        slug: 'javascript-fundamentals',
        shortDesc: 'ისწავლეთ JavaScript-ის საფუძვლები ნულიდან',
        description: 'ეს კურსი განკუთვნილია დამწყებებისთვის, რომლებსაც სურთ JavaScript-ის შესწავლა. კურსის განმავლობაში შეისწავლით ენის ყველა ძირითად კონცეფციას და პრაქტიკულ მაგალითებს.',
        price: 150,
        instructor: 'გიორგი გიორგაძე',
        instructorBio: '10 წლიანი გამოცდილება ვებ დეველოპმენტში',
        duration: '3 საათი',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        syllabus: ['ცვლადები და მონაცემთა ტიპები', 'ფუნქციები', 'ობიექტები და მასივები', 'DOM მანიპულაცია', 'Async/Await'],
        categoryId: programmingCat.id,
        isPublished: true,
        isFeatured: true,
      },
    })

    await prisma.course.upsert({
      where: { slug: 'react-complete-guide' },
      update: {},
      create: {
        title: 'React - სრული გზამკვლევი',
        slug: 'react-complete-guide',
        shortDesc: 'აითვისეთ React და შექმენით თანამედროვე ვებ აპლიკაციები',
        description: 'React არის ყველაზე პოპულარული JavaScript ბიბლიოთეკა UI-ს შესაქმნელად. ამ კურსში შეისწავლით React-ის ყველა ასპექტს hooks-იდან state management-მდე.',
        price: 200,
        instructor: 'ნიკა ნიკოლაძე',
        instructorBio: 'Senior Frontend Developer, 8 წლიანი გამოცდილება',
        duration: '4 საათი',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        syllabus: ['Components და JSX', 'State და Props', 'React Hooks', 'Context API', 'React Router'],
        categoryId: programmingCat.id,
        isPublished: true,
        isFeatured: true,
      },
    })
  }

  if (designCat) {
    await prisma.course.upsert({
      where: { slug: 'figma-for-beginners' },
      update: {},
      create: {
        title: 'Figma დამწყებებისთვის',
        slug: 'figma-for-beginners',
        shortDesc: 'ისწავლეთ Figma და შექმენით პროფესიონალური დიზაინები',
        description: 'Figma არის ყველაზე პოპულარული ინსტრუმენტი UI/UX დიზაინისთვის. ამ კურსში შეისწავლით ყველაფერს რაც საჭიროა პროფესიონალური დიზაინის შესაქმნელად.',
        price: 120,
        instructor: 'მარიამ მარიამიძე',
        instructorBio: 'UI/UX დიზაინერი 6 წლიანი გამოცდილებით',
        duration: '2.5 საათი',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        syllabus: ['Figma-ს ინტერფეისი', 'ფორმები და ფერები', 'კომპონენტები', 'პროტოტიპინგი', 'ექსპორტი'],
        categoryId: designCat.id,
        isPublished: true,
        isFeatured: true,
      },
    })
  }

  console.log('Sample courses created')

  // Create a promocode
  await prisma.promocode.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
      maxUses: 100,
      isActive: true,
    },
  })
  console.log('Sample promocode created: WELCOME10')

  // Create sample blog posts
  const blogPosts = [
    {
      title: 'როგორ დავიწყოთ JavaScript-ის სწავლა',
      slug: 'how-to-start-learning-javascript',
      excerpt: 'JavaScript არის ერთ-ერთი ყველაზე პოპულარული პროგრამირების ენა. ამ სტატიაში გაგიზიარებთ რჩევებს, თუ როგორ დაიწყოთ მისი შესწავლა.',
      content: `# JavaScript-ის სწავლის დაწყება

JavaScript არის ვებ დეველოპმენტის ფუნდამენტური ენა. თუ გსურთ გახდეთ ვებ დეველოპერი, JavaScript-ის ცოდნა აუცილებელია.

## რატომ JavaScript?

- ყველაზე პოპულარული პროგრამირების ენაა ვებისთვის
- შეგიძლიათ შექმნათ ინტერაქტიული ვებგვერდები
- გამოიყენება როგორც Frontend, ასევე Backend-ისთვის

## საიდან დავიწყოთ?

- ისწავლეთ HTML და CSS ჯერ
- გაეცანით ძირითად კონცეფციებს: ცვლადები, ფუნქციები, ციკლები
- პრაქტიკა, პრაქტიკა, პრაქტიკა!`,
      authorName: 'გიორგი გიორგაძე',
      category: 'programming',
      tags: ['javascript', 'programming', 'beginners'],
      readTime: 5,
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'UI/UX დიზაინის ტრენდები 2024',
      slug: 'ui-ux-design-trends-2024',
      excerpt: 'გაეცანით 2024 წლის ყველაზე აქტუალურ დიზაინის ტრენდებს და ისწავლეთ, როგორ გამოიყენოთ ისინი თქვენს პროექტებში.',
      content: `# UI/UX დიზაინის ტრენდები

დიზაინის სამყარო მუდმივად იცვლება. მოდით განვიხილოთ 2024 წლის მთავარი ტრენდები.

## მინიმალიზმი

მინიმალისტური დიზაინი კვლავ აქტუალურია. ნაკლები ელემენტები, მეტი სივრცე.

## მუქი რეჟიმი

Dark mode უკვე სტანდარტი გახდა ბევრი აპლიკაციისთვის.

## მიკროანიმაციები

პატარა, სუბტილური ანიმაციები აუმჯობესებენ მომხმარებლის გამოცდილებას.`,
      authorName: 'მარიამ მარიამიძე',
      category: 'design',
      tags: ['design', 'ui', 'ux', 'trends'],
      readTime: 7,
      isPublished: true,
      isFeatured: false,
    },
    {
      title: 'React Hooks-ის გამოყენება',
      slug: 'using-react-hooks',
      excerpt: 'React Hooks-მა რევოლუცია მოახდინა კომპონენტების წერაში. ისწავლეთ useState და useEffect-ის გამოყენება.',
      content: `# React Hooks

Hooks არის React-ის ფუნქციონალური კომპონენტების ძირითადი ინსტრუმენტი.

## useState

useState გამოიყენება state-ის მართვისთვის:

const [count, setCount] = useState(0);

## useEffect

useEffect გამოიყენება side effects-ისთვის:

useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);

## რჩევები

- არ გამოიყენოთ hooks პირობით ბლოკებში
- ყოველთვის დაიცავით დამოკიდებულებების მასივი`,
      authorName: 'ნიკა ნიკოლაძე',
      category: 'programming',
      tags: ['react', 'hooks', 'javascript'],
      readTime: 8,
      isPublished: true,
      isFeatured: false,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        publishedAt: new Date(),
      },
    })
  }
  console.log('Sample blog posts created')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
