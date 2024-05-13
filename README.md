🥇 Best Overall Hack

## Inspiration
As Computer Science students, we're all too used to first-times seeing hashmaps and inductive proofs on the board: sitting through a 2-hour lecture without knowing anything happening. We're not the only ones experiencing this. University students are spending over **3000 hours** of their academic career in lectures. At the same time, **80% of lecture material is lost**, making it difficult for busy academics to keep up with their educational aspirations

Instead of forcing a routine upon students, why not leverage the universally natural form of learning: through *storytelling*. By leveraging visual learning instead of rote memorization, we created a browser-accessible mobile app simplifying complex lecture content into story-based tiktok's

## What it Does
Tidbits transforms any lecture (audio or visual) into fun, byte-sized shorts, or "Tidbits" with a one-click upload. We leverage what students are already familiar with: short-form video series with a core scroll-based functionality popularized by TikTok. Our goal is to transform these traditionally unhealthy and **unintentional** forms of entertainment into **deliberate methods of active learning**.

## Crafting use case flows
We wanted to create a universally accessible platform available to students of any background and learning style. We crafted 3 core flows:
**Generating content**: straightforward, one-click generation from raw video to 5-10 series reels
![learning](https://cdn.discordapp.com/attachments/1221634008656642048/1224108366905872537/Screenshot_2024-03-31_at_5.29.33_PM.png?ex=661c4ac1&is=6609d5c1&hm=b2b1aa690947e5daec55c59fe00ef62aa8f5d3ef52691e2837c740d76d43ae26&)
**Story-based learning**: when short on time, bring a quick 1-2 minute summary of key concepts extracted from a 1-2 hour lecture (ex: student is recalling key terms before a test)
**International language translation**: transform complex material explained in English to any language selected by the audience (ie. international students)
<img src="https://cdn.discordapp.com/attachments/1221634008656642048/1224107936943439942/Screenshot_2024-03-31_at_5.27.35_PM.png?ex=661c4a5a&is=6609d55a&hm=0a2b63cc50f298a1efdebde746797ce5341fa32ac2013d0ccb6f2c2341279d72&" alt="personalization"/>

We mapped all of our use cases inside of user flow diagrams to visualize the unique user journeys of different segments of university students and learners.
![Use case flows](https://cdn.discordapp.com/attachments/1221634008656642048/1224001221526950098/Screenshot_2024-03-31_at_10.23.48_AM.png?ex=661be6f8&is=660971f8&hm=51304e966f137ad896cacd34905063d1eb21478738b520b5a9bb78f0e9919f3e&)

## Design Process
Our design process targeted 2 core areas to maximize the intuitiveness of our platform in demanding situations (ex: studying a lecture right before an exam) and to increase the content value of lectures - ultimately increasing engagement with the class material
**Bold, bright branding**: universally accessible and readable. Easy to click on mobile screens
**User personalization without decision-making**: users focus on prompting what they want (ex: algorithms, data tables, etc) and we make the decisions for them.
![select topics](https://cdn.discordapp.com/attachments/1221634008656642048/1224107937207947424/Screenshot_2024-03-31_at_5.27.50_PM.png?ex=661c4a5b&is=6609d55b&hm=add328d7c1374dd0af602cb91de9a054eb5b85d91578079ac0149f579cba7328&)
## How we built it (Technical)
Leveraging the latest in AI technology, including Anthropic's Claude, Suno AI, Eleven Labs, D-iD, Whisper, and DALL-E, Tidbits is a revolutionary application that splices together outputs from these AI to form a cohesive, edited short.

![Tech Stack](https://cdn.discordapp.com/attachments/1221634008656642048/1224104544913592350/image.png?ex=661c4732&is=6609d232&hm=e4cf66edfa1e045897c86a6c7efd247c3a207d3be3e6710e22510058a2c18396&)

Music, visuals, and a realistic presenter are engineered to make learning easy. Tidbits is the next step in delivering and consuming educational content in a generation raised through minute-long videos.

Extensive time was spent to optimize and speed up the reel creation pipeline. Strategies included using threads, asyncio, aiohttp, advanced processing, parallel chunking, and modularization to bring the entire pipeline from 30 minutes per video to 5 minutes.

Here is the entire pipeline sequence:
1. Lectures get uploaded to our FastAPI backend from the Next.js frontend
2. Audio is extracted and chunked to increase speed, all chunks are processed at the same time for maximum efficient
3. A script and music style is generated at the same time in preparation for future steps
4. Since music takes the longest to generate, a separate thread is spun up to generate music
5. While music is generating, a talking head video is generated
6. Then using the audio from the talking head, a transcript for subtitles is created, as well as 
Images are generated based on the content at that moment
7. Finally music, images, talking heads, and subtitles are stitched together in one cohesive manner.

## Challenges we ran into
Integrating so many different AIs to edit a cohesive reel was our greatest challenge. Getting all the information synchronized (captions, audio, images, and timestamps) was difficult. We also had to reverse-engineer the Suno AI, as no public API exists yet. We also had to use multithreading and asynchronous I/O to speed up our processing.

For the API middle layer, constructing a good database schema to handle a variety of queries was also a challenge. Fortunately, FASTAPI and Supabase allowed us to adjust and iterate quickly.

For the frontend, creating the auto-playing tidbit screen was hard as the web does not support auto-playing video with sound easily, and there were a lot of difficulties in getting the right scroll and dragging behavior right alongside video positioning. Additionally, managing states and UI updates effectively without complicating the code was a hurdle the frontend team had to overcome.

## Accomplishments that we're proud of
Seeing our first few successful tidbits come to life was amazing! Given the hurdles we faced along the way, we were apprehensive about our final product. However, we split our tasks efficiently and went at it. We also helped each other out as much as possible. That allowed us to reach most of our goals by the end of the hackathon.

## What we learned
- Asyncio and aiohttp for fast multithreaded performance across multiple clients
- Process binary files in Python across multiple libraries and APIs as well
- Efficiently managing multiple threads for optimal performance and speed (30 min to 4 min, 7.5x speedup)
- Some libraries only work with Python 3.9 and not 3.10 (spent 6 hours on this >:\)
- How do edit videos and audio using Python
- Utilizing timestamps from stt for accurate detection of words
- How to read other people’s frontend code and understand it quickly
- Supabase is very flexible and easy to work with
- (Spaghetti code is bad) To thoroughly plan out states ahead of time

## What's next for Tidbits
Implementing more customization options to generate tidbits for users. Potentially integrating screenshots from the uploaded lectures, or pulling images from the internet to supplement the image generation.

## Sources
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10916696/
https://journals.physiology.org/doi/full/10.1152/advan.00109.2016

