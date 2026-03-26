'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getSession, login, register, resendOtp, verifyOtp } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getRoleHomePath } from '@/lib/auth/navigation';

const OTP_RESEND_COOLDOWN_SECONDS = 60;
const phoneSchema = z.string().min(10).max(15);

const registerSchema = z.object({
  fullName: z.string().min(2),
  phoneNumber: phoneSchema,
  password: z.string().min(8),
  accountType: z.enum(['FARMER_YOUTH', 'AGRI_SME', 'PARTNER'])
});

const loginSchema = z.object({
  phoneNumber: phoneSchema,
  password: z.string().min(8)
});

const verifySchema = z.object({
  phoneNumber: phoneSchema,
  otpCode: z.string().length(6)
});

export function RegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: 'FARMER_YOUTH' }
  });

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            setError(null);
            await register(values);
            router.push(`/${locale}/verify-otp?phone=${encodeURIComponent(values.phoneNumber)}`);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Registration failed');
          }
        })}
      >
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Input placeholder="Jina kamili" {...form.register('fullName')} />
        <Input placeholder="Namba ya simu" {...form.register('phoneNumber')} />
        <Input type="password" placeholder="Nenosiri" {...form.register('password')} />
        <select className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm" {...form.register('accountType')}>
          <option value="FARMER_YOUTH">Farmer / Youth</option>
          <option value="AGRI_SME">Agri SME</option>
          <option value="PARTNER">Partner</option>
        </select>
        <Button className="w-full" type="submit">Endelea</Button>
      </form>
    </Card>
  );
}

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            setError(null);
            await login(values);
            const session = await getSession();
            router.push(getRoleHomePath(locale, session.accountType));
            router.refresh();
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Login failed');
          }
        })}
      >
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Input placeholder="Namba ya simu" {...form.register('phoneNumber')} />
        <Input type="password" placeholder="Nenosiri" {...form.register('password')} />
        <Button className="w-full" type="submit">Ingia</Button>
      </form>
    </Card>
  );
}

export function VerifyOtpForm({ locale, phoneNumber }: { locale: string; phoneNumber?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(phoneNumber ? OTP_RESEND_COOLDOWN_SECONDS : 0);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { phoneNumber }
  });

  useEffect(() => {
    if (cooldownRemaining <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCooldownRemaining((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownRemaining]);

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            setError(null);
            await verifyOtp(values);
            router.push(`/${locale}/login`);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'OTP verification failed');
          }
        })}
      >
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Input placeholder="Namba ya simu" {...form.register('phoneNumber')} />
        <Input placeholder="OTP ya tarakimu 6" {...form.register('otpCode')} />
        <div className="flex gap-3">
          <Button className="flex-1" type="submit">Thibitisha</Button>
          <Button
            className="flex-1 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isResending || cooldownRemaining > 0}
            type="button"
            variant="secondary"
            onClick={async () => {
              const phone = form.getValues('phoneNumber');
              if (phone && !isResending && cooldownRemaining === 0) {
                try {
                  setError(null);
                  setIsResending(true);
                  await resendOtp({ phoneNumber: phone });
                  setCooldownRemaining(OTP_RESEND_COOLDOWN_SECONDS);
                } catch (cause) {
                  const message = cause instanceof Error ? cause.message : 'OTP resend failed';
                  if (message.includes('Please wait before requesting another OTP')) {
                    setCooldownRemaining(OTP_RESEND_COOLDOWN_SECONDS);
                  }
                  setError(message);
                } finally {
                  setIsResending(false);
                }
              }
            }}
          >
            {isResending ? 'Inatuma...' : cooldownRemaining > 0 ? `Subiri ${cooldownRemaining}s` : 'Tuma tena'}
          </Button>
        </div>
        {cooldownRemaining > 0 ? (
          <p className="text-sm text-black/60">
            OTP mpya inaweza kutumwa baada ya sekunde {cooldownRemaining}.
          </p>
        ) : null}
      </form>
    </Card>
  );
}
