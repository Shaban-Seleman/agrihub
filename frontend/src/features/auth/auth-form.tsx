'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getSession, login, register, resendOtp, verifyOtp } from '@/api/auth';
import { FormField } from '@/components/app/forms';
import { StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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

export function RegisterForm({
  locale,
  defaultAccountType = 'FARMER_YOUTH'
}: {
  locale: string;
  defaultAccountType?: 'FARMER_YOUTH' | 'AGRI_SME' | 'PARTNER';
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: defaultAccountType }
  });

  return (
    <Card className="rounded-[2rem] p-6 md:p-7">
      <form
        className="space-y-5"
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
        <div className="space-y-2">
          <StatusPill tone="gold">Create account</StatusPill>
          <h2 className="font-headline text-3xl font-bold text-ink">Join the hub</h2>
          <p className="text-sm leading-6 text-muted">Create your account securely, verify your phone number, and continue into role-based onboarding.</p>
        </div>
        {error ? <p className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <FormField label="Full name">
          <Input placeholder="Jina kamili" {...form.register('fullName')} />
        </FormField>
        <FormField label="Phone number">
          <Input placeholder="Namba ya simu" {...form.register('phoneNumber')} />
        </FormField>
        <FormField label="Password">
          <Input type="password" placeholder="Nenosiri" {...form.register('password')} />
        </FormField>
        <FormField label="Account type">
          <Select {...form.register('accountType')}>
            <option value="FARMER_YOUTH">Farmer / Youth</option>
            <option value="AGRI_SME">Agri-SME</option>
            <option value="PARTNER">Partner / Institution</option>
          </Select>
        </FormField>
        <Button className="w-full" type="submit">Continue to OTP</Button>
      </form>
    </Card>
  );
}

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

  return (
    <Card className="rounded-[2rem] p-6 md:p-7">
      <form
        className="space-y-5"
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
        <div className="space-y-2">
          <StatusPill tone="green">Secure sign in</StatusPill>
          <h2 className="font-headline text-3xl font-bold text-ink">Welcome back</h2>
          <p className="text-sm leading-6 text-muted">Sign in with your registered phone number and password to continue where you left off.</p>
        </div>
        {error ? <p className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <FormField label="Phone number">
          <Input placeholder="Namba ya simu" {...form.register('phoneNumber')} />
        </FormField>
        <FormField label="Password">
          <Input type="password" placeholder="Nenosiri" {...form.register('password')} />
        </FormField>
        <Button className="w-full" type="submit">Sign in</Button>
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
    <Card className="rounded-[2rem] p-6 md:p-7">
      <form
        className="space-y-5"
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
        <div className="space-y-2">
          <StatusPill tone="gold">OTP verification</StatusPill>
          <h2 className="font-headline text-3xl font-bold text-ink">Confirm your phone number</h2>
          <p className="text-sm leading-6 text-muted">Enter the 6-digit code sent to your phone. OTP resend remains rate-limited for security.</p>
        </div>
        {error ? <p className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <FormField label="Phone number">
          <Input placeholder="Namba ya simu" {...form.register('phoneNumber')} />
        </FormField>
        <FormField label="OTP code">
          <Input placeholder="OTP ya tarakimu 6" {...form.register('otpCode')} />
        </FormField>
        <div className="flex gap-3">
          <Button className="flex-1" type="submit">Verify</Button>
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
            {isResending ? 'Sending...' : cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Resend'}
          </Button>
        </div>
        {cooldownRemaining > 0 ? (
          <p className="text-sm text-muted">
            A new OTP can be requested after {cooldownRemaining} seconds.
          </p>
        ) : null}
      </form>
    </Card>
  );
}
