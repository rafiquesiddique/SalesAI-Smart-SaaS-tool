Think of your application like building a house:

Configuration Files: The architect's blueprints and city permits.
src Folder: The house itself and everything inside it.
Components: The prefabricated parts like windows, doors, and kitchen cabinets.
Pages: The finished rooms, like the living room or kitchen.
High-Level Overview: How it Runs
You type npm run dev.
Vite (the build tool) reads vite.config.js and package.json to start a development server.
The browser opens index.html.
index.html loads src/main.jsx.
main.jsx tells React to build your <App /> inside the <div id="root">.
<App /> looks at the URL and decides which Page to show inside the main <Layout />.
The Page loads its data and uses many small Components to display everything you see.
1. Project Configuration (The Blueprints)
These files set up your project, manage its dependencies, and tell the build tools how to work.

File	Simple Explanation	How it Works
package.json	The Recipe List. It lists all the "ingredients" (code libraries) your project needs and provides command "shortcuts."	dependencies are libraries needed for the app to run (like React). devDependencies are tools needed only for development (like Vite). scripts are shortcuts, so npm run dev actually runs the vite command.
vite.config.js	Instructions for the Builder (Vite). It tells Vite how to build and serve your app.	It adds the React plugin, sets up the handy @ shortcut to point to your src folder, and tells the development server to run on port 3000.
tailwind.config.js	The Style Guide. Configures Tailwind CSS, your styling framework.	It tells Tailwind where to look for class names (in your .jsx files) and defines your app's color palette, fonts, and spacing system using the variables from index.css.
postcss.config.js	A Helper for Styling. It runs plugins that make your CSS work across all browsers.	It automatically adds vendor prefixes (like -webkit-) to your CSS so you don't have to worry about browser compatibility.
components.json	UI Library Config. This is specific to the shadcn/ui library.	It tells the shadcn/ui command-line tool where to find your files and how to add new components to your project.
2. The Application Entry Point
These files are the very first things the browser uses to start your app.

File	Simple Explanation	How it Works
index.html	The Front Door. This is the single HTML page the browser loads.	It's mostly empty. It has a crucial <div id="root"></div>, which is the container where React will build the entire application. It also has a <script> tag that loads your JavaScript.
src/main.jsx	The Ignition Switch. This is the JavaScript file that starts everything.	It finds the <div id="root"> from index.html and tells React to render your main <App /> component inside it. It also wraps your app in <BrowserRouter>, which activates the URL-based navigation.
3. Core App Structure
These files define the overall layout and routing of your application.

File	Simple Explanation	How it Works
src/App.jsx	The Main Router. It looks at the URL and decides which page to display.	It uses the react-router-dom library. It defines a main route / that renders the <Layout />. Inside that, it has nested routes (/dashboard, /leads) that determine which "page" component gets rendered within the Layout.
src/lib/Layout.jsx	The App's Frame. This is the sidebar, header, and main content area that is shared across all pages.	It displays the navigation sidebar and the top header. The key part is <Outlet />. This is a placeholder from react-router-dom where the current page's component (Dashboard, Leads, etc.) will be inserted.
src/lib/index.css	Global Stylesheet. Defines the base styles and color theme for the entire app.	It sets up Tailwind's base layers and defines CSS variables (like --primary) that tailwind.config.js uses to create your theme (e.g., bg-primary).
4. Reusable UI Components (src/components)
These are the visual building blocks of your application. They are broken into two types:

src/components/ui/ (The LEGO Bricks)
These are generic, reusable components that define the look of basic elements.

File	          Simple Explanation
button.jsx	    A styled button.
card.jsx	      A container with a border and shadow, for holding content.
dialog.jsx	    A pop-up modal window.
input.jsx	      A styled text input box.
badge.jsx	      A small, colorful label.
sidebar.jsx	T    he set of components used to build the main sidebar.

src/components/{activities, dashboard, leads}/ (The Assembled LEGO Models)
These are "smarter" components built for a specific purpose by combining the basic ui components.



File	                Simple Explanation	How it Works
MetricCard.jsx	      A single dashboard card showing one number (e.g., "Total Leads").	It receives data (a title, a value, an icon) as props from the Dashboard.jsx page and displays it in a styled <Card>.
LeadCard.jsx	        A single card representing one lead on the Leads page.	It receives a single lead object as a prop and displays its name, company, score, and buttons.
AddLeadDialog.jsx	    The pop-up form for creating a new lead.	It manages the form's state (what the user is typing). When the "Add Lead" button is clicked, it calls Lead.create() to save the data.

5. Pages (src/pages)
These are the main screens of your application. They assemble various components to create a complete view.

File	                    Simple Explanation	How it Works
*************************************************************
Dashboard.jsx	            The main dashboard page.	1. It uses useEffect to call Lead.list() and Activity.list() to fetch data when it first loads. 2. It holds this data in its state (useState). 3. It passes this data down as props to its child components (MetricCard, TopLeads, LeadPipeline, etc.).
Leads.jsx	                the lead management page.	It fetches all leads using Lead.list(). It manages the search and filter state. When you click "AI Insights", it calls the InvokeLLM function. It then maps over the filteredLeads array and renders one <LeadCard> for each lead.
Activities.jsx	          The activity tracking page.	Similar to the other pages, it fetches all activities and leads, then organizes them into "Overdue," "Upcoming," and "Completed" lists, rendering an <ActivityCard> for each.


6. Data and Logic (The Brains)
These files handle where your data comes from and how it's managed. This is the "mock backend" part of your local setup.

File	                              Simple Explanation	How it Works
***********************************************************************
src/entities/all.js	                The "Fake" Database. This file simulates a real database by using your browser's localStorage.	The EntityBase class provides list, create, and update methods. Instead of sending requests to a server, it just reads and writes JSON data to localStorage. It exports Lead and Activity objects that your pages can use to interact with this fake database.
src/entities/Lead.js & Activity.js	Data Blueprints. These files define the structure (or schema) of your data.	They are simple JSON objects that describe what fields a "Lead" or "Activity" should have. They are not directly used in your local mock setup but are essential for a real backend or for auto-generating forms.
src/integrations/core.js	          The "Fake" AI. This file simulates a call to a powerful AI model.	The InvokeLLM function pretends to do a lot of work but simply waits for 1.5 seconds and returns a pre-written, hard-coded response. This lets you build the UI without needing a real (and expensive) AI API key during development.
src/lib/sampleData.jsx	            Initial Data. This file contains a starting set of leads and activities.	src/entities/all.js imports this data and uses it to populate the "fake" database (localStorage) the very first time you run the app, so you don't start with a blank screen.
src/utils.js	                       Utility Helpers. A toolbox of small, reusable functions.	Contains cn (a function for combining CSS classes conditionally) and createPageUrl (a simple helper for generating URLs).
