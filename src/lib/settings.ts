import { prisma } from './prisma'

export type SettingKey =
  | 'TWILIO_ACCOUNT_SID'
  | 'TWILIO_AUTH_TOKEN'
  | 'TWILIO_PHONE_NUMBER'
  | 'SMTP_HOST'
  | 'SMTP_PORT'
  | 'SMTP_USER'
  | 'SMTP_PASSWORD'
  | 'SMTP_FROM_EMAIL'
  | 'SMTP_FROM_NAME'
  | 'SITE_NAME'
  | 'SITE_DESCRIPTION'

export async function getSetting(key: SettingKey): Promise<string | null> {
  const setting = await prisma.settings.findUnique({
    where: { key },
  })
  return setting?.value ?? null
}

export async function getSettings(keys: SettingKey[]): Promise<Record<string, string | null>> {
  const settings = await prisma.settings.findMany({
    where: { key: { in: keys } },
  })

  const result: Record<string, string | null> = {}
  keys.forEach(key => {
    const found = settings.find(s => s.key === key)
    result[key] = found?.value ?? null
  })

  return result
}

export async function setSetting(key: SettingKey, value: string): Promise<void> {
  await prisma.settings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
}

export async function setSettings(settings: Record<SettingKey, string>): Promise<void> {
  const operations = Object.entries(settings).map(([key, value]) =>
    prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  )

  await prisma.$transaction(operations)
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const settings = await prisma.settings.findMany()
  const result: Record<string, string> = {}
  settings.forEach(s => {
    result[s.key] = s.value
  })
  return result
}
