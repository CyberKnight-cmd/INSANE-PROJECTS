# GenAI Crime Summarizer API

## Project Goal

This project is a standalone backend service designed to provide processed and summarized crime data for a specific geographic area. It follows a "Fetch Once, Serve Many Times" architecture to ensure high performance and minimize reliance on external APIs.

The system performs a one-time bulk fetch of raw crime reports, processes them using a GenAI model for natural-language summarization, stores them locally, and then serves them to a frontend application through a clean, paginated REST API.

---

## Core Features

-   **One-Time Data Fetch:** Retrieves a large set of crime data (~1000 records) from an external crime data API and stores it locally.
-   **GenAI Summarization:** Each crime report is processed to generate a concise, human-readable summary (≤ 100 characters).
-   **Data Enrichment:** Raw data is enriched with formatted dates and a categorized time of day (Morning, Afternoon, Evening, Night).
-   **Efficient Serving:** The API serves data from a local JSON file, ensuring fast response times.
-   **Paginated API:** Endpoints are designed to serve data in manageable chunks (e.g., 3 records at a time) with a "load more" capability.

---

## System Architecture & Workflow

The backend is organized into distinct modules, each with a specific responsibility.

1.  **Data Fetching (`/services`):**
    -   `locationService.js`: (Optional) Uses an API like Google Maps to define geographic boundaries.
    -   `crimeApiService.js`: Responsible for the single API call to a crime data provider (e.g., Crimeometer, SpotCrime) to get the raw data.

2.  **Data Storage (`/storage`):**
    -   `crimes.json`: A local JSON file that acts as our database, storing the raw crime records after the one-time fetch.

3.  **Data Processing (`/utils`):**
    -   `summarizer.js`: Connects to a GenAI service (like OpenAI) to process long descriptions into short summaries.
    -   `dateFormatter.js`: Formats timestamps into user-friendly dates and categorizes the time of day.

4.  **API Logic (`/controllers` & `/routes`):**
    -   `crimeController.js`: The "brain" of the API. It reads from `crimes.json`, uses the utility modules to process the data on the fly, and handles pagination logic.
    -   `crimeRoutes.js`: Defines the API endpoints and connects them to the controller functions.

5.  **Server Entry Point (`app.js`):**
    -   Initializes the Express server and registers the API routes.

---

## How it Appears on the UI (Frontend Interaction)

This backend is designed to power a simple and clean user interface.

1.  **Initial Load:** When the user opens the app, the frontend makes a call to **`GET /api/crimes`**. The backend responds with the **3 most recent crime summaries**. The UI displays these as a list.

    *Example UI Element:*
    > **Theft/Larceny** - _Evening, Aug 11, 2023_
    > An individual reported a potential vehicle theft in progress on Broad St. Suspect fled the scene.

2.  **Loading More:** The UI has a "Load More" button. When clicked, the frontend uses the `nextOffset` value from the previous API response to make a new call, for example, to **`GET /api/crimes?offset=3`**. The backend then returns the *next* 3 crime summaries, which the frontend appends to the existing list.

3.  **No More Data:** When the last page of data is reached, the backend will return `nextOffset: null`. The frontend will see this and can hide the "Load More" button.

---

## API Endpoints

### Get Crime Summaries

-   **Endpoint:** `GET /api/crimes`
-   **Description:** Fetches a paginated list of summarized crime reports, sorted by most recent.
-   **Query Parameters:**
    -   `offset` (optional, number): The starting index for fetching records. Defaults to `0`.
-   **Success Response (200 OK):**
    ```json
    {
      "crimes": [
        {
          "id": "123",
          "summary": "Report of breaking and entering at a residential location on Elm Street.",
          "date": "Aug 11, 2023",
          "timeOfDay": "Evening"
        },
        {
          "id": "124",
          "summary": "Vandalism reported at the city park. Graffiti was found on a public bench.",
          "date": "Aug 11, 2023",
          "timeOfDay": "Afternoon"
        }
      ],
      "nextOffset": 2
    }
    ```

---

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd GenAI-Crime-Summarizer
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the root directory and add your API keys:
    ```env
    # Port for the server to run on
    PORT=3001

    # API key for the GenAI service (e.g., OpenAI)
    OPENAI_API_KEY="sk-..."

    # API key for the crime data service
    CRIME_DATA_API_KEY="..."
    ```
4.  **(One-Time) Fetch and Store Live Data:**
    Run the data fetching script to populate `storage/crimes.json`.
    ```bash
    node fetch-and-store.js
    ```
5.  **Start the server:**
    ```bash
    npm start
    ```
    The API will now be running on `http://localhost:3001`.