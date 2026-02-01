import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const task1Questions = [
  {
    title: "Complaint about a product",
    body: `You recently purchased a product online that arrived damaged. Write an email to the customer service department.

In your email:
- Describe the product and the damage
- Explain when and how you received it
- Request a replacement or full refund
- Ask for a response within one week`,
    sortOrder: 1,
  },
  {
    title: "Request for information",
    body: `You are interested in joining a local community centre. Write an email to the centre's administration.

In your email:
- Introduce yourself briefly
- Ask about membership fees and benefits
- Inquire about the facilities and programs offered
- Request a tour of the centre`,
    sortOrder: 2,
  },
  {
    title: "Apology for missing an event",
    body: `You were unable to attend a friend's birthday party. Write an email to your friend.

In your email:
- Apologize for not attending
- Explain briefly why you could not attend
- Suggest meeting soon to celebrate
- Wish them a belated happy birthday`,
    sortOrder: 3,
  },
  {
    title: "Thank-you for an interview",
    body: `You recently had a job interview. Write an email to the person who interviewed you.

In your email:
- Thank them for their time
- Mention one or two points from the interview that interested you
- Reiterate your interest in the position
- Ask about the next steps in the process`,
    sortOrder: 4,
  },
  {
    title: "Suggestion to improve a service",
    body: `You use a public library regularly. Write an email to the library manager with a suggestion.

In your email:
- Explain how often you use the library
- Describe one improvement you would suggest
- Explain how this would benefit users
- Offer to discuss the idea further`,
    sortOrder: 5,
  },
  {
    title: "Invitation to a team event",
    body: `Your department is organizing a team-building event. Write an email to your colleagues.

In your email:
- Describe the event and its purpose
- Give the date, time, and location
- Explain what participants should bring or prepare
- Ask them to confirm their attendance by a specific date`,
    sortOrder: 6,
  },
  {
    title: "Request for time off",
    body: `You need to take time off work for a family matter. Write an email to your manager.

In your email:
- Explain the reason for your request
- Specify the dates you need off
- Assure them your work will be covered
- Ask for confirmation`,
    sortOrder: 7,
  },
  {
    title: "Complaint about noise",
    body: `Your neighbour has been playing loud music late at night. Write an email to your building manager.

In your email:
- Describe the noise problem
- Explain how it affects you
- Suggest a solution (e.g. quiet hours)
- Request that the manager address the issue`,
    sortOrder: 8,
  },
  {
    title: "Request for a reference",
    body: `You are applying for a course and need a reference. Write an email to a former teacher or employer.

In your email:
- Remind them who you are and your connection
- Explain what you are applying for
- Ask if they would be willing to provide a reference
- Give the deadline and how to submit it`,
    sortOrder: 9,
  },
  {
    title: "Feedback on a course",
    body: `You have just completed an online course. Write an email to the course provider with feedback.

In your email:
- Say what you liked about the course
- Suggest one or two improvements
- Mention whether you would recommend it to others
- Thank the instructors or team`,
    sortOrder: 10,
  },
];

const task2Questions = [
  {
    title: "Community: Park vs. Shopping mall",
    body: `Your city has funding for one of two projects:

Option A: Build a new public park with green space, playgrounds, and walking paths.
Option B: Build a new shopping mall with stores, a food court, and a cinema.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 1,
  },
  {
    title: "Transport: More buses vs. More bike lanes",
    body: `Your city wants to improve local transport. It must choose one focus:

Option A: Add more buses and extend bus routes to more neighbourhoods.
Option B: Build more dedicated bike lanes and bike-sharing stations.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 2,
  },
  {
    title: "Education: Longer school year vs. Longer school days",
    body: `A school district is considering changes to the academic calendar:

Option A: Keep the same school day length but extend the school year by two weeks.
Option B: Keep the same number of school days but make each school day one hour longer.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 3,
  },
  {
    title: "Work: Remote work vs. Office work",
    body: `A company is deciding its long-term work policy:

Option A: Employees work from home most of the time and come to the office only when needed.
Option B: Employees work in the office most of the time, with limited work-from-home days.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 4,
  },
  {
    title: "Environment: Recycling vs. Reducing plastic",
    body: `A town wants to reduce waste. It must prioritize one approach:

Option A: Expand recycling programs and make recycling easier for residents.
Option B: Ban single-use plastic items (e.g. bags, straws) in local businesses.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 5,
  },
  {
    title: "Lifestyle: Gym membership vs. Outdoor activities",
    body: `You want to improve your fitness. You can commit to one main approach:

Option A: Join a gym and go regularly for classes and equipment.
Option B: Focus on outdoor activities such as running, cycling, or hiking.

Which option do you prefer? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 6,
  },
  {
    title: "Housing: High-rises vs. Townhouses",
    body: `Your city needs more housing. It is deciding between two types of development:

Option A: Build more high-rise apartment buildings in the city centre.
Option B: Build more townhouse communities in suburban areas.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 7,
  },
  {
    title: "Healthcare: More clinics vs. More hospital beds",
    body: `A region is investing in healthcare. It must choose one priority:

Option A: Open more walk-in clinics and family doctor offices in neighbourhoods.
Option B: Add more hospital beds and expand emergency departments.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 8,
  },
  {
    title: "Culture: Museum vs. Concert hall",
    body: `A city has funds for one new cultural venue:

Option A: A new museum focused on local history and art.
Option B: A new concert hall for live music and performances.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 9,
  },
  {
    title: "Technology: Free public Wi‑Fi vs. Computer labs",
    body: `A community wants to improve digital access. It can fund one initiative:

Option A: Free public Wi-Fi in parks, libraries, and community centres.
Option B: Public computer labs with free access and basic training for residents.

Which option do you support? Write a response explaining your choice. Give reasons and examples.`,
    sortOrder: 10,
  },
];

async function main() {
  await prisma.exampleQuestion.deleteMany({});

  for (const q of task1Questions) {
    await prisma.exampleQuestion.create({
      data: { taskType: 1, title: q.title, body: q.body, sortOrder: q.sortOrder },
    });
  }
  for (const q of task2Questions) {
    await prisma.exampleQuestion.create({
      data: { taskType: 2, title: q.title, body: q.body, sortOrder: q.sortOrder },
    });
  }

  console.log("Seeded 10 Task 1 and 10 Task 2 example questions.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
