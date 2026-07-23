# Going live — setup checklist

The code is finished and deployed. Until the three environment variables below
are set, the site runs in **safe mode**: the buy buttons return a friendly
"payments aren't switched on yet" message and the portal keeps using the old
shared password. Nothing is broken; it just isn't selling yet.

Do these in order. Total time ~20 minutes.

---

## 1. Database (Neon Postgres — free)

Stores students, their credentials, and belt progress.

1. Go to <https://neon.tech> → sign up (free tier is plenty).
2. Create a project — name it `avt`.
3. Copy the **connection string** (starts `postgresql://…`, ends `?sslmode=require`).
4. In **Vercel → avt-website → Settings → Environment Variables**, add:
   - Name: `DATABASE_URL`
   - Value: the connection string
   - Environments: Production, Preview, Development

Tables are created automatically on first use — no migration to run.

---

## 2. Stripe (payments)

1. Go to <https://dashboard.stripe.com> → create/log into your account.
2. Complete **business verification** (Stripe requires this before you can accept
   live payments — do it early, it can take a day).
3. **Developers → API keys** → copy the **Secret key**.
   - Use the **test** key (`sk_test_…`) first to rehearse, then swap to live (`sk_live_…`).
4. Add to Vercel env vars:
   - Name: `STRIPE_SECRET_KEY`
   - Value: the secret key

> You do **not** create products in the Stripe dashboard — prices are defined in
> `src/lib/stripe.ts` ($297 course / $1,000 coaching) so they can never drift
> out of sync with the site. Change the price there and redeploy.

---

## 3. Stripe webhook (creates student accounts)

This is what turns a payment into a portal login. Without it, people can pay
but won't get an account.

1. **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://avt-website.vercel.app/api/stripe-webhook`
3. Events to send: select **`checkout.session.completed`**.
4. After creating it, click **Reveal** under *Signing secret* → copy (`whsec_…`).
5. Add to Vercel env vars:
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: the signing secret

---

## 4. Redeploy

Vercel → Deployments → **Redeploy** the latest. Env vars only apply to new builds.

---

## 5. Rehearse with a test purchase

While using the **test** keys:

1. Open the site, click **Get the Course — $297**.
2. Pay with Stripe's test card: `4242 4242 4242 4242`, any future expiry, any CVC.
3. You should land on `/success` and see a **username + password shown once**.
4. Save them, go to `/paid`, and log in with those credentials.
5. Take the Beginner Belt Test — passing should unlock the Intermediate belts,
   and that progress should still be there after logging out and back in.

If step 3 shows "Account still being created", the webhook isn't firing — recheck
step 3 above (URL and selected event).

Then swap both Stripe keys to **live** values and redeploy.

---

## How students, access and progress work

- On payment, the webhook creates a student row with a unique username.
- The password is generated **once, on the success page**, and only its scrypt
  hash is stored — plaintext is never saved anywhere, so it genuinely cannot be
  shown twice. If someone loses it, reset them manually (see below).
- Logging in **kills any other active session for that account**, so a shared
  login boots whoever was already using it. That's the anti-sharing lever.
- Belt tier tests write to the student's record, so progress follows the account.

### Seeing your students

In the Neon dashboard → SQL editor:

```sql
select username, email, product, belt_level, tier1_passed, tier2_passed,
       created_at, last_login_at
from students
order by created_at desc;
```

### Resetting someone's password

Clear their password so the reveal can run again, then send them their
`/success?session_id=…` link — or simpler, set a known password hash yourself.
The quickest path is to clear the flag and have them contact you:

```sql
update students set credentials_shown = false, password_hash = null
where username = 'their-username';
```

---

## Still outstanding (not blocking sales)

- The Discord invite in the code expired — generate a permanent one and replace
  `DISCORD` in `src/app/page.tsx`, `learn/page.tsx`, `paid/page.tsx`.
- Lesson videos are the placeholder-voice beta renders. Re-record and re-render
  to swap in your real voice (see `avt-course-videos/scripts/`).
- Signals + Autopilot are intentionally greyed out until the bot is rebuilt.
