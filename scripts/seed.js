const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Create enterprise user
  const hashedPassword = await bcrypt.hash('CollectPro2024!', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'chp@collectpro.be' },
    update: {},
    create: {
      email: 'chp@collectpro.be',
      name: 'CollectPro Enterprise',
      password: hashedPassword,
      subscription: 'enterprise'
    },
  })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
