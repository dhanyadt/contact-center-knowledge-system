require("dotenv").config();
const mongoose = require("mongoose");

const Category = require("./models/Category");
const Question = require("./models/Question");
const Answer   = require("./models/Answer");

async function seedDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected for Seeding");

  await Category.deleteMany();
  await Question.deleteMany();
  await Answer.deleteMany();

  // ─────────────────────────────────────────────────────────
  // CATEGORY 1 — Network Troubleshooting
  // ─────────────────────────────────────────────────────────
  const network = await Category.create({ name: "Network Troubleshooting" });

  // Q1 → root question
  const netQ1 = await Question.create({
    text: "What best describes your network issue?",
    category_id: network._id
  });

  // Branch A: Can't connect at all
  const netQ2 = await Question.create({
    text: "Are any other devices able to connect to the same WiFi network?",
    category_id: network._id
  });

  const netQ3 = await Question.create({
    text: "Have you tried restarting your router by unplugging it for 30 seconds?",
    category_id: network._id
  });

  const netQ4 = await Question.create({
    text: "Is the router's power light solid (not blinking or off)?",
    category_id: network._id
  });

  // Branch B: Slow internet
  const netQ5 = await Question.create({
    text: "Is the slowness happening on all devices or just one?",
    category_id: network._id
  });

  const netQ6 = await Question.create({
    text: "Are you currently running any large downloads, streaming, or backups?",
    category_id: network._id
  });

  const netQ7 = await Question.create({
    text: "How far are you from the router?",
    category_id: network._id
  });

  // Branch C: Keeps disconnecting
  const netQ8 = await Question.create({
    text: "How often does it disconnect?",
    category_id: network._id
  });

  const netQ9 = await Question.create({
    text: "Does the issue happen at a specific time of day (e.g. evenings)?",
    category_id: network._id
  });

  // Answers for netQ1
  await Answer.create({ answer_text: "I can't connect to WiFi at all",   question_id: netQ1._id, next_question_id: netQ2._id });
  await Answer.create({ answer_text: "My internet is very slow",          question_id: netQ1._id, next_question_id: netQ5._id });
  await Answer.create({ answer_text: "It keeps disconnecting randomly",   question_id: netQ1._id, next_question_id: netQ8._id });
  await Answer.create({ answer_text: "WiFi signal is weak in some areas", question_id: netQ1._id, solution_text: "Try moving your router to a more central location, away from walls and appliances. If the issue persists, consider a WiFi extender or mesh network system for better coverage throughout your home." });

  // Answers for netQ2 (Can't connect — other devices?)
  await Answer.create({ answer_text: "Yes, other devices connect fine",   question_id: netQ2._id, solution_text: "The issue is likely with your specific device. Try forgetting the WiFi network on your device, then reconnect by entering the password again. Also check that WiFi is enabled and Airplane Mode is off." });
  await Answer.create({ answer_text: "No, nothing can connect",           question_id: netQ2._id, next_question_id: netQ3._id });

  // Answers for netQ3 (Tried restarting router?)
  await Answer.create({ answer_text: "Yes, still not working",            question_id: netQ3._id, next_question_id: netQ4._id });
  await Answer.create({ answer_text: "Not yet — I'll try that now",       question_id: netQ3._id, solution_text: "Unplug your router from the power outlet, wait 30 seconds, then plug it back in. Give it 2 minutes to fully restart. Most connection issues are resolved by a simple reboot." });

  // Answers for netQ4 (Router power light?)
  await Answer.create({ answer_text: "The power light is solid",          question_id: netQ4._id, solution_text: "Your router appears to be on but not providing internet. Check the WAN/Internet cable running from your router to the wall socket and make sure it is firmly plugged in. If the issue continues, contact your internet service provider — there may be an outage in your area." });
  await Answer.create({ answer_text: "The power light is blinking or off",question_id: netQ4._id, solution_text: "Your router may have a hardware fault or a power issue. Check the power adapter connection. If the router won't power on properly after a re-plug, you may need to replace it or contact your ISP for a replacement unit." });

  // Answers for netQ5 (Slow — all devices or one?)
  await Answer.create({ answer_text: "All devices are slow",              question_id: netQ5._id, next_question_id: netQ6._id });
  await Answer.create({ answer_text: "Just one device is slow",           question_id: netQ5._id, solution_text: "The issue is isolated to one device. Restart that device and clear its DNS cache. On Windows, open Command Prompt and run 'ipconfig /flushdns'. On Mac, run 'sudo dscacheutil -flushcache'. Also try disabling any VPN or proxy." });

  // Answers for netQ6 (Heavy downloads running?)
  await Answer.create({ answer_text: "Yes, there are active downloads or streams", question_id: netQ6._id, solution_text: "Bandwidth-heavy activity is the likely cause. Pause large downloads, limit video quality on streaming services, and check if cloud backup software (iCloud, Dropbox, Google Drive) is syncing in the background. Speeds should improve immediately once those are paused." });
  await Answer.create({ answer_text: "No, nothing heavy is running",      question_id: netQ6._id, next_question_id: netQ7._id });

  // Answers for netQ7 (Distance from router?)
  await Answer.create({ answer_text: "I'm in the same room as the router", question_id: netQ7._id, solution_text: "You're close to the router but still slow — this suggests an ISP or router issue. Restart your router and run a speed test at fast.com. If speeds are significantly below your plan, contact your ISP and report the issue with your speed test results." });
  await Answer.create({ answer_text: "I'm in another room or far away",   question_id: netQ7._id, solution_text: "Distance and walls are reducing your signal. Try moving closer to the router temporarily to confirm. For a permanent fix, consider a WiFi extender, powerline adapter, or upgrading to a mesh WiFi system for full-home coverage." });

  // Answers for netQ8 (Keeps disconnecting — how often?)
  await Answer.create({ answer_text: "Every few minutes",                 question_id: netQ8._id, solution_text: "Frequent drops this often usually indicate a faulty router, damaged cable, or ISP line issue. Restart your router, check all cables for damage, and run a continuous ping test. If drops persist, contact your ISP with the ping test log." });
  await Answer.create({ answer_text: "A few times a day",                 question_id: netQ8._id, next_question_id: netQ9._id });
  await Answer.create({ answer_text: "Only occasionally",                 question_id: netQ8._id, solution_text: "Occasional drops can be caused by router firmware or interference from nearby devices. Check your router manufacturer's website for a firmware update. Also try changing your WiFi channel in the router settings — channel 1, 6, or 11 are best for 2.4GHz networks." });

  // Answers for netQ9 (Specific time of day?)
  await Answer.create({ answer_text: "Yes, mainly evenings or peak hours", question_id: netQ9._id, solution_text: "Evening slowdowns and drops are typically caused by network congestion in your area. This is an ISP-level issue. Contact your provider to report the pattern — many ISPs can prioritise your line or offer a plan upgrade. Switching to a 5GHz band on your router can also help reduce congestion." });
  await Answer.create({ answer_text: "No, it's random throughout the day", question_id: netQ9._id, solution_text: "Random disconnections throughout the day suggest a router or line fault. Try updating your router firmware and swapping the ethernet cable between the router and wall socket. If the problem continues after 48 hours, raise a fault with your ISP for a line check." });


  // ─────────────────────────────────────────────────────────
  // CATEGORY 2 — Billing Issues
  // ─────────────────────────────────────────────────────────
  const billing = await Category.create({ name: "Billing Issues" });

  const bilQ1 = await Question.create({
    text: "What is your billing issue about?",
    category_id: billing._id
  });

  // Branch A: Unexpected charge
  const bilQ2 = await Question.create({
    text: "Do you recognise the charge but think the amount is wrong?",
    category_id: billing._id
  });

  const bilQ3 = await Question.create({
    text: "Was the charge posted in the last 3 days?",
    category_id: billing._id
  });

  // Branch B: Update payment method
  const bilQ4 = await Question.create({
    text: "What do you need to update?",
    category_id: billing._id
  });

  // Branch C: Request a refund
  const bilQ5 = await Question.create({
    text: "What is the reason for your refund request?",
    category_id: billing._id
  });

  const bilQ6 = await Question.create({
    text: "Was the purchase made within the last 30 days?",
    category_id: billing._id
  });

  // Branch D: Subscription / plan
  const bilQ7 = await Question.create({
    text: "What would you like to do with your subscription?",
    category_id: billing._id
  });

  const bilQ8 = await Question.create({
    text: "Are you within your current billing period?",
    category_id: billing._id
  });

  // Answers for bilQ1
  await Answer.create({ answer_text: "I was charged unexpectedly",          question_id: bilQ1._id, next_question_id: bilQ2._id });
  await Answer.create({ answer_text: "I need to update my payment method",  question_id: bilQ1._id, next_question_id: bilQ4._id });
  await Answer.create({ answer_text: "I'd like to request a refund",        question_id: bilQ1._id, next_question_id: bilQ5._id });
  await Answer.create({ answer_text: "I have a question about my plan",     question_id: bilQ1._id, next_question_id: bilQ7._id });

  // Answers for bilQ2 (Unexpected charge — recognise it?)
  await Answer.create({ answer_text: "Yes, the amount looks wrong",         question_id: bilQ2._id, solution_text: "If you recognise the merchant but the amount seems incorrect, compare it to your plan details or last invoice in your account under Billing History. Discrepancies are often due to proration when upgrading or downgrading mid-cycle. Contact our billing team with your invoice number for a detailed breakdown." });
  await Answer.create({ answer_text: "No, I don't recognise this charge at all", question_id: bilQ2._id, next_question_id: bilQ3._id });

  // Answers for bilQ3 (Posted in last 3 days?)
  await Answer.create({ answer_text: "Yes, it's very recent",               question_id: bilQ3._id, solution_text: "Very recent unrecognised charges can be temporary authorisation holds, which disappear within 3–5 business days without any action needed. If the charge is still present after 5 days, contact our billing team immediately with your bank statement and we will investigate and issue a refund if confirmed." });
  await Answer.create({ answer_text: "No, it's been there a while",         question_id: bilQ3._id, solution_text: "An older unrecognised charge needs immediate attention. Log in to your account and check Active Subscriptions — you may have an add-on you forgot about. If you still cannot account for the charge, contact our billing team with the date and amount and we will trace and refund it within 2 business days." });

  // Answers for bilQ4 (Update payment — what?)
  await Answer.create({ answer_text: "Credit or debit card",                question_id: bilQ4._id, solution_text: "To update your card: go to Settings → Billing → Payment Methods and click 'Add new card'. Once saved, set it as the default. Your old card will be charged until the default is changed, so do this before your next billing date." });
  await Answer.create({ answer_text: "Billing address",                     question_id: bilQ4._id, solution_text: "Go to Settings → Billing → Billing Address and click Edit. Update your address and save. The new address will appear on your next invoice. Note: changing your billing address to a different country may affect applicable taxes." });
  await Answer.create({ answer_text: "Bank account or direct debit",        question_id: bilQ4._id, solution_text: "To update bank details, go to Settings → Billing → Payment Methods and select 'Add bank account'. You'll need your account number and sort code (UK) or routing number (US). Direct debit changes take one billing cycle to activate, so keep your existing method active in the meantime." });

  // Answers for bilQ5 (Refund reason?)
  await Answer.create({ answer_text: "I was charged after cancelling",      question_id: bilQ5._id, solution_text: "If you were charged after cancelling, please contact our billing team with your cancellation confirmation email and the charge date. We will verify the cancellation timestamp and issue a full refund within 5 business days if the charge was in error." });
  await Answer.create({ answer_text: "I was double-charged",                question_id: bilQ5._id, solution_text: "Double charges are rare but do occur. Please check your bank statement and your invoice history in Settings → Billing. If both charges appear as fully settled (not pending), contact our billing team with both transaction references and we will refund the duplicate immediately." });
  await Answer.create({ answer_text: "The service didn't work as expected", question_id: bilQ5._id, next_question_id: bilQ6._id });

  // Answers for bilQ6 (Within 30 days?)
  await Answer.create({ answer_text: "Yes, within 30 days",                 question_id: bilQ6._id, solution_text: "You are within our 30-day satisfaction guarantee window. Contact our billing team with your order number and a brief description of the issue. We will review and process an eligible refund within 3 business days." });
  await Answer.create({ answer_text: "No, it was more than 30 days ago",    question_id: bilQ6._id, solution_text: "Our standard refund window is 30 days from purchase. Requests outside this period are reviewed on a case-by-case basis. Please contact our billing team explaining the circumstances — we will do our best to find a fair resolution for you." });

  // Answers for bilQ7 (Subscription actions?)
  await Answer.create({ answer_text: "Upgrade my plan",                     question_id: bilQ7._id, solution_text: "To upgrade: go to Settings → Billing → Current Plan and click 'Upgrade'. You'll see available plans with pricing. Upgrades take effect immediately and you are charged a prorated amount for the remainder of the billing cycle." });
  await Answer.create({ answer_text: "Downgrade my plan",                   question_id: bilQ7._id, solution_text: "To downgrade: go to Settings → Billing → Current Plan and click 'Change Plan'. Downgrades take effect at the end of your current billing period — you keep full access to your current plan until then. No prorated refund is issued for downgrades mid-cycle." });
  await Answer.create({ answer_text: "Cancel my subscription",              question_id: bilQ7._id, next_question_id: bilQ8._id });
  await Answer.create({ answer_text: "Pause my subscription",               question_id: bilQ7._id, solution_text: "You can pause your subscription for up to 3 months from Settings → Billing → Manage Subscription → Pause. Billing stops during the pause and resumes automatically when the pause period ends. Your data and settings are preserved throughout." });

  // Answers for bilQ8 (Cancelling — within billing period?)
  await Answer.create({ answer_text: "Yes, I just want to cancel now",      question_id: bilQ8._id, solution_text: "To cancel: go to Settings → Billing → Manage Subscription → Cancel Subscription. Your access continues until the end of your paid period. After cancellation you will receive a confirmation email. If you don't receive it within 10 minutes, check your spam folder or contact support." });
  await Answer.create({ answer_text: "I already tried to cancel but was still charged", question_id: bilQ8._id, solution_text: "If you completed the cancellation flow and were still charged, this is an error on our side. Please contact our billing team with your cancellation confirmation email and the charge date. We will verify and refund you within 2 business days." });


  // ─────────────────────────────────────────────────────────
  // CATEGORY 3 — Account Management
  // ─────────────────────────────────────────────────────────
  const account = await Category.create({ name: "Account Management" });

  const accQ1 = await Question.create({
    text: "What do you need help with on your account?",
    category_id: account._id
  });

  // Branch A: Can't log in
  const accQ2 = await Question.create({
    text: "What happens when you try to log in?",
    category_id: account._id
  });

  const accQ3 = await Question.create({
    text: "Did you recently change your password or email address?",
    category_id: account._id
  });

  const accQ4 = await Question.create({
    text: "Do you still have access to the email address on the account?",
    category_id: account._id
  });

  // Branch B: Change account details
  const accQ5 = await Question.create({
    text: "What would you like to change?",
    category_id: account._id
  });

  const accQ6 = await Question.create({
    text: "Do you have access to your current registered email?",
    category_id: account._id
  });

  // Branch C: Security concern
  const accQ7 = await Question.create({
    text: "What is the security concern?",
    category_id: account._id
  });

  const accQ8 = await Question.create({
    text: "Are you still able to log in to the account?",
    category_id: account._id
  });

  // Branch D: Delete account
  const accQ9 = await Question.create({
    text: "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
    category_id: account._id
  });

  // Answers for accQ1
  await Answer.create({ answer_text: "I can't log in to my account",          question_id: accQ1._id, next_question_id: accQ2._id });
  await Answer.create({ answer_text: "I want to change my account details",    question_id: accQ1._id, next_question_id: accQ5._id });
  await Answer.create({ answer_text: "I have a security concern",              question_id: accQ1._id, next_question_id: accQ7._id });
  await Answer.create({ answer_text: "I want to delete my account",            question_id: accQ1._id, next_question_id: accQ9._id });
  await Answer.create({ answer_text: "I need to manage team members or users", question_id: accQ1._id, solution_text: "To manage users on your account: go to Settings → Team. From there you can invite new members by email, assign roles (Admin, Agent, Viewer), remove existing members, and resend pending invitations. Only Admins can manage team members." });

  // Answers for accQ2 (Can't log in — what happens?)
  await Answer.create({ answer_text: "It says my password is incorrect",       question_id: accQ2._id, solution_text: "Click 'Forgot password' on the login page and enter your email. A reset link will arrive within 5 minutes — check your spam folder if it doesn't appear. The link expires after 30 minutes. Once reset, log in with your new password and consider saving it in a password manager." });
  await Answer.create({ answer_text: "It says my account doesn't exist",       question_id: accQ2._id, next_question_id: accQ3._id });
  await Answer.create({ answer_text: "My account is locked or suspended",      question_id: accQ2._id, solution_text: "Accounts are locked after 10 failed login attempts as a security measure. The lock automatically lifts after 30 minutes. If your account has been suspended for a different reason, contact our support team with your email address and we will investigate within 1 business day." });
  await Answer.create({ answer_text: "Two-factor authentication is not working", question_id: accQ2._id, solution_text: "If your 2FA code is not working, make sure your device clock is synced to the correct time (2FA codes are time-sensitive). Try using a backup code from when you first set up 2FA. If you don't have backup codes, contact support with government ID to verify your identity and disable 2FA." });

  // Answers for accQ3 (Recently changed password/email?)
  await Answer.create({ answer_text: "Yes, I changed it recently",             question_id: accQ3._id, solution_text: "If you recently changed your email, the old address will no longer work. Try logging in with the new email address. If you've forgotten the new one, contact support with proof of identity and we'll help you recover access." });
  await Answer.create({ answer_text: "No, nothing has changed",                question_id: accQ3._id, next_question_id: accQ4._id });

  // Answers for accQ4 (Access to email?)
  await Answer.create({ answer_text: "Yes, I can access my email",             question_id: accQ4._id, solution_text: "If you have access to your registered email but your account doesn't exist, you may have signed up with a different email address. Try any other email you might have used. You can also use the 'Find my account' link on the login page to search by name or phone number." });
  await Answer.create({ answer_text: "No, I've lost access to that email",     question_id: accQ4._id, solution_text: "Without access to the registered email, recovery requires identity verification. Contact our support team with: (1) your full name, (2) the email you think was used, (3) a government-issued photo ID. We will verify and help you transfer the account to a new email within 2 business days." });

  // Answers for accQ5 (Change details — what?)
  await Answer.create({ answer_text: "My email address",                        question_id: accQ5._id, next_question_id: accQ6._id });
  await Answer.create({ answer_text: "My password",                             question_id: accQ5._id, solution_text: "To change your password: log in and go to Settings → Security → Change Password. Enter your current password, then your new one (minimum 8 characters, mix of letters and numbers recommended). You'll be sent a confirmation email. If you don't know your current password, log out and use 'Forgot password' on the login page." });
  await Answer.create({ answer_text: "My name or profile information",          question_id: accQ5._id, solution_text: "To update your profile: go to Settings → Profile. You can change your display name, phone number, profile photo, and notification preferences. Changes save instantly. Note: your legal name on billing documents is updated separately under Settings → Billing." });
  await Answer.create({ answer_text: "My notification preferences",             question_id: accQ5._id, solution_text: "To manage notifications: go to Settings → Notifications. You can toggle email notifications, SMS alerts, and in-app notifications for each event type (new tickets, billing alerts, security alerts). Changes take effect immediately." });

  // Answers for accQ6 (Have access to current email?)
  await Answer.create({ answer_text: "Yes",                                     question_id: accQ6._id, solution_text: "To change your email: go to Settings → Profile → Email Address and click Edit. Enter your new email address and confirm. A verification link will be sent to BOTH your old and new email addresses — you must click both to complete the change. This ensures security and prevents unauthorised changes." });
  await Answer.create({ answer_text: "No, I've lost access to my email",        question_id: accQ6._id, solution_text: "Changing your email without access to the old one requires a manual verification. Contact support with your full name, current username, and a photo ID. We will verify your identity and update the email address directly within 2 business days." });

  // Answers for accQ7 (Security concern — what?)
  await Answer.create({ answer_text: "I think my account has been hacked",      question_id: accQ7._id, next_question_id: accQ8._id });
  await Answer.create({ answer_text: "I received a suspicious email or link",   question_id: accQ7._id, solution_text: "Do not click any links in the suspicious message. Forward the email to security@supportiq.com so our team can investigate. We will never ask for your password or payment details over email. If you clicked a link and entered details, change your password immediately and enable 2FA." });
  await Answer.create({ answer_text: "I want to enable two-factor authentication", question_id: accQ7._id, solution_text: "To enable 2FA: go to Settings → Security → Two-Factor Authentication and click Enable. You can use an authenticator app (Google Authenticator, Authy) or receive codes via SMS. Save your backup codes in a secure place — these are the only way to recover access if you lose your device." });
  await Answer.create({ answer_text: "I want to review active login sessions",  question_id: accQ7._id, solution_text: "To review active sessions: go to Settings → Security → Active Sessions. You'll see a list of all logged-in devices with their location and last activity. Click 'Log out' next to any session you don't recognise. You can also click 'Log out all other devices' to immediately end all other sessions." });

  // Answers for accQ8 (Hacked — still able to log in?)
  await Answer.create({ answer_text: "Yes, I can still log in",                 question_id: accQ8._id, solution_text: "Act immediately: (1) Change your password under Settings → Security → Change Password. (2) Go to Settings → Security → Active Sessions and log out all unrecognised devices. (3) Enable two-factor authentication. (4) Check Settings → Profile for any changes you didn't make. (5) Contact support to flag your account for monitoring." });
  await Answer.create({ answer_text: "No, I've been locked out",                question_id: accQ8._id, solution_text: "This is urgent — contact our security team immediately at security@supportiq.com with your full name and registered email. Include any evidence of unauthorised access (login location alerts, unfamiliar changes). We will prioritise your case, freeze the account to prevent further damage, and help you regain access within 4 hours." });

  // Answers for accQ9 (Delete account — are you sure?)
  await Answer.create({ answer_text: "Yes, I want to permanently delete my account", question_id: accQ9._id, solution_text: "To delete your account: go to Settings → Account → Delete Account. You'll be asked to type 'DELETE' to confirm. All your data will be permanently removed within 30 days as per our data retention policy. Any active subscriptions will be cancelled and no further charges made. This action cannot be reversed." });
  await Answer.create({ answer_text: "I just want to take a break, not delete", question_id: accQ9._id, solution_text: "Instead of deleting, consider deactivating your account temporarily. Go to Settings → Account → Deactivate Account. Your data is preserved and you can reactivate at any time by logging back in. Your subscription will be paused and billing stopped during deactivation." });
  await Answer.create({ answer_text: "Actually, I changed my mind",             question_id: accQ9._id, solution_text: "No problem at all! Your account is unchanged. If there's something specific that made you consider deleting, our support team is happy to help. Feel free to explore Settings → Account or contact us directly." });

  console.log("✅ Database seeded successfully with Network, Billing, and Account data.");
  process.exit();
}

seedDB();