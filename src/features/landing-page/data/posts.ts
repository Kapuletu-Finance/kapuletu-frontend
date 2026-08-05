export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    author: "KapuLetu Team",
    authorRole: "Founding Team",
    category: "Product",
    content: `
## The Problem

Across Kenya, millions of people participate in chamas, welfare groups, investment clubs, and community associations. These groups pool resources to fund projects, support members, and build wealth together. Yet most treasurers still rely on paper notebooks, Excel spreadsheets, and manual WhatsApp messages to track contributions and expenses.

This leads to:
- Lost records when notebooks go missing or spreadsheets corrupt
- Disputes when members disagree on contribution balances
- Time waste as treasurers spend hours reconciling payments manually
- Lack of transparency that erodes trust within groups

## Our Solution

KapuLetu is a secure, modern platform built specifically for the way Kenyan groups manage money. We provide:

- A transparent ledger that tracks every contribution and expense in real time
- Automated reminders via SMS and email so members never miss payments
- Campaign management for fundraising goals with progress tracking
- Evidence management so every inbox has a receipt or proof attached
- WhatsApp integration to share summaries directly with group members

## Why "KapuLetu"?

The name combines "Kapu" (from the concept of a container or treasury) with "Letu" (meaning "ours" in Swahili). It reflects our belief that group finances should be managed collectively, transparently, and securely — it's our treasury.

## What's Next

We are continuously building features based on feedback from real treasurers. Our roadmap includes enhanced reporting, multi-currency support, and deeper integrations with mobile money providers in Kenya.

If you are a treasurer, committee member, or group leader looking for a better way to manage your group's finances, we'd love to have you on board.
    `,
    date: "2026-07-10",
    excerpt:
      "Every year, thousands of Kenyan chamas, welfare groups, and associations struggle with manual bookkeeping. We built KapuLetu to change that.",
    slug: "why-kapuletu-exists",
    title: "Why We Built KapuLetu: Solving Treasury Headaches for Kenyan Groups",
  },
  {
    author: "KapuLetu Team",
    authorRole: "Founding Team",
    category: "Team",
    content: `
## Our Mission

We are a small, focused team based in Nairobi, Kenya, driven by a shared belief: every community group deserves access to professional-grade financial tools, regardless of size or technical expertise.

## The People

Our team combines experience in software engineering, fintech, and community organizing. We have worked with banks, mobile money platforms, and grassroots organizations across East Africa.

What connects us is a passion for building tools that make a real difference in how people manage money together. We have seen firsthand the challenges treasurers face — late-night reconciliation sessions, disputes over missing contributions, and the anxiety of managing other people's money without proper tools.

## Our Approach

We build KapuLetu with three principles:

1. Security first — Group finances are sensitive. We use bank-grade encryption, secure authentication, and role-based access controls to protect every inbox.

2. Simplicity — A treasurer should not need to be a tech expert to use our platform. We design for the person who manages a chama on their phone between work and family commitments.

3. Transparency by design — Every feature in KapuLetu is built to increase visibility and accountability. When everyone can see the same accurate records, trust follows naturally.

## Join Us

We are always looking to connect with treasurers, group leaders, and anyone passionate about financial inclusion in Kenya. If you have feedback, ideas, or just want to say hello, reach out at info@kapuletu.co.ke.
    `,
    date: "2026-07-05",
    excerpt:
      "Get to know the people building KapuLetu — a team passionate about financial transparency and technology for community organizations.",
    slug: "meet-the-team",
    title: "Meet the Team Behind KapuLetu",
  },
  {
    author: "KapuLetu Team",
    authorRole: "Product & Engineering",
    category: "Guide",
    content: `
## Why Go Digital?

If you are a treasurer still using a notebook or Excel, you already know the pain: manual entries take hours, tracking down discrepancies is stressful, and sharing updated balances with members is a constant battle.

Going digital with KapuLetu means your records are always up to date, accessible from anywhere, and shared transparently with your group.

## Step 1: Create Your Group

Sign up at kapuletu.co.ke and create your group. You will set up your group name, invite members, and assign roles. The treasurer role gives you full access to financial features while keeping other members focused on their contributions.

## Step 2: Record Your Existing Balances

KapuLetu lets you import your current member balances so you do not have to start from zero. Enter each member's standing, and the platform picks up from there.

## Step 3: Start Logging Inbox

Every contribution, expense, and payout gets recorded in the ledger. Attach receipts, add descriptions, and categorize entries. The ledger updates in real time, and every member can view their own balance.

## Step 4: Set Up Automated Reminders

Configure payment schedules and let KapuLetu handle the reminders. Members receive SMS and email notifications before due dates, reducing late payments and the awkward follow-up conversations treasurers often have to lead.

## Step 5: Run Campaigns

Need to raise funds for a specific project? Create a campaign with a target amount and deadline. Track progress visually and share updates with members.

## Step 6: Generate Reports

At the end of every month or quarter, generate a summary report of all inbox. Export it or share it directly with your group for full accountability.

## Tips for a Smooth Transition

- Start small: Begin with one group and one type of inbox before scaling
- Involve your group: Share the platform link so members can view their own records
- Use evidence uploads: Attach receipts to every inbox for a complete audit trail
- Leverage WhatsApp sharing: Send ledger summaries directly to your group chat
    `,
    date: "2026-06-28",
    excerpt:
      "Switching from manual bookkeeping to a digital platform can feel daunting. Here is a step-by-step guide for treasurers ready to modernize.",
    slug: "digital-treasury-management-guide",
    title: "A Treasurer's Guide to Going Digital with KapuLetu",
  },
  {
    author: "KapuLetu Team",
    authorRole: "Community & Partnerships",
    category: "Insights",
    content: `
## The Trust Challenge

Every group — whether a chama, welfare committee, or investment club — depends on trust. Members contribute money expecting it to be managed responsibly. When records are opaque or disputes arise, that trust breaks down, sometimes irreparably.

Research consistently shows that financial transparency is the single most important factor in member satisfaction within community organizations. Groups with clear, accessible records retain members longer and attract new contributors.

## How Transparency Works in Practice

Transparent financial management means:
- Every inbox is recorded with date, amount, description, and supporting evidence
- Balances are visible to authorized members in real time
- Reports are generated regularly and shared with the group
- Discrepancies are identified quickly before they become disputes

## Where KapuLetu Fits In

KapuLetu was built to make transparency effortless. Rather than requiring treasurers to manually share updates or compile reports, the platform does it automatically:

- The ledger provides a real-time view of all financial activity
- Role-based access ensures members see what they should while treasurers manage the full picture
- Evidence management lets you attach receipts and proof to every entry
- WhatsApp sharing makes it easy to push updates to group chats where members already communicate

## The Ripple Effect

When groups operate transparently, several positive outcomes follow:
- Reduced disputes because records are shared and verifiable
- Increased contributions as members see their money is being tracked properly
- Better planning with accurate financial data for budgets and forecasts
- Stronger community bonds built on mutual accountability

Financial transparency is not just a best practice — it is a competitive advantage for community organizations looking to grow and thrive.
    `,
    date: "2026-06-15",
    excerpt:
      "Trust is the foundation of every successful group. Here is how transparent financial records strengthen community organizations.",
    slug: "building-trust-through-transparency",
    title: "Building Trust Through Financial Transparency",
  },
];

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);
