'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { logout } from '@/api/auth';
import { changePassword } from '@/api/profile-client';
import { CTAButtonRow, FormField } from '@/components/app/forms';
import { StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[a-z]/, 'New password must include a lower-case letter')
    .regex(/[A-Z]/, 'New password must include an upper-case letter')
    .regex(/\d/, 'New password must include a number'),
  confirmNewPassword: z.string().min(8, 'Confirm your new password')
}).refine((values) => values.newPassword === values.confirmNewPassword, {
  message: 'New password confirmation does not match',
  path: ['confirmNewPassword']
});

export function LogoutButton({
  locale,
  className,
  label = 'Logout',
  variant = 'ghost'
}: {
  locale: string;
  className?: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
}) {
  const router = useRouter();

  return (
    <Button
      className={className}
      type="button"
      variant={variant}
      onClick={async () => {
        await logout();
        router.replace(`/${locale}/login`);
        router.refresh();
      }}
    >
      {label}
    </Button>
  );
}

export function AccountSecuritySection({
  locale,
  roleLabel
}: {
  locale: string;
  roleLabel: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema)
  });

  return (
    <Card className="space-y-6 rounded-[2rem] p-6">
      <div className="space-y-2">
        <StatusPill tone="dark">Account settings</StatusPill>
        <h2 className="font-headline text-3xl font-bold text-ink">Security</h2>
        <p className="text-sm leading-6 text-muted">
          Signed in as {roleLabel}. Update your password here and sign out safely from this browser session.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await changePassword(values);
            form.reset();
            router.refresh();
          } catch (cause) {
            form.setError('root', {
              message: cause instanceof Error ? cause.message : 'Unable to change password'
            });
          }
        })}
      >
        {form.formState.errors.root?.message ? (
          <p className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {form.formState.errors.root.message}
          </p>
        ) : null}
        {form.formState.isSubmitSuccessful ? (
          <p className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Password updated successfully.
          </p>
        ) : null}
        <FormField label="Current password">
          <Input type="password" placeholder="Current password" {...form.register('currentPassword')} />
        </FormField>
        <FormField label="New password" hint="Use at least 8 characters with upper-case, lower-case, and numeric characters.">
          <Input type="password" placeholder="New password" {...form.register('newPassword')} />
        </FormField>
        <FormField label="Confirm new password">
          <Input type="password" placeholder="Confirm new password" {...form.register('confirmNewPassword')} />
        </FormField>
        <CTAButtonRow
          primary={<Button className="w-full md:w-auto" type="submit">Change password</Button>}
          secondary={<LogoutButton locale={locale} label="Logout from this browser" variant="secondary" className="w-full md:w-auto" />}
          className="md:flex-row md:items-center md:justify-between"
        />
      </form>
    </Card>
  );
}
