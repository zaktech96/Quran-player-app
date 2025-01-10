# TODO List

## High Priority
- [ ] Implement audio-verse synchronization
  - [ ] Fetch and store verse timing data from API
  - [ ] Track current audio timestamp and update active verse
  - [ ] Auto-scroll to current verse during playback
  - [ ] Highlight active verse during audio playback
  - [ ] Handle verse transitions smoothly
  - [ ] Add visual indicator for current verse position
  - [ ] Sync verse text changes with audio segments
- Fix verse progress calculation lag
  - Current issue: Progress percentage lags behind actual recitation
  - Current calculation: `((currentAyahIndex + currentVerseProgress) / currentAyahs.length) * 100`
  - Need to sync with audio timestamps more accurately
  - Consider using audio events for more precise tracking
  - Implement buffering indicator for loading states
  - Add proper error handling for audio sync issues

## Future Improvements
- [ ] Add verse bookmarking
- [ ] Implement search functionality
- [ ] Add different translation options
- [ ] UI Layout Improvements
  - [ ] Extend Surah list column height to align with audio player
  - [ ] Adjust ScrollArea height dynamically based on player state
  - [ ] Ensure consistent spacing between list and player controls
- [ ] Support multiple audio recitations
- [ ] Add offline support
- [ ] Implement user preferences
- [ ] Add sharing capabilities
