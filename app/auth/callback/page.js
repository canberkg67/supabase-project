import { redirect } from 'next/navigation'
import { syncUser } from '@/app/actions/sync'

export default async function AuthCallbackPage() {
  await syncUser()
  redirect('/')
}
