There are two built-in solutions for us to extract voice and video data from the call:
- Transcriptions
- Recordings

#### Transcriptions

**Transcriptions** are voice recording streams which are being streamed to a third-party service to analyze them and convert to text.

Concerns:
- Transcriptions record a mixed down stream of audio which makes it impossible to connect particular voice with particular user in our sim. It's possible to differentiate different speakers in the audio stream, but it's just an algorithm or AI which tries to distinguish the difference. We will not get a stable result - it will always depend on different conditions as audio quality, speaking at the same time, similar voice and stuff.
- Even if we have different speakers defined correctly as "Speaker1", "Speaker2", it's manual or complex scripted work to match these speakers to actual users.

#### Recordings

**Recordings** are virtual browsers (bot participants) who just sit on the call and recording what it "sees" and "hears".

Concerns:
- Recordings record a tile view or main speaker view of the call, basically close to what a regular user sees on the call.
	- With tile view, it's quite difficult and unstable to analyze emotions and other parameters based on a small tile in the grid. When multiple people talk at the same time, it's difficult to distinguish who is actually speaking.
	- With main speaker view, we see the video only of the person show is currently speaking. So the result of analysis depends on how well the system detect who is actually speaking and who just made noise. When one person speaks, rest of videos of people are lost. This also makes it difficult to match voice to video as well, though detection of "most likely current speaker" simplifies.
- Same concern as with Transcriptions. The feed is mixed down making it very complex and unstable to detect and then match different speakers.

#### Summary of built-in solutions

These solutions provide a good basement of recordings, but using the data that we will get is quite complicated. Transcriptions are better just in a way of consuming resources. Recordings are same as transcriptions, but with a video feed added making it simpler to detect a speaker, though still quite complicated. A video feed is limited - participant video is either small or limited to 1 at a time (current speaker). An audio feed is mixed down in both solutions.

#### Alternative, self-developed solution

The built-in recording solution mixes down all participants most likely because of resource usage constraints and the fact that most clients of Jitsi don't need separate streams for each participant.

We can implement our own bot which connects to the call as a client, listens to each participant separately and saves this to a separate media file.

Pros of our own bot:
- Detailed and very precise match between video/voice and user id (making it easy to analyze each user separately and provide precise feedback)
- The video quality is original (kinda, the video that we get from user), it's not a tiny pile in a tile view
- The audio is not mixed with other voices - clear analysis
- Result of development and analysis is stable and predictable.
Cons:
- Development time may be longer than development of matching algorithm for the mixed down recording, though not clear how much. The development of matching algorithm could take even more time with unexpected result.
	- Optimizations of performance and robustness of the solution may take more time after initial development and launch. The solution will require maintenance.
- *Not really bad side of the solution,* but an obvious consequence of approach: there is a huge performance cost of each recording (each room) as there is a recorder session running for each separate participant. Though performance cost of post processing a mixed down stream may be quite high too.