Unreleased

### Content Review Filters

- The reduced detail filter's WebGL context is now created on first use instead
  of at import time. Importing the package no longer allocates a canvas, and no
  longer throws in environments without WebGL2 or `OffscreenCanvas`.
- Reduced detail now degrades instead of throwing when WebGL2 is unavailable:
  the media stays covered, the CSS based filters keep working, and the new
  `onReducedDetailUnavailable` prop on either provider reports it once per
  media.
- Video without reduced detail is drawn straight to the 2d canvas, so it plays
  where WebGL2 is missing. It is also no longer resampled through a square
  texture, which makes the unfiltered frame slightly sharper.
- `sideEffects` is declared in `package.json`, so bundlers can drop what an app
  does not reference.

  0.0.1 (Month Day, YEAR)

### Content Review Filters

- Initial release of the Content Review Filters
