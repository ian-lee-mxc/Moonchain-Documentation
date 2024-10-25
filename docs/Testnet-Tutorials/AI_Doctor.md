---
sidebar_position: 9
---
import Ragflow1 from '/img/Ragflow/Ragflow1.png';
import Ragflow2 from '/img/Ragflow/Ragflow2.png';
import Ragflow3 from '/img/Ragflow/Ragflow3.png';
import Ragflow4 from '/img/Ragflow/Ragflow4.png';
import Ragflow5 from '/img/Ragflow/Ragflow5.png';
import Ragflow6 from '/img/Ragflow/Ragflow6.png';
import Ragflow7 from '/img/Ragflow/Ragflow7.png';
import Ragflow8 from '/img/Ragflow/Ragflow8.png';
import Ragflow9 from '/img/Ragflow/Ragflow9.png';
import Ragflow10 from '/img/Ragflow/Ragflow10.png';
import Ragflow11 from '/img/Ragflow/Ragflow11.png';


# Build your own AI-Doctor with the use of Moonchain, RagFlow & WearFI
This tutorial will guide you through creating an AI Doctor that analyzes health data from Moonchain using Ragflow as a local instance and TypeScript. We will cover data collection, processing, and report generation using Gemini as LLM.

## Overview
1. Collect Moonchain Data: Use Moonchain smart contracts to get health data events.
2. Process with Ragflow: Format and send the data to Ragflow to receive AI-generated insights.
3. Display Results: Present the analyzed data or publish it.

## Prerequisites
- Basic knowledge of TypeScript and blockchain
- Access to Moonchain data APIs
- npm installed (The installation of npm is explained on the following domain: [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager))
### Set up Ragflow to get the required Conversation API key
- To be able to interact with the Conversations API of Ragflow, a local instance of Ragflow is now required. This can be obtained from the following repository: https://github.com/infiniflow/ragflow. To do this, follow steps 1-5 under “Get started” in the README.md of the repository.
**Important:** In order to obtain the correct version, the `RAGFLOW_IMAGE` variable in docker/.env should be set to the value`RAGFLOW_IMAGE=infiniflow/ragflow:v0.12.0` before executing step 3 of the readme. 
- An API key from Google's Gemini, which can be obtained from the following page: [https://ai.google.dev/](https://ai.google.dev/). To obtain an API from Google, you need a Google Account.

After we have successfully started our container, we can access our UI with one of the IP addresses that were issued in step 4. For the sake of simplicity, we will use the address `127.0.0.1` in this explanation. To continue with Ragflow, we go to the page http://127.0.0.1/login
<img src={Ragflow1} alt="Ragflow1" style={{ maxWidth: '70%', height: 'auto' }} />
We create a new account there (note: this account only exists locally and has no link to Ragflow Demo) and log in to it. 
<img src={Ragflow2} alt="Ragflow2" style={{ maxWidth: '70%', height: 'auto' }} />

