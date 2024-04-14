This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Assignment submission

I have used nextJs for the assignment.
I have used the following libraries for the assignment:

1. For store I have used react-redux - For persisting data across multiple tabs I used redux-persist which uses local storage internally
2. For infinite scroll I have used react-infinite-scroller
3. For autocomplete I have used react-select-async-paginate
4. I have tried using tailwindcss utility classes for styling
5. All the pages are responsive in nature - using flex and grid
6. Added dynamic backgrounds based on few of the current weather conditions
7. Added simple history list of viewed locations

# Pages

1. Cities list page

   - displayed cities list in table
   - Added functionality to sort
   - Added autocomplete search for city name
   - On city name click I am navigating to weather detail page for that city ( Opening a new page as mentioned in requirement )
   - Added link to go to favorites page

2. Weather details page

   - Added section to display current weather details
   - Added UI to display list of weather predictions
   - Added Option to change the unit
   - Added Option add / remove favorite

3. favorites page
   - List all the favorites cities
   - Provide option to remove favorite

This application is deployed using Heroku - I already had an account created