After logging in, we first call up the settings by clicking on the profile picture at the top right, select “Model Providers” from the left selection menu and select Gemini and enter our API key previously obtained from Google there.
<img src={Ragflow3} alt="Ragflow3" style={{ maxWidth: '70%', height: 'auto' }} />
Now that we have created access to our desired model for Ragflow, the next step is to create the Knwoledge base that our AI doctor will use. We select this via the top menu and first enter a name for our knowledge base
<img src={Ragflow4} alt="Ragflow4" style={{ maxWidth: '70%', height: 'auto' }} />
We save this setting and next select the `Dataset` item from the left-hand menu, where we can now store the files that our chatbot should use as its knowledge base. These files are located in the repository for our project [https://github.com/MajorDomDePIN/MajorDoms_AI_Doctor/tree/final](https://github.com/MajorDomDePIN/MajorDoms_AI_Doctor/tree/final) in the folder 'knowledge_base'. By clicking on 'Add files', we can now make them available from our local file system to our local Ragflow instance.
<img src={Ragflow5} alt="Ragflow5" style={{ maxWidth: '70%', height: 'auto' }} />
In order to prepare the provided files ideally for use by Large Language models (LLM), they must be divided into individual chunks. We initiate this by clicking on the green play button next to each file; it may be necessary to initiate this process several times before it is fully completed. 

<img src={Ragflow6} alt="Ragflow6" style={{ maxWidth: '70%', height: 'auto' }} />

As soon as the chunking of our files has been completed, we can start configuring the chat by selecting the corresponding tab from the top menu. 

<img src={Ragflow7} alt="Ragflow7" style={{ maxWidth: '70%', height: 'auto' }} />
We click on 'Create an Assistant', enter a name in the pop-up window, select our previously created knowledge base at the bottom, and deactivate the 'Show Quote' option, which otherwise would include references to the knowledge base in the model's response—something we do not want in this case.
<img src={Ragflow8} alt="Ragflow8" style={{ maxWidth: '70%', height: 'auto' }} />
We click on 'Create an Assistant' and enter a name in the window that opens and select our previously created knowledgebase at the bottom and also deactivate the 'Show Quote' option, which would mean that the answer of our model would also include the knowledgebase used.
<img src={Ragflow9} alt="Ragflow9" style={{ maxWidth: '70%', height: 'auto' }} />
To complete our assistant configuration, we switch to the last tab, 'Model Setting', and select the gemini-1.5-pro-latest model. With this, our assistant configuration is complete.

<img src={Ragflow10} alt="Ragflow10" style={{ maxWidth: '70%', height: 'auto' }} />
To obtain our API key, we hover over the previously created chat object until a menu icon appears. By positioning the mouse over it, an additional menu opens where we can select 'Chat Bot API'. In the window that opens, we can see both the URL where our chatbot can be accessed and the option to create a new key by clicking 'API Key' and then 'Create new API Key'. We save this key so that we can use it later with our script.
<img src={Ragflow11} alt="Ragflow11" style={{ maxWidth: '70%', height: 'auto' }} />
## Getting Started
### Setting up the project environment
1. We start by creating our project folder and then call it up
   ```
   mkdir AI_Doctor
   cd AI_Doctor/
   ````
2. Our next step is to initiate our project with npm
   ```
   npm init -y
   ````
3. Install TypeScript and Node.js-related dev dependencies
   ```
   npm install typescript ts-node @types/node --save-dev
   ````
    **typescript:** The TypeScript compiler, used to compile .ts files into JavaScript.

    **ts-node:** Allows you to directly run TypeScript files in Node.js without needing to manually compile.

    **@types/node:** Provides TypeScript definitions for Node.js, improving development by giving access to Node.js built-in modules like fs, http, etc.

4. Initialize the TypeScript configuration file. This creates a tsconfig.json file, where you can configure TypeScript settings for your project (e.g., compiler options, target output, etc.).
   ```
    npx tsc --init
   ````
5. We will use your following dependencies in our project: 

    **ethers:** A library that simplifies interactions with Ethereum (or Moonchain) smart contracts, allowing you to make transactions, retrieve data, or listen to blockchain events.

    **axios:** A promise-based HTTP client that makes API requests to Moonchain or RagFlow easy to handle.

    **zlib:** A library for handling compression and decompression, used for processing compressed data such as Brotli.

    **@doitring/analyzkit:** Provides tools for analyzing health data collected by Moonchain’s WearFI devices. It helps group, rate, and generate statistics on various health metrics like sleep, steps, heart rate, and oxygen levels.

    To install these dependencies, we use the following command:
   ```
   npm install ethers axios zlib @doitring/analyzkit
   ````

## Step 1: Collecting Data from Moonchain

This step focuses on gathering health-related data from Moonchain by tracking events emitted by a specific smart contract. Here’s how the process works:

**Data Source & ABI Definition**

The data comes from the Moonchain network, accessed via the Geneva RPC endpoint ([https://geneva-rpc.moonchain.com](https://geneva-rpc.moonchain.com)). Our script listens to the blockchain to collect data from the smart contract at address **0x457c1542a68550ab147aE2b183B31ed54e081560**.

The ABI (Application Binary Interface) for the `Claimed` event is defined, detailing the structure of the emitted event data. The ABI includes important fields such as token ID, uid, and health-related metrics in compressed form. It can be found at the following link: [https://github.com/BlueberryWearFi/analyzkit/blob/main/ABI.json](https://github.com/BlueberryWearFi/analyzkit/blob/main/ABI.json)

Using the `ethers.js` library, the script filters logs by setting a block range and listens for `Claimed` events emitted by the specified smart contract. For each event, relevant data is extracted.

**Data Parsing and Decompression**

The script parses each event log, and any compressed health data is decompressed using zlib (specifically for Brotli compression). This converts the binary data into readable JSON format, which contains specific health metrics such as steps, sleep data, etc.

Finally, the script saves the parsed health data (e.g., token ID, timestamp, decompressed content) in a structured array for further analysis. The output will be used in subsequent steps to process and format the data for AI-based insights.

Here is the script that performs the process described in Step 1:

[https://github.com/MajorDomDePIN/MajorDoms_AI_Doctor/blob/IAN/app/query_events.ts](https://github.com/MajorDomDePIN/MajorDoms_AI_Doctor/blob/IAN/app/query_events.ts)

## Step 2: Processing and Sending Data to Ragflow

In this step, the collected health data is sent to RagFlow for analysis and AI-generated insights. Here's how the process works:

**API Communication with RagFlow**

The script communicates with the RagFlow API to send the collected health data for analysis. It uses the `axios` HTTP client to handle requests. A new conversation is initiated with RagFlow by sending a GET request to create a unique conversation ID. This ensures that the interaction is logged for future exchanges.

**Structuring the Data**

The collected health data is embedded into a question for RagFlow, formatted as if asking a health advisor for personalized advice. This structured query includes the token ID and health metrics from the past week.

**Submitting Data to RagFlow**

The formatted question is then sent to RagFlow via a POST request. This triggers the AI processing, and RagFlow generates a response based on the health data, delivering personalized health advice.
Receiving the Response

Once RagFlow processes the data, it returns an AI-generated response. This response is logged to the console, providing personalized health suggestions based on the input data. This response will be used for further analysis or presentation in later steps.

Here is the script that performs the process described in step 2:

[https://github.com/MajorDomDePIN/MajorDoms_AI_Doctor/blob/final/app/ragflow_sender.ts](https://github.com/MajorDomDePIN/MajorDoms_AI_Doctor/blob/final/app/ragflow_sender.ts)

## Step 3: User Interaction and Full Health Report Generation

This part combines user interaction, health data processing, and RagFlow integration into one cohesive process.

    **User Input for Token ID:** The script prompts the user to enter a specific tokenId. This tokenId serves as a unique identifier to filter and analyze the relevant health data collected on the blockchain.

    **Data Processing with Analyzkit:**
        Sleep Data Analysis: The script processes sleep data using the Analyzkit library. It groups the data daily and breaks it down into deep sleep, light sleep, and REM stages. This daily analysis allows for detailed sleep reports.
        Processing Other Health Metrics: Steps, heart rate, and oxygen levels are processed weekly using Analyzkit. Grouped by week, these metrics are analyzed to determine totals, averages, and scores for overall health performance.

    **Generating a Detailed Health Report:** The script combines the sleep analysis and other health metrics into a comprehensive health report. This report includes detailed breakdowns of sleep data for each day and summary statistics for steps, heart rate, and oxygen levels.

    **Sending the Report to RagFlow:** The final step sends the compiled health report to RagFlow via Step 2. RagFlow then generates AI-based insights and returns personalized health suggestions, which are logged and made available for further review.

In this final step, the Analyzkit library plays a crucial role in processing the health data, ensuring accurate analysis before sending it to RagFlow for AI-driven recommendations. This integration completes the AI-Doctor workflow by producing actionable insights from raw health data.

Here is the final script that controls and integrates the previous scripts:

https://github.com/MajorDomDePIN/MajorDoms_AI_Doctor/blob/final/app/main_testing.ts

Since this is the final script, it manages and summarizes the functionality of all previous scripts, providing an overarching structure.